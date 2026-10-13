// =========================================================
// MUTABAAH — via API
// =========================================================
function renderFormMutabaah() {
  const tglEl = document.getElementById('inMutabaahTanggal');
  if (tglEl && !tglEl.value) tglEl.value = new Date().toISOString().split('T')[0];
  const el = document.getElementById('formMutabaah');
  if (!el) return;
  const list = santriTerlihat();
  if (list.length === 0) { el.innerHTML = '<div class="nodata">Belum ada santri</div>'; return; }
  el.innerHTML = DB.amalan.map(a => `
    <label style="display:flex;align-items:center;gap:10px;padding:9px 12px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px;cursor:pointer">
      <input type="checkbox" id="mt-${a.id}" style="width:16px;height:16px;accent-color:var(--primary)">
      <span style="font-size:13px;color:var(--text)">${a.t}</span>
    </label>
  `).join('');
}

async function simpanMutabaah() {
  const santriId = parseInt(document.getElementById('inMutabaahSantri').value);
  const tanggal = document.getElementById('inMutabaahTanggal').value;
  if (!santriId) return toast('Pilih santri');
  if (!tanggal) return toast('Pilih tanggal');

  const items = {};
  DB.amalan.forEach(a => {
    const el = document.getElementById('mt-' + a.id);
    if (el) items[a.id] = el.checked;
  });

  const btn = document.querySelector('#panel-mutabaah .btn-main');
  const origText = btn ? btn.textContent : 'Simpan Mutaba\'ah';
  if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan...'; }

  try {
    await api.saveMutabaah({ santriId, tanggal, items });
    await loadAllData();
    renderRiwayatMutabaah();
    renderStat();
    toast('Mutaba\'ah tersimpan');
  } catch (e) {
    console.error('Error simpan mutabaah:', e);
    toast('Gagal menyimpan: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

function renderRiwayatMutabaah() {
  const el = document.getElementById('riwayatMutabaah');
  if (!el) return;
  const visibleIds = santriTerlihat().map(s => s.id);
  let data = DB.mutabaah.filter(m => visibleIds.includes(m.santriId));
  if (data.length === 0) { el.innerHTML = '<div class="nodata"><div class="t">Belum ada data mutaba\'ah</div></div>'; return; }
  el.innerHTML = data.slice(0, 12).map(m => {
    const s = DB.santri.find(x => x.id === m.santriId);
    const total = Object.values(m.items).filter(Boolean).length;
    const p = Math.round((total / DB.amalan.length) * 100);
    const c = p >= 80 ? 'var(--tag-green-fg)' : p >= 50 ? 'var(--tag-yellow-fg)' : 'var(--tag-red-fg)';
    const tgl = new Date(m.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    return `
      <div class="item">
        <div class="item-main">
          <div class="item-name">${s ? s.nama : '—'}</div>
          <div class="item-meta">${tgl} · ${total}/${DB.amalan.length} amalan</div>
        </div>
        <div style="font-weight:600;color:${c};font-size:14px">${p}%</div>
      </div>`;
  }).join('');
}