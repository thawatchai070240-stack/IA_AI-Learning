# AI Audit Hub — Project Spec

> **Session Updated:** 2026-05-23 (Session 4)
> **Status:** 2 หน้า (index + watch) — 3 คลิปพร้อมดู (EP1-EP3), 7 คลิป Coming Soon
> **Live URL:** https://thawatchai070240-stack.github.io/IA_AI-Learning/
> **GitHub:** https://github.com/thawatchai070240-stack/IA_AI-Learning

## 1. Current State
Frontend (HTML/CSS/JS) สำหรับเว็บดูคลิป VDO Use Case การใช้ AI ในงาน Internal Auditor ดีไซน์สไตล์ Netflix
- **Deploy อยู่บน GitHub Pages** — เข้าดูได้ทันทีผ่าน URL ด้านบน
- **ไม่มีหน้า Login** — เข้าดูได้เลย
- **กดการ์ด → ไปหน้า watch.html** เล่นวิดีโอ
- **Firebase Realtime Database** — นับจำนวนผู้เข้าชมเว็บ + ผู้ดูต่อคลิป แบบ real-time
- **Hero background video** — autoplay + loop + mute toggle + auto-unmute on first interaction

## 2. Completed Work

### Session 4 (2026-05-23)
- **Firebase Realtime Database** — เชื่อมต่อ Firebase project "AIIA" (asia-southeast1)
  - Navbar visitor count → Firebase presence (real-time จำนวนคนเปิดเว็บ)
  - Per-video viewer count → Firebase videoPresence (real-time จำนวนคนดูคลิปนั้น)
  - Fallback: ถ้า Firebase ไม่พร้อมจะใช้ localStorage simulation
- **Firebase SDK** — เพิ่ม firebase-app-compat + firebase-database-compat ใน index.html & watch.html
- **Deploy ขึ้น GitHub Pages** — push โค้ดทั้งหมดขึ้น GitHub

### Session 3 (2026-05-23)
- **ลบหน้า Login** — เข้าเว็บได้เลย ไม่ต้อง authenticate
- **ลบ categories** — แบ่งเป็น 2 row: "พร้อมดู" + "Coming Soon"
- **เปลี่ยนชื่อเป็น EP** — EP1-EP10 เรียงลำดับ
- **เพิ่มวิดีโอจริง 3 คลิป** ใน `assets/`
- **Visitor Counter** — badge สีเขียวบน navbar
- **Hero section** — `Hero background.mp4` วิดีโอพื้นหลัง (autoplay + loop + auto-unmute)
- **Mute toggle** — ปุ่มปิด/เปิดเสียง Hero video
- **Thumbnail images** — EP1-EP3 ใช้ภาพจริงแทน gradient
- **Maroon border** — การ์ดมีกรอบสีเลือดหมู (#8B0000)
- **EP descriptions** — EP1 สอนใช้ GINII สร้าง Agent

### Session 2 (2026-05-17)
- Fix login navigation bug
- Coming Soon styling ทั่วทั้งเว็บ

### Session 1 (2026-05-16)
- ออกแบบ 3 หน้าหลัก + Netflix theme
- 10 VIDEOS catalog + Mock Login + Comments/Rating

## 3. Pending Work
- [x] ~~อัปโหลด MP4 จริงเข้า assets/~~ ✅ (Session 3)
- [x] ~~Redesign ลบ Login~~ ✅ (Session 3)
- [x] ~~Deploy ขึ้น GitHub Pages~~ ✅ (Session 4)
- [x] ~~ทำ real visitor count (Firebase)~~ ✅ (Session 4)
- [ ] เพิ่มคลิปจริงอีก (EP4+)
- [ ] เพิ่ม feature: Hover preview, progress bar
- [ ] แก้ Firebase Rules ให้ปลอดภัยกว่า test mode (ก่อน 2026-6-22)

## 4. Architecture Decisions
- **2 หน้า** — index.html (หน้าเลือกคลิป) + watch.html (หน้าดูคลิป)
- **No Login** — เปิดเว็บเข้าดูได้เลย
- **Firebase Realtime Database** — presence system สำหรับนับคนดูแบบ real-time
- **EP numbering** — เรียงลำดับ EP1-EP10
- **GitHub Pages** — static hosting ฟรี

## 5. Firebase Config
- **Project:** AIIA (aiia-f152d)
- **Region:** Singapore (asia-southeast1)
- **Plan:** Spark (ฟรี)
- **Database URL:** https://aiia-f152d-default-rtdb.asia-southeast1.firebasedatabase.app
- **Rules:** Test mode (open read/write ถึง 2026-6-22) — ต้องแก้ก่อนหมดอายุ

## 6. Known Issues / Limitations
- Firebase Rules อยู่ใน test mode — หมดอายุ 2026-6-22 ต้องแก้ให้เฉพาะ presence path
- MP4 files รวม ~114 MB บน Git — ไม่เหมาะระยะยาว (แนะนำ CDN)
- Comments ยังใช้ localStorage (ไม่ sync ข้ามเครื่อง)
- login.html ยังอยู่ในโฟลเดอร์ (legacy ไม่ได้ใช้)

## 7. Changed Files / Modules
```
C:\ProjectX\X.22\
├── index.html        ← หน้าหลัก + Firebase SDK
├── watch.html        ← หน้าดูคลิป + Firebase SDK + per-video presence
├── styles.css        ← Netflix dark theme + maroon card borders
├── app.js            ← Logic: VIDEOS catalog, Firebase presence, comments
├── spec.md           ← เอกสารนี้
├── login.html        ← (legacy — ไม่ได้ใช้)
└── assets\
    ├── IA Agent.mp4                         ← 31 MB (EP1)
    ├── Interactive HTML&Tools.mp4           ← 38 MB (EP2)
    ├── NotebookLM for Internal Audit.mp4    ← 45 MB (EP3)
    ├── Hero background.mp4                 ← 8.9 MB (Hero พื้นหลัง)
    ├── Thumnail Ep1.png                    ← ~1.5 MB
    ├── Thumnail Ep2.png                    ← ~1.5 MB
    └── Thumnail Ep3.png                    ← ~1.5 MB
```

## 8. Next Recommended Steps
1. **Track A**: เพิ่มคลิปจริง EP4+ เมื่อผลิตเสร็จ
2. **Track B**: แก้ Firebase Rules ก่อนหมดอายุ (2026-6-22)
3. **Track C**: ย้าย MP4 ไป CDN (เช่น Cloudflare R2, Firebase Storage)
4. **Track D**: เพิ่ม feature เสริม (hover preview, progress bar)
