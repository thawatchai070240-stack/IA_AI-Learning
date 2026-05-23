/* ============================================
   AI Audit Hub — Shared App Logic
   ============================================ */

/* ---------- Video catalog ---------- */
const VIDEOS = [
  { id: 'v01', title: 'EP1 IA Agent', category: 'AI for Audit', duration: '17:11 นาที', tag: 'ใหม่', thumb: 't1', initials: 'EP1',
    src: 'assets/IA Agent.mp4',
    thumbImg: 'assets/Thumnail Ep1.png',
    desc: 'สอนใช้ GINII สร้าง Agent และใช้ Combo Agent เพื่องานตรวจสอบภายใน' },
  { id: 'v02', title: 'EP2 Interactive HTML & Tools', category: 'AI for Audit', duration: '16:54 นาที', tag: 'ใหม่', thumb: 't2', initials: 'EP2',
    src: 'assets/Interactive HTML&Tools.mp4',
    thumbImg: 'assets/Thumnail Ep2.png',
    desc: 'สาธิตการสร้างเครื่องมือ Interactive HTML สำหรับงาน Audit — Dashboard, Checklist, และ Tools ที่ใช้งานได้จริง' },
  { id: 'v03', title: 'EP3 NotebookLM for Internal Audit', category: 'AI for Audit', duration: '12:35 นาที', tag: 'ใหม่', thumb: 't3', initials: 'EP3',
    src: 'assets/NotebookLM for Internal Audit.mp4',
    thumbImg: 'assets/Thumnail Ep3.png',
    desc: 'แนะนำการใช้ Google NotebookLM เพื่องาน Internal Audit — สรุปเอกสาร, วิเคราะห์หลักฐาน, สร้าง Audio Overview จากงานตรวจสอบ' },
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

/* ---------- Visitor counter (simulated) ---------- */
function getVisitorCount() {
  let data = JSON.parse(localStorage.getItem('aiAuditHub.visitors') || 'null');
  if (!data || Date.now() - data.ts > 3600000) {
    data = { base: Math.floor(Math.random() * 15) + 8, ts: Date.now() };
    localStorage.setItem('aiAuditHub.visitors', JSON.stringify(data));
  }
  return data.base;
}
function tickVisitorCount() {
  const data = JSON.parse(localStorage.getItem('aiAuditHub.visitors') || '{"base":12,"ts":0}');
  const delta = Math.floor(Math.random() * 3) - 1;
  data.base = Math.max(3, data.base + delta);
  data.ts = Date.now();
  localStorage.setItem('aiAuditHub.visitors', JSON.stringify(data));
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

/* ---------- Viewer counter per video (simulated) ---------- */
function getViewerCount(videoId) {
  const views = JSON.parse(localStorage.getItem('aiAuditHub.views') || '{}');
  if (!views[videoId]) {
    views[videoId] = Math.floor(Math.random() * 80) + 25;
    localStorage.setItem('aiAuditHub.views', JSON.stringify(views));
  }
  return views[videoId];
}
function tickViewerCount(videoId) {
  const views = JSON.parse(localStorage.getItem('aiAuditHub.views') || '{}');
  const cur = views[videoId] || getViewerCount(videoId);
  const delta = Math.floor(Math.random() * 7) - 3;
  views[videoId] = Math.max(8, cur + delta);
  localStorage.setItem('aiAuditHub.views', JSON.stringify(views));
  return views[videoId];
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
        <span id="visitorCount">${getVisitorCount()}</span> คนกำลังดูเว็บ
      </div>
    </div>
  `;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
  // Update visitor count
  setInterval(() => {
    const el = document.getElementById('visitorCount');
    if (el) el.textContent = tickVisitorCount();
  }, 8000);
}
