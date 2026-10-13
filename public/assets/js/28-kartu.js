// =========================================================
// KARTU SANTRI + BARCODE
// =========================================================

/* Generate ID unik untuk santri: TQA-YYYY-NNNN */
function generateSantriId(santri) {
  if (santri.kodeId) return santri.kodeId;
  const tahun = new Date(santri.tglDaftar || Date.now()).getFullYear();
  const urut = String(DB.santri.findIndex(x => x.id === santri.id) + 1).padStart(4, '0');
  return `TQA-${tahun}-${urut}`;
}

function bukaKartu(id) {
  const s = DB.santri.find(x => x.id === id);
  if (!s) return toast('Santri tidak ditemukan');

  /* Set kode ID permanen kalau belum ada */
  if (!s.kodeId) {
    s.kodeId = generateSantriId(s);
    simpan();
  }

  const fotoHtml = s.foto
    ? `<img class="kartu-foto" src="${s.foto}" alt="${s.nama}">`
    : `<div class="kartu-foto kartu-foto-initial">${s.nama.charAt(0).toUpperCase()}</div>`;

  const html = `
    <div class="kartu-santri" id="kartuPrintArea">
      <div class="kartu-header">
        <img src="${LOGO_DATA_URL}" alt="Logo">
        <div>
          <h3>TQA NURUL BAYAN</h3>
          <div class="sub">Kartu Identitas Santri</div>
        </div>
      </div>
      <div class="kartu-body">
        ${fotoHtml}
        <div class="kartu-info">
          <div class="nama">${s.nama}</div>
          <div class="row">Halaqah: <strong>${s.halaqah}</strong></div>
          <div class="row">Target: <strong>${s.target} juz</strong></div>
          ${s.namaWali ? `<div class="row">Wali: ${s.namaWali}</div>` : ''}
        </div>
      </div>
      <div class="kartu-barcode">
        <svg id="barcodeSantri"></svg>
        <div class="kartu-id">${s.kodeId}</div>
      </div>
    </div>
  `;

  document.getElementById('kartuContent').innerHTML = html;
  document.getElementById('kartuOverlay').classList.add('on');

  /* Render barcode setelah elemen ada */
  if (typeof JsBarcode !== 'undefined') {
    try {
      JsBarcode('#barcodeSantri', s.kodeId, {
        format: 'CODE128',
        width: 1.6,
        height: 44,
        displayValue: false,
        margin: 0,
        background: 'transparent',
      });
    } catch (e) { console.warn('Barcode error', e); }
  }
}

function tutupKartu() {
  document.getElementById('kartuOverlay').classList.remove('on');
}

function cetakKartu() {
  window.print();
}

/* Klik overlay untuk tutup */
document.addEventListener('click', e => {
  const overlay = document.getElementById('kartuOverlay');
  if (overlay && e.target === overlay) tutupKartu();
});