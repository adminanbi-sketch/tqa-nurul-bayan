// =========================================================
// SETORAN — via API
// =========================================================
let filterSetoranVal = 'all';

async function simpanSetoran() {
  const santriId = parseInt(document.getElementById('inSetoranSantri').value);
  const juz = document.getElementById('inSetoranJuz').value;
  const surahValue = document.getElementById('inSetoranSurah').value;
  const dataSurah = (typeof QURAN !== 'undefined') ? QURAN.find(q => q.nomor === Number(surahValue)) : null;
  const surah = dataSurah ? dataSurah.surat : '';

  if (!santriId) return toast('Pilih santri');
  if (!juz || !surah) return toast('Juz dan surah wajib diisi');
  if (dataSurah && !dataSurah.juz.includes(parseInt(juz))) {
    return toast(`Surah ${surah} tidak termasuk Juz ${juz}. Periksa kembali pilihan.`);
  }

  const tajwid = {};
  TAJWID_KATEGORI.forEach(t => { tajwid[t.id] = document.getElementById('tw-' + t.id).checked; });

  const dariSantri = user?.role === 'santri';

  const btn = document.querySelector('#formSetoranBox .btn-main');
  const origText = btn ? btn.textContent : 'Simpan Setoran';
  if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan...'; }

  try {
    await api.addSetoran({
      santriId,
      jenis: document.getElementById('inSetoranJenis').value,
      juz: parseInt(juz),
      surah,
      ayat: document.getElementById('inSetoranAyat').value.trim() || '-',
      nilai: document.getElementById('inSetoranNilai').value,
      tajwid,
      catatan: document.getElementById('inSetoranCatatan').value.trim(),
      audio: audioData,
      tanggal: new Date().toISOString(),
      dariSantri: dariSantri,
      diinputOleh: user?.nama || '—',
      diverifikasi: !dariSantri,
    });

    /* Reset form */
    ['inSetoranJuz', 'inSetoranSurah', 'inSetoranAyat', 'inSetoranCatatan']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

    if (typeof autofillInfoSurah === 'function') autofillInfoSurah();

    TAJWID_KATEGORI.forEach(t => {
      const el = document.getElementById('tw-' + t.id);
      if (el) el.checked = false;
    });

    hapusRekaman();

    /* Reload data dari server */
    await loadAllData();
    renderSetoran();
    renderStat();

    toast(dariSantri ? 'Setoran terkirim, menunggu verifikasi musyrif' : 'Setoran tersimpan');
  } catch (e) {
    console.error('Error simpan setoran:', e);
    toast('Gagal menyimpan: ' + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

async function hapusSetoran(id) {
  const ok = await konfirmasi('Hapus setoran ini?', { title: 'Hapus Setoran', okText: 'Ya, Hapus' });
  if (!ok) return;

  try {
    await api.deleteSetoran(id);
    await loadAllData();
    renderSetoran();
    renderStat();
    toast('Setoran dihapus');
  } catch (e) {
    console.error('Error hapus setoran:', e);
    toast('Gagal menghapus: ' + e.message);
  }
}

function filterSetoran(f, btn) {
  filterSetoranVal = f;
  document.querySelectorAll('#filterJenisChips .chip').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  renderSetoran();
}

function renderSetoran() {
  const el = document.getElementById('listSetoran');
  if (!el) return;

  const cari = (document.getElementById('cariSetoran')?.value || '').toLowerCase();
  let data = [...DB.setoran];

  if (user?.role === 'musyrif') {
    const myHalaqah = DB.halaqah.filter(h => h.musyrif === user.username).map(h => h.nama);
    if (myHalaqah.length === 0) {
      data = [];
    } else {
      const ids = DB.santri.filter(s => myHalaqah.includes(s.halaqah)).map(s => s.id);
      data = data.filter(s => ids.includes(s.santriId));
    }
  } else if (user?.role === 'santri' || user?.role === 'wali') {
    data = data.filter(s => s.santriId === user.santriId);
  }

  if (filterSetoranVal !== 'all') data = data.filter(s => s.jenis === filterSetoranVal);

  if (cari) {
    data = data.filter(s => {
      const santri = DB.santri.find(x => x.id === s.santriId);
      return (santri && santri.nama.toLowerCase().includes(cari)) ||
             (s.surah && s.surah.toLowerCase().includes(cari));
    });
  }

  if (data.length === 0) {
    el.innerHTML = '<div class="nodata"><div class="t">Belum ada data</div>Setoran akan muncul di sini</div>';
    return;
  }

  const editor = user?.role === 'admin' || user?.role === 'musyrif';

  el.innerHTML = data.map(s => {
    const santri = DB.santri.find(x => x.id === s.santriId);
    const tgl = new Date(s.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const tajwidAktif = s.tajwid
      ? TAJWID_KATEGORI.filter(t => s.tajwid[t.id]).map(t => t.label.split(' ')[0])
      : [];

    let badgeMandiri = '';
    if (s.dariSantri) {
      if (s.diverifikasi) {
        badgeMandiri = `<span class="tag tag-green" style="margin-left:4px" title="Sudah diverifikasi musyrif">✓ Verified</span>`;
      } else {
        badgeMandiri = `<span class="tag tag-yellow" style="margin-left:4px" title="Menunggu verifikasi musyrif">⏳ Mandiri</span>`;
      }
    }

    const audioHtml = s.audio
      ? `<div class="audio-wrap">
           <div class="audio-label">🎧 Rekaman Setoran</div>
           <audio controls preload="metadata" src="${s.audio}" style="margin-top:4px;width:100%"></audio>
         </div>`
      : '';

    return `
      <div class="item">
        <div class="item-main">
          <div class="item-name">
            ${santri ? santri.nama : '—'}
            <span class="tag ${badgeNilai[s.nilai] || 'tag-blue'}" style="margin-left:6px">${s.nilai || '—'}</span>
            ${badgeMandiri}
          </div>
          <div class="item-meta">${s.jenis} · Juz ${s.juz} · ${s.surah}:${s.ayat}<br>${tgl}</div>
          ${tajwidAktif.length ? `<div class="item-meta" style="margin-top:3px">Kesalahan: <span style="color:var(--tag-red-fg)">${tajwidAktif.join(', ')}</span></div>` : ''}
          ${s.catatan ? `<div class="item-note">Catatan: ${s.catatan}</div>` : ''}
          ${audioHtml}
        </div>
        ${editor && s.dariSantri && !s.diverifikasi
          ? `<div style="display:flex;gap:4px;flex-direction:column">
               <button class="btn btn-main btn-s" onclick="verifikasiSetoran(${s.id})" style="width:auto">✓ Verifikasi</button>
               <button class="btn btn-red" onclick="hapusSetoran(${s.id})">Hapus</button>
             </div>`
          : (editor ? `<button class="btn btn-red" onclick="hapusSetoran(${s.id})">Hapus</button>` : '')
        }
      </div>`;
  }).join('');
}

async function verifikasiSetoran(id) {
  if (!user || (user.role !== 'musyrif' && user.role !== 'admin')) {
    return toast('Hanya musyrif/admin yang bisa verifikasi');
  }

  const ok = await konfirmasi('Verifikasi setoran ini sebagai benar?', {
    title: 'Verifikasi Setoran',
    okText: 'Ya, Verifikasi',
    danger: false
  });
  if (!ok) return;

  try {
    await api.verifikasiSetoran(id, user.nama);
    await loadAllData();
    renderSetoran();
    toast('Setoran diverifikasi');
  } catch (e) {
    console.error('Error verifikasi:', e);
    toast('Gagal verifikasi: ' + e.message);
  }
}