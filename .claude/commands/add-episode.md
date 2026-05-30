# Add New Episode to AI Audit Hub

## Skill: /add-episode

เมื่อ user เรียกใช้ skill นี้ ให้ทำตามขั้นตอนด้านล่างเพื่อเพิ่ม EP ใหม่เข้าเว็บ AI Audit Hub

## ข้อมูลที่ต้องถาม user (ถ้ายังไม่ได้ให้มา)

1. **หมายเลข EP** — EP ไหน (EP5, EP6, ...)
2. **ชื่อเรื่อง** — เช่น "EP5 Data Analytics for Audit"
3. **คำอธิบาย** — 1 บรรทัดอธิบายเนื้อหาคลิป
4. **ไฟล์วิดีโอ** — ชื่อไฟล์ MP4 (จะถูกวางใน `assets/`)
5. **ไฟล์ Thumbnail** — ชื่อไฟล์ PNG (จะถูกวางใน `assets/`)
6. **Timestamps** — รายการ timestamp พร้อม label (เช่น "1:10 สร้าง Agent, 8:20 Combo Agent")
7. **ความยาวคลิป** — เช่น "15:30 นาที" (ถ้าไม่รู้จะอ่านจาก MP4 header)

### ข้อมูลเสริม (ถามเพิ่มถ้า user ให้มา)

8. **PDF เอกสารประกอบ** (optional) — ชื่อไฟล์ PDF + label สำหรับปุ่มดาวน์โหลด
9. **เนื้อหาเพิ่มเติม** (optional) — ข้อความเพิ่มที่จะใส่ใน "เกี่ยวกับคลิปนี้" (รองรับ HTML เช่น prompt template)

## ขั้นตอนการทำงาน

### Step 1: ค้นหาและตรวจสอบไฟล์

1. ค้นหาไฟล์ในเครื่อง — ใช้ `find` ใน `C:/ProjectX/X.22` และ `C:/Users/USER/Downloads`
2. Copy ไฟล์ที่เจอเข้า `assets/`
   - Thumbnail: rename ให้เป็น `Thumnail Ep{N}.png` (เข้ากับ pattern เดิม)
   - PDF: copy ตามชื่อเดิม
3. **ตรวจขนาดไฟล์** — ถ้า MP4 ≥ 95 MB ให้เตือน user ว่าใกล้ limit 100 MB ของ GitHub (push ไม่ได้ถ้าเกิน)
4. อ่านความยาวคลิปจาก MP4 header (ถ้า user ไม่ได้ให้มา):

```python
python -c "
import struct, os

def get_mp4_duration(path):
    with open(path, 'rb') as f:
        file_size = os.path.getsize(path)
        pos = 0
        while pos < file_size:
            f.seek(pos)
            header = f.read(8)
            if len(header) < 8:
                break
            size = struct.unpack('>I', header[:4])[0]
            box_type = header[4:8]
            if size == 0:
                break
            if size == 1:
                ext = f.read(8)
                size = struct.unpack('>Q', ext)[0]
            if box_type == b'moov':
                pos += 8
                continue
            elif box_type == b'trak':
                pos += 8
                continue
            elif box_type == b'mdia':
                pos += 8
                continue
            elif box_type == b'mvhd':
                version = struct.unpack('>B', f.read(1))[0]
                f.read(3)
                if version == 0:
                    f.read(4); f.read(4)
                    ts = struct.unpack('>I', f.read(4))[0]
                    dur = struct.unpack('>I', f.read(4))[0]
                else:
                    f.read(8); f.read(8)
                    ts = struct.unpack('>I', f.read(4))[0]
                    dur = struct.unpack('>Q', f.read(8))[0]
                if ts > 0:
                    secs = dur / ts
                    m = int(secs // 60)
                    s = int(secs % 60)
                    print(f'{m}:{s:02d}')
                    return
            pos += size

get_mp4_duration(r'FILEPATH')
"
```

### Step 2: แก้ไข app.js — อัปเดต VIDEOS array

- อ่าน `app.js`
- หา entry ของ EP ที่ต้องการอัปเดต (เช่น v05 สำหรับ EP5)
- เปลี่ยนจาก Coming Soon เป็นข้อมูลจริง:
  - `title` — ชื่อเรื่อง
  - `category` — เปลี่ยนเป็น `'AI for Audit'`
  - `duration` — เช่น `'34:08 นาที'`
  - `tag` — เปลี่ยนเป็น `'ใหม่'`
  - `src` — path ไฟล์ MP4
  - `thumbImg` — path ไฟล์ PNG
  - `desc` — คำอธิบาย (รองรับ HTML)
  - `timestamps` — array of `{ time, seconds, label }`
  - `downloadPdf` (ถ้ามี) — `{ name, src, label }` สำหรับปุ่มดาวน์โหลดเอกสาร

#### ตัวอย่าง entry ที่สมบูรณ์ (EP4 เป็น reference):

```javascript
{ id: 'v04', title: 'EP4 Build IA Tools (Using Python+AI)', category: 'AI for Audit', duration: '34:08 นาที', tag: 'ใหม่', thumb: 't4', initials: 'EP4',
    src: 'assets/Build IA Tools(Using Python+AI).mp4',
    thumbImg: 'assets/Thumnail Ep4.png',
    desc: 'สอนใช้ AI สร้าง IA Tools ด้วย Python Code & Streamlit',
    downloadPdf: { name: 'Streamlit_AI_Playbook.pdf', src: 'assets/Streamlit_AI_Playbook.pdf', label: 'เอกสารประกอบการเรียนรู้' },
    timestamps: [
      { time: '0:45', seconds: 45, label: 'ติดตั้ง Program จำเป็น' },
      { time: '4:10', seconds: 250, label: 'สร้าง Code' },
    ] },
```

### Step 3: เนื้อหาเพิ่มเติมใน desc (ถ้ามี)

ถ้า user ให้เนื้อหาเพิ่มเติม (เช่น prompt template, วิธีใช้):
- ต่อท้าย `desc` ด้วย HTML ที่จัดรูปแบบสวยงาม
- ใช้ class ที่มีอยู่แล้ว: `prompt-box`, `prompt-header`, `prompt-body`, `prompt-section`, `prompt-label`, `prompt-hint`

### Step 4: Push ขึ้น GitHub

```bash
git add app.js assets/
git commit -m "Add EP{N} {title} — new video episode"
git push origin main
```

⚠️ ถ้า push แจ้ง warning เรื่องไฟล์ใหญ่ → แจ้ง user ว่าแนะนำย้ายไป CDN ระยะยาว

### Step 5: อัปเดต spec.md

- อัปเดต session ล่าสุดใน Completed Work
- อัปเดต Current State (จำนวนคลิปพร้อมดู)
- อัปเดต Changed Files (เพิ่มไฟล์ใหม่ + ขนาด)
- อัปเดตขนาด repo ใน Known Issues

### Step 6: แจ้ง user

แจ้งสรุป:
- EP ที่เพิ่ม + ชื่อ + ความยาว + จำนวน timestamps
- PDF ประกอบ (ถ้ามี)
- ลิงก์ดูเว็บ: https://thawatchai070240-stack.github.io/IA_AI-Learning/
- ลิงก์ดูคลิปตรง: https://thawatchai070240-stack.github.io/IA_AI-Learning/watch.html?v={videoId}
- เตือนว่ารอ GitHub Pages deploy 1-2 นาที
- แจ้ง warning ขนาดไฟล์ (ถ้ามี)

## ข้อมูลสำคัญของ Project

- **Project path:** `C:\ProjectX\X.22`
- **GitHub:** https://github.com/thawatchai070240-stack/IA_AI-Learning
- **Live URL:** https://thawatchai070240-stack.github.io/IA_AI-Learning/
- **EP IDs:** v01=EP1, v02=EP2, ..., v10=EP10
- **Assets folder:** `C:\ProjectX\X.22\assets\`
- **Firebase:** AIIA project (aiia-f152d) — real-time visitor counting + likes + views + totalSiteVisits
- **GitHub file limit:** 100 MB/file (hard), 1 GB/repo (soft recommended)
- **สื่อสารเป็นภาษาไทย**

## Features ที่รองรับในแต่ละ EP

| Feature | Field ใน VIDEOS | หน้า watch |
|---------|----------------|------------|
| วิดีโอ | `src` | auto-play video player |
| Thumbnail | `thumbImg` | การ์ดหน้า index |
| Timestamps | `timestamps[]` | กดข้ามไปเวลาในคลิป |
| PDF ดาวน์โหลด | `downloadPdf` | ปุ่มสีเขียวเหนือ timestamps |
| เนื้อหาเพิ่ม | `desc` (HTML) | กล่อง prompt-box ใน desc |
| ถูกใจ | อัตโนมัติ (Firebase) | หัวใจสีแดงบนการ์ด |
| ยอดวิว | อัตโนมัติ (Firebase) | แสดงบนการ์ด + หน้า watch |

## ตัวอย่างการใช้งาน

### แบบเต็ม:
```
/add-episode EP5 "Data Analytics for Audit"
ไฟล์ชื่อ DataAnalytics.mp4
thumbnail ชื่อ Thumnail EP5.png
คำอธิบาย: สอนใช้ Power BI วิเคราะห์ข้อมูล Audit
timestamps: 0:00 เริ่มต้น, 5:30 Power BI, 12:00 สรุป
PDF ประกอบ: PowerBI_Guide.pdf
```

### แบบย่อ (จะถามข้อมูลที่ขาด):
```
/add-episode EP5
```

ผลลัพธ์: อัปเดต VIDEOS array, copy ไฟล์, push GitHub, อัปเดต spec.md
