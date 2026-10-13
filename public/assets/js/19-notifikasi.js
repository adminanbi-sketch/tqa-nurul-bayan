// =========================================================
// PENGUMUMAN & NOTIF
// =========================================================
function simpanPengumuman() {
  const txt = document.getElementById('inPengumuman').value.trim();
  DB.pengumuman = txt;
  localStorage.setItem('th_pengumuman', txt);
  renderAnnounce();
  toast(txt ? 'Pengumuman disimpan' : 'Pengumuman dihapus');
}

function renderAnnounce() {
  const el = document.getElementById('announceBar');
  if (!DB.pengumuman) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="announce"><strong>📢 Pengumuman:</strong> ${DB.pengumuman}</div>`;
}

function toggleNotif() {
  const p = document.getElementById('notifPanel');
  p.classList.toggle('on');
  if (p.classList.contains('on')) renderNotif();
}

function renderNotif() {
  const el = document.getElementById('notifList');
  const notifs = [];
  const today = new Date().toISOString().split('T')[0];
  const list = santriTerlihat();

  const belumSetoran = list.filter(s => !DB.setoran.some(x => x.santriId === s.id && x.tanggal.startsWith(today)));
  if (belumSetoran.length > 0) notifs.push({ ic: '📝', txt: `${belumSetoran.length} santri belum setoran hari ini`, cls: 'warn' });
  if (DB.absen.filter(a => a.tanggal === today).length === 0 && list.length > 0) notifs.push({ ic: '✓', txt: 'Absensi hari ini belum diisi', cls: 'warn' });
  list.forEach(s => {
    const st = statistik(s.id);
    const kurang = st.setoran.filter(x => x.nilai === 'Kurang Lancar').length;
    if (kurang >= 3) notifs.push({ ic: '⚠️', txt: `${s.nama}: ${kurang}x kurang lancar`, cls: 'warn' });
  });
  const topStreak = list.map(s => ({ s, streak: statistik(s.id).streak })).sort((a, b) => b.streak - a.streak)[0];
  if (topStreak && topStreak.streak >= 3) notifs.push({ ic: '🔥', txt: `${topStreak.s.nama} streak ${topStreak.streak} hari!`, cls: '' });

  if (notifs.length === 0) {
    el.innerHTML = '<div class="notif-item">Tidak ada notifikasi</div>';
    document.getElementById('notifBadge').style.display = 'none';
  } else {
    el.innerHTML = notifs.map(n => `<div class="notif-item ${n.cls}"><span class="ic">${n.ic}</span>${n.txt}</div>`).join('');
    const badge = document.getElementById('notifBadge');
    badge.textContent = notifs.length;
    badge.style.display = 'block';
  }
}

document.addEventListener('click', e => {
  const p = document.getElementById('notifPanel');
  const b = document.getElementById('notifBtn');
  if (p && b && !p.contains(e.target) && !b.contains(e.target)) p.classList.remove('on');
});
