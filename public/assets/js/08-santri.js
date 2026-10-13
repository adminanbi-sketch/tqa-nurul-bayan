// =========================================================
// SANTRI — via API
// =========================================================
let fotoSantriTemp = null;

function prosesFotoSantri(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) return toast('File harus berupa gambar');
  if (file.size > 5 * 1024 * 1024) return toast('Ukuran foto maksimal 5 MB');

  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const SIZE = 200;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, SIZE, SIZE);
      fotoSantriTemp = canvas.toDataURL('image/jpeg', 0.85);
      const preview = document.getElementById('fotoPreviewSantri');
      if (preview) preview.innerHTML = `<img src="${fotoSantriTemp}" alt="Foto">`;
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function hapusFotoSantri() {
  fotoSantriTemp = null;
  const preview = document.getElementById('fotoPreviewSantri');
  if (preview) preview.innerHTML = '<span class="foto-placeholder">📷</span>';
  const inp = document.getElementById('inFotoSantri');
  if (inp) inp.value = '';
}

async function simpanSantri() {
  const nama = document.getElementById('inNamaSantri').value.trim();
  if (!nama) return toast('Nama harus diisi');
  const halaqah = document.getElementById('inHalaqahSantri').value;
  if (!halaqah) return toast('Pilih halaqah dulu');

  const btn = document.querySelector('#formSantriBox .btn-main');
  const origText = btn ? btn.textContent : 'Simpan';
  if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan...'; }

  try {
    /* ✅ Kirim ke API */
    const created = await api.addSantri({
      nama,
      halaqah,
      target: parseInt(document.getElementById('inTargetSantri').value) || 30,
      tglLahir: document.getElementById('inTglLahirSantri').value || '',
      namaWali: document.getElementById('inNamaWaliSantri').value.trim(),
      hpWali: document.getElementById('inHpWaliSantri').value.trim(),
      foto: fotoSantriTemp,
    });

    /* Reset form */
    ['inNamaSantri','inTglLahirSantri','inNamaWaliSantri','inHpWaliSantri'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    hapusFotoSantri();

    /* Reload data dari server */
    await loadAllData();
    render();

    toast('Ditambahkan · login: ' + created.username);
  } catch (e) {
    console.error('Error simpan santri:', e);
    toast('Gagal menyimpan: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

async function hapusSantri(id) {
  const ok = await konfirmasi('Hapus santri ini? Semua data setoran, absen, dan mutaba\'ah-nya juga akan terhapus.', { title: 'Hapus Santri', okText: 'Ya, Hapus' });
  if (!ok) return;

  try {
    await api.deleteSantri(id);
    await loadAllData();
    render();
    hapusFotoSantri();
    toast('Santri dihapus');
  } catch (e) {
    console.error('Error hapus santri:', e);
    toast('Gagal menghapus: ' + e.message);
  }
}

function santriTerlihat() {
  let list = [...DB.santri];
  if (user?.role === 'musyrif') {
    const myHalaqah = DB.halaqah.filter(h => h.musyrif === user.username).map(h => h.nama);
    if (myHalaqah.length === 0) return [];
    list = list.filter(s => myHalaqah.includes(s.halaqah));
  }
  if (user?.role === 'santri' || user?.role === 'wali') {
    list = list.filter(s => s.id === user.santriId);
  }
  return list;
}

function renderSantri() {
  const el = document.getElementById('listSantri');
  if (!el) return;
  const cari = (document.getElementById('cariSantri')?.value || '').toLowerCase();
  const fHal = (document.getElementById('filterHalaqahSantri')?.value || '');
  let list = santriTerlihat();
  if (cari) list = list.filter(s => s.nama.toLowerCase().includes(cari));
  if (fHal) list = list.filter(s => s.halaqah === fHal);

  const countEl = document.getElementById('santriCount');
  if (countEl) countEl.textContent = `(${list.length})`;

  if (list.length === 0) {
    el.innerHTML = '<div class="nodata"><div class="t">Tidak ada santri</div>Tambah data atau ubah filter</div>';
    return;
  }

  const editor = user?.role === 'admin' || user?.role === 'musyrif';

  el.innerHTML = list.map(s => {
    const c = DB.setoran.filter(x => x.santriId === s.id).length;
    const uname = s.username || s.nama.toLowerCase().replace(/\s+/g, '');
    const avatar = s.foto
      ? `<img src="${s.foto}" alt="${s.nama}" class="santri-avatar">`
      : `<div class="santri-avatar santri-avatar-initial">${s.nama.charAt(0).toUpperCase()}</div>`;
    return `
    <div class="item">
      <div class="santri-row">
        ${avatar}
        <div class="item-main">
          <div class="item-name">${s.nama}</div>
          <div class="item-meta">${s.halaqah} · Target ${s.target} juz · ${c} setoran</div>
          <div class="item-meta" style="margin-top:2px;color:var(--text-soft)">Login: <code>${uname}</code>${s.namaWali ? ` · Wali: ${s.namaWali}` : ''}</div>
        </div>
      </div>
      <div class="santri-actions">
        <button class="btn btn-alt btn-s" onclick="bukaKartu(${s.id})">🎫 Kartu</button>
        ${editor ? `<button class="btn btn-red btn-s" onclick="hapusSantri(${s.id})">Hapus</button>` : ''}
      </div>
    </div>`;
  }).join('');
}