# Add New Episode to AI Audit Hub

## Skill: /add-episode

เมื่อ user เรียกใช้ skill นี้ ให้ทำตามขั้นตอนด้านล่างเพื่อเพิ่ม EP ใหม่เข้าเว็บ AI Audit Hub

## ข้อมูลที่ต้องถาม user (ถ้ายังไม่ได้ให้มา)

1. **หมายเลข EP** — EP ไหน (EP4, EP5, ...)
2. **ชื่อเรื่อง** — เช่น "EP4 Advanced Prompt Engineering"
3. **คำอธิบาย** — 1 บรรทัดอธิบายเนื้อหาคลิป
4. **ไฟล์วิดีโอ** — ชื่อไฟล์ MP4 (จะถูกวางใน `assets/`)
5. **ไฟล์ Thumbnail** — ชื่อไฟล์ PNG (จะถูกวางใน `assets/`)
6. **Timestamps** — รายการ timestamp พร้อม label (เช่น "1:10 สร้าง Agent, 8:20 Combo Agent")
7. **ความยาวคลิป** — เช่น "15:30 นาที" (ถ้าไม่รู้จะอ่านจาก MP4 header)

## ขั้นตอนการทำงาน

### Step 1: ตรวจสอบไฟล์
- ตรวจสอบว่าไฟล์ MP4 และ PNG อยู่ใน `assets/` แล้ว
- ถ้ายังไม่มี ให้ถาม user ว่าไฟล์อยู่ที่ไหน แล้ว copy มาใน `assets/`
- ถ้า user ไม่ได้ให้ความยาวคลิป ให้อ่านจาก MP4 header ด้วย Python:
  ```
  python -c "
  import struct
  def get_duration(path):
      with open(path,'rb') as f:
          while True:
              header=f.read(8)
              if len(header)<8: break
              size=struct.unpack('>I',header[:4])[0]
              box_type=header[4:8]
              if box_type==b'moov':
                  continue
              if box_type==b'mvhd':
                  f.read(4)
                  f.read(4)
                  ts=struct.unpack('>I',f.read(4))[0]
                  dur=struct.unpack('>I',f.read(4))[0]
                  secs=dur/ts
                  m=int(secs//60)
                  s=int(secs%60)
                  print(f'{m}:{s:02d}')
                  return
              f.seek(max(size-8,0),1)
  get_duration(r'FILEPATH')
  "
  ```

### Step 2: แก้ไข app.js — อัปเดต VIDEOS array
- อ่าน `app.js`
- หา entry ของ EP ที่ต้องการอัปเดต (เช่น v04 สำหรับ EP4)
- เปลี่ยนจาก Coming Soon เป็นข้อมูลจริง:
  - เพิ่ม `title` ที่มีชื่อเรื่อง
  - เพิ่ม `src` ชี้ไปที่ไฟล์ MP4
  - เพิ่ม `thumbImg` ชี้ไปที่ไฟล์ PNG
  - เพิ่ม `duration` ความยาวคลิป
  - เปลี่ยน `tag` เป็น 'ใหม่'
  - เพิ่ม `desc` คำอธิบาย
  - เพิ่ม `timestamps` array พร้อม time, seconds, label
  - ลบ `category: 'Coming Soon'` เปลี่ยนเป็น `category: 'AI for Audit'`

### Step 3: Push ขึ้น GitHub
```bash
git add app.js assets/
git commit -m "Add EP{N} {title} — new video episode"
git push origin main
```

### Step 4: อัปเดต spec.md
- อัปเดต session ล่าสุดใน Completed Work
- อัปเดต Current State (จำนวนคลิปพร้อมดู)
- อัปเดต Changed Files

### Step 5: แจ้ง user
แจ้งสรุป:
- EP ที่เพิ่ม + ชื่อ + ความยาว + จำนวน timestamps
- ลิงก์ดูเว็บ: https://thawatchai070240-stack.github.io/IA_AI-Learning/
- ลิงก์ดูคลิปตรง: https://thawatchai070240-stack.github.io/IA_AI-Learning/watch.html?v={videoId}
- เตือนว่ารอ GitHub Pages deploy 1-2 นาที

## ข้อมูลสำคัญของ Project

- **Project path:** `C:\ProjectX\X.22`
- **GitHub:** https://github.com/thawatchai070240-stack/IA_AI-Learning
- **Live URL:** https://thawatchai070240-stack.github.io/IA_AI-Learning/
- **EP IDs:** v01=EP1, v02=EP2, ..., v10=EP10
- **Assets folder:** `C:\ProjectX\X.22\assets\`
- **Firebase:** AIIA project (aiia-f152d) — real-time visitor counting
- **สื่อสารเป็นภาษาไทย**

## ตัวอย่างการใช้งาน

User: `/add-episode EP4 "Data Analytics for Audit" ไฟล์ชื่อ DataAnalytics.mp4 thumbnail ชื่อ Thumnail Ep4.png timestamps: 0:00 เริ่มต้น, 5:30 Power BI, 12:00 สรุป`

ผลลัพธ์: อัปเดต v04 ใน VIDEOS array, push ขึ้น GitHub, อัปเดต spec.md
