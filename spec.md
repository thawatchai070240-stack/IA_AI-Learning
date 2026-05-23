# AI Audit Hub — Project Spec

> **Session Updated:** 2026-05-23
> **Status:** 2 หน้า (index + watch) — 3 คลิปพร้อมดู (EP1-EP3), 7 คลิป Coming Soon

## 1. Current State
Frontend (HTML/CSS/JS, ไม่มี backend) สำหรับเว็บดูคลิป VDO Use Case การใช้ AI ในงาน Internal Auditor ดีไซน์สไตล์ Netflix
- เปิด local server: `python -m http.server 8080` จาก `C:\ProjectX\X.22`
- เข้า http://localhost:8080/index.html
- **ไม่มีหน้า Login** — เข้าดูได้เลย
- **กดการ์ด → ไปหน้า watch.html** เล่นวิดีโอ (แบบเดิม)
- **แสดงจำนวนผู้เข้าชมเว็บ** แบบ live บน navbar

## 2. Completed Work

### Session 3 (2026-05-23)
- **ลบหน้า Login** — เข้าเว็บได้เลย ไม่ต้อง authenticate
- **ลบ categories** — แบ่งเป็น 2 row: "พร้อมดู" + "Coming Soon"
- **เปลี่ยนชื่อเป็น EP** — EP1-EP10 เรียงลำดับ
- **เพิ่มวิดีโอจริง 3 คลิป** ใน `assets/`:
  - EP1 IA Agent (31 MB)
  - EP2 Interactive HTML & Tools (38 MB)
  - EP3 NotebookLM for Internal Audit (45 MB)
- **กดการ์ด → ไปหน้า watch.html** เล่นวิดีโอ (layout เดิม)
- **Visitor Counter** — badge สีเขียวบน navbar แสดงจำนวนผู้เข้าชม
- **Hero section** — `Hero background.mp4` เป็นวิดีโอพื้นหลัง (autoplay + loop + auto-unmute on first click)
- **Thumbnail images** — EP1-EP3 ใช้ภาพ `Thumnail Ep1/2/3.png` แทน gradient สี

### Session 2 (2026-05-17)
- Fix login navigation bug
- Coming Soon styling ทั่วทั้งเว็บ
- YouTube background video ใน Hero

### Session 1 (2026-05-16)
- ออกแบบ 3 หน้าหลัก (login/index/watch) + Netflix theme
- 10 VIDEOS catalog + Mock Login + Comments/Rating

## 3. Pending Work
- [x] ~~อัปโหลด MP4 จริงเข้า assets/~~ ✅ (Session 3)
- [x] ~~เอา Coming Soon ribbon ออกจากการ์ดที่มี VDO จริง~~ ✅ (Session 3)
- [x] ~~Redesign เป็นหน้าเดียว~~ ✅ (Session 3)
- [ ] (ตัวเลือก) Deploy ขึ้น GitHub Pages / Netlify / Vercel
- [ ] (ตัวเลือก) ทำ Backend ให้ visitor count เป็นของจริง (WebSocket / Firebase)
- [ ] เพิ่ม feature: Hover preview, progress bar, fullscreen mode

## 4. Architecture Decisions
- **2 หน้า** — index.html (หน้าเลือกคลิป) + watch.html (หน้าดูคลิป)
- **No Login** — เปิดเว็บเข้าดูได้เลย ไม่ต้อง authenticate
- **Frontend-only** — ใช้ localStorage สำหรับ visitor count simulation + comments
- **EP numbering** — เรียงลำดับ EP1-EP10

## 5. Known Issues / Limitations
- Visitor count เป็น simulation ไม่ใช่ผู้เข้าชมจริง (ต้องมี backend ถึงจะ real-time)
- MP4 files รวม 114 MB — ไม่เหมาะสำหรับ Git / GitHub Pages (แนะนำ CDN หรือ cloud storage)
- Mobile: modal อาจต้องปรับขนาดเพิ่มเติม
- login.html / watch.html ยังอยู่ในโฟลเดอร์ (ไม่ได้ใช้แล้ว)

## 6. Next Recommended Steps
1. เปิด local server: `cd C:\ProjectX\X.22 && python -m http.server 8080`
2. เข้า http://localhost:8080
3. ตัดสินใจ scope ถัดไป:
   - **Track A**: เพิ่มคลิปจริงอีก (EP4+)
   - **Track B**: Deploy online
   - **Track C**: ทำ real visitor count (Firebase/WebSocket)

## 7. Changed Files / Modules
```
C:\ProjectX\X.22\
├── index.html        ← Single page app (Session 3: complete rewrite)
├── styles.css        ← Theme (Session 3: complete rewrite for single page + modal)
├── app.js            ← Logic (Session 3: simplified — no auth, EP catalog, visitor count)
├── spec.md           ← เอกสารนี้
├── login.html        ← (ไม่ใช้แล้ว — legacy)
├── watch.html        ← (ไม่ใช้แล้ว — legacy)
└── assets\
    ├── IA Agent.mp4                         ← 31 MB (EP1)
    ├── Interactive HTML&Tools.mp4           ← 38 MB (EP2)
    ├── NotebookLM for Internal Audit.mp4    ← 45 MB (EP3)
    └── Hero background.mp4                 ← 8.9 MB (Hero พื้นหลัง)
```

## 8. Risks / Limitations
- **Large files**: MP4 รวม 114 MB ไม่ควร push ขึ้น Git
- **No real analytics**: Visitor count เป็น simulation
- **No CDN**: วิดีโอ serve จาก local — ช้าถ้า deploy แบบ static
- **Browser autoplay**: วิดีโอใน modal ใช้ autoplay ซึ่งบาง browser อาจบล็อก (ต้อง user interact ก่อน)
