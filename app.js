/* ============================================
   AI Audit Hub — Shared App Logic
   ============================================ */

/* ---------- Video catalog ---------- */
const VIDEOS = [
  { id: 'v01', title: 'EP1 IA Agent', category: 'AI for Audit', duration: '17:11 นาที', tag: 'ใหม่', thumb: 't1', initials: 'EP1',
    /* src: 'assets/IA Agent.mp4', — ถอดออกชั่วคราว รอแก้ไขเนื้อหา */
    thumbImg: 'assets/Thumnail Ep1.png',
    desc: 'สอนใช้ GINII สร้าง Agent และใช้ Combo Agent เพื่องานตรวจสอบภายใน',
    timestamps: [
      { time: '1:10', seconds: 70, label: 'สร้าง Agent' },
      { time: '8:20', seconds: 500, label: 'Combo Agent' },
      { time: '14:35', seconds: 875, label: 'เทคนิคสร้าง System Prompt' },
    ] },
  { id: 'v02', title: 'EP2 Interactive HTML & Tools', category: 'AI for Audit', duration: '16:54 นาที', tag: 'ใหม่', thumb: 't2', initials: 'EP2',
    /* src: 'assets/Interactive HTML&Tools.mp4', — ถอดออกชั่วคราว รอแก้ไขเนื้อหา */
    thumbImg: 'assets/Thumnail Ep2.png',
    desc: 'สาธิตการสร้างเครื่องมือ Interactive HTML สำหรับงาน Audit — Dashboard, Checklist, และ Tools ที่ใช้งานได้จริง',
    timestamps: [
      { time: '1:00', seconds: 60, label: 'Interactive HTML' },
      { time: '6:30', seconds: 390, label: 'แก้ข้อความใน HTML' },
      { time: '13:23', seconds: 803, label: 'Audit Tool' },
    ] },
  { id: 'v03', title: 'EP3 NotebookLM for Internal Audit', category: 'AI for Audit', duration: '12:35 นาที', tag: 'ใหม่', thumb: 't3', initials: 'EP3',
    src: 'assets/NotebookLM for Internal Audit.mp4',
    thumbImg: 'assets/Thumnail Ep3.png',
    desc: 'แนะนำการใช้ Google NotebookLM เพื่องาน Internal Audit — สรุปเอกสาร, วิเคราะห์หลักฐาน, สร้าง Audio Overview จากงานตรวจสอบ',
    timestamps: [
      { time: '0:00', seconds: 0, label: 'NotebookLM for Internal Audit' },
      { time: '9:23', seconds: 563, label: 'เทคนิคการดึงข้อมูลโดย Grabbit Extension' },
    ] },
  { id: 'v04', title: 'EP4', category: 'Coming Soon', duration: '', tag: 'เร็วๆ นี้', thumb: 't4', initials: 'EP4',
    desc: 'Coming Soon' },
  { id: 'v05', title: 'EP5', category: 'Coming Soon', duration: '', tag: 'เร็วๆ นี้', thumb: 't5', initials: 'EP5',
    desc: 'Coming Soon' },
  { id: 'v06', title: 'EP6', category: 'Coming Soon', duration: '', tag: 'เร็วๆ นี้', thumb: 't6', initials: 'EP6',
    desc: 'Coming Soon' },
  { id: 'v07', title: 'EP7', category: 'Coming Soon', duration: '', tag: 'เร็วๆ นี้', thumb: 't7', initials: 'EP7',
    desc: 'Coming Soon' },
  { id: 'v08', title: 'EP8', category: 'Coming Soon', duration: '', tag: 'เร็วๆ นี้', thumb: 't8', initials: 'EP8',
    desc: 'Coming Soon' },
  { id: 'v09', title: 'EP9', category: 'Coming Soon', duration: '', tag: 'เร็วๆ นี้', thumb: 't9', initials: 'EP9',
    desc: 'Coming Soon' },
  { id: 'v10', title: 'EP10', category: 'Coming Soon', duration: '', tag: 'เร็วๆ นี้', thumb: 't10', initials: 'EP10',
    desc: 'Coming Soon' },
];

/* ---------- Firebase Visitor Counter (Real-time) ---------- */
/*
  ใส่ Firebase config ที่นี่ — เอาจาก Firebase Console > Project Settings > Your apps > Config
*/
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCzQ3Rk0m1p2zsFG4x96N9hRhM_A7tXz-k",
  authDomain: "aiia-f152d.firebaseapp.com",
  databaseURL: "https://aiia-f152d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aiia-f152d",
  storageBucket: "aiia-f152d.firebasestorage.app",
  messagingSenderId: "962547263732",
  appId: "1:962547263732:web:e2617968c06c25044f56a1"
};

let firebaseReady = false;

function initFirebasePresence() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded — using fallback');
    return;
  }
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    const db = firebase.database();
    const presenceRef = db.ref('presence');
    const myRef = presenceRef.push();

    // เมื่อเชื่อมต่อ: เขียน true, เมื่อ disconnect: ลบอัตโนมัติ
    db.ref('.info/connected').on('value', (snap) => {
      if (snap.val() === true) {
        myRef.set(true);
        myRef.onDisconnect().remove();
      }
    });

    // ฟัง realtime count (navbar)
    presenceRef.on('value', (snap) => {
      const count = snap.numChildren();
      const el = document.getElementById('visitorCount');
      if (el) el.textContent = count;
    });

    firebaseReady = true;
    window._firebaseDB = db;
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }
}

// Fallback ถ้า Firebase ยังไม่ได้ config
function getVisitorFallback() {
  let data = JSON.parse(localStorage.getItem('aiAuditHub.visitors') || 'null');
  if (!data || Date.now() - data.ts > 3600000) {
    data = { base: Math.floor(Math.random() * 15) + 8, ts: Date.now() };
    localStorage.setItem('aiAuditHub.visitors', JSON.stringify(data));
  }
  return data.base;
}

/* ---------- Comments ---------- */
function getComments(videoId) {
  try {
    const all = JSON.parse(localStorage.getItem('aiAuditHub.comments') || '{}');
    return all[videoId] || [];
  } catch { return []; }
}
function addComment(videoId, comment) {
  const all = JSON.parse(localStorage.getItem('aiAuditHub.comments') || '{}');
  if (!all[videoId]) all[videoId] = [];
  all[videoId].unshift(comment);
  localStorage.setItem('aiAuditHub.comments', JSON.stringify(all));
}

/* ---------- Viewer counter per video (Firebase real-time) ---------- */
function initVideoPresence(videoId) {
  if (!firebaseReady || !window._firebaseDB) return null;
  const db = window._firebaseDB;
  const videoPresRef = db.ref('videoPresence/' + videoId);
  const myVideoRef = videoPresRef.push();

  db.ref('.info/connected').on('value', (snap) => {
    if (snap.val() === true) {
      myVideoRef.set(true);
      myVideoRef.onDisconnect().remove();
    }
  });

  // ฟัง realtime count สำหรับวิดีโอนี้
  videoPresRef.on('value', (snap) => {
    const count = snap.numChildren();
    const el = document.getElementById('videoViewerCount');
    if (el) el.textContent = count;
  });

  return videoPresRef;
}

// Fallback สำหรับ per-video count
function getViewerCount(videoId) {
  return Math.floor(Math.random() * 5) + 1;
}
function tickViewerCount(videoId) {
  return getViewerCount(videoId);
}

/* ---------- Utility ---------- */
function timeAgo(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'เมื่อสักครู่';
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(diff / 86400)} วันที่แล้ว`;
}

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ---------- Navbar render ---------- */
function renderNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-left">
      <a href="index.html" class="brand">AI<span class="sub">AUDIT</span></a>
    </div>
    <div class="nav-right">
      <div class="visitor-badge">
        <span class="live-dot"></span>
        <span id="visitorCount">${getVisitorFallback()}</span> คนกำลังดูเว็บ
      </div>
    </div>
  `;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Init Firebase — ถ้า config ยังเป็น placeholder จะ fallback อัตโนมัติ
  if (FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY') {
    initFirebasePresence();
  } else {
    // Fallback: simulation
    setInterval(() => {
      const el = document.getElementById('visitorCount');
      if (el) {
        const data = JSON.parse(localStorage.getItem('aiAuditHub.visitors') || '{"base":12,"ts":0}');
        const delta = Math.floor(Math.random() * 3) - 1;
        data.base = Math.max(3, data.base + delta);
        data.ts = Date.now();
        localStorage.setItem('aiAuditHub.visitors', JSON.stringify(data));
        el.textContent = data.base;
      }
    }, 8000);
  }
}
