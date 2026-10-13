// =========================================================
// ABSEN — via API
// =========================================================
function renderFormAbsen() {
  const el = document.getElementById('formAbsen');
  if (!el) return;
  const tglEl = document.getElementById('inAbsenTanggal');
  if (tglEl && !tglEl.value) tglEl.value = new Date().toISOString().split('T')[0];
  const list = santriTerlihat();
  if (list.length === 0) { el.innerHTML = '<div class="nodata">Belum ada santri</div>'; return; }

  /* Simpan pilihan status sebelumnya */
  const prevStatus = {};
  list.forEach(s => {
    const sel = document.getElementById('ab-' + s.id);
    if (sel) prevStatus[s.id] = sel.value;
  });

  el.innerHTML = list.map(s => {
    const cur = prevStatus[s.id] || 'Hadir';
    return `
    <div class="item" style="align-items:center">
      <div class="item-main">
        <div class="item-name">${s.nama}</div>
        <div class="item-meta">${s.halaqah}</div>
      </div>
      <select id="ab-${s.id}" style="padding:6px 8px;border:1px solid var(--border-input);border-radius:6px;font-size:12.5px;background:var(--bg-input);color:var(--text)">
        <option value="Hadir" ${cur === 'Hadir' ? 'selected' : ''}>Hadir</option>
        <option value="Sakit" ${cur === 'Sakit' ? 'selected' : ''}>Sakit</option>
        <option value="Izin" ${cur === 'Izin' ? 'selected' : ''}>Izin</option>
        <option value="Alpa" ${cur === 'Alpa' ? 'selected' : ''}>Alpa</option>
      </select>
    </div>`;
  }).join('');
}

async function simpanAbsen() {
  const tgl = document.getElementById('inAbsenTanggal').value;
  if (!tgl) return toast('Pilih tanggal');
  const list = santriTerlihat();
  if (list.length === 0) return toast('Belum ada santri');

  const items = list.map(s => ({
    santriId: s.id,
    tanggal: tgl,
    status: document.getElementById('ab-' + s.id).value,
  }));

  const btn = document.querySelector('#panel-absen .btn-main');
  const origText = btn ? btn.textContent : 'Simpan Absensi';
  if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan...'; }

  try {
    await api.saveAbsen(items);
    await loadAllData();
    renderRiwayatAbsen();
    renderStat();
    toast('Absensi tersimpan');
  } catch (e) {
    console.error('Error simpan absen:', e);
    toast('Gagal menyimpan: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

function renderRiwayatAbsen() {
  const el = document.getElementById('riwayatAbsen');
  if (!el) return;
  const visibleIds = santriTerlihat().map(s => s.id);
  let data = DB.absen.filter(a => visibleIds.includes(a.santriId));
  if (data.length === 0) { el.innerHTML = '<div class="nodata"><div class="t">Belum ada absensi</div></div>'; return; }
  const byDate = {};
  data.forEach(a => (byDate[a.tanggal] = byDate[a.tanggal] || []).push(a));
  const dates = Object.keys(byDate).sort().reverse().slice(0, 10);
  el.innerHTML = dates.map(d => {
    const items = byDate[d];
    const hadir = items.filter(i => i.status === 'Hadir').length;
    const tgl = new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return `
      <div style="margin-bottom:14px">
        <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:8px;font-weight:500">${tgl} · ${hadir}/${items.length} hadir</div>
        ${items.map(a => {
          const s = DB.santri.find(x => x.id === a.santriId);
          return `<div class="item" style="padding:8px 10px">
            <div class="item-name" style="font-size:12.5px">${s ? s.nama : '—'}</div>
            <span class="tag ${badgeAbsen[a.status]}">${a.status}</span>
          </div>`;
        }).join('')}
      </div>`;
  }).join('');
}