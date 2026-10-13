// =========================================================
// AUDIO RECORDER
// =========================================================
let mediaRec = null, chunks = [], recTimer = null, recSecs = 0, audioData = null;

async function cekMikrofon() {
  const infoEl = document.getElementById('infoMic');
  const warnEl = document.getElementById('micWarn');
  const btn = document.getElementById('recBtn');
  const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (infoEl) infoEl.textContent = 'Tidak didukung';
    if (warnEl) { warnEl.style.display = 'block'; warnEl.textContent = '⚠️ Browser tidak mendukung perekaman audio.'; }
    if (btn) btn.disabled = true;
    return;
  }
  if (!isSecure) {
    if (infoEl) infoEl.textContent = 'Perlu HTTPS';
    if (warnEl) { warnEl.style.display = 'block'; warnEl.innerHTML = '⚠️ Perekaman butuh HTTPS atau localhost.'; }
  } else {
    if (infoEl) infoEl.textContent = 'Siap digunakan';
  }
}

async function toggleRekam() {
  const btn = document.getElementById('recBtn');
  const hint = document.getElementById('recHint');
  const warnEl = document.getElementById('micWarn');
  if (mediaRec && mediaRec.state === 'recording') { mediaRec.stop(); return; }
  if (warnEl) warnEl.style.display = 'none';
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return toast('Browser tidak mendukung mikrofon');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });

    /* ✅ Pilih mimeType yang didukung — prioritaskan yang paling kompatibel */
    let mimeType = '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/mpeg',
    ];
    for (const t of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
        mimeType = t;
        break;
      }
    }

    mediaRec = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    chunks = []; recSecs = 0;

    mediaRec.ondataavailable = e => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    mediaRec.onstop = () => {
      /* ✅ MIME type BERSIH — tanpa ;codecs=... */
      const cleanMime = (mimeType || 'audio/webm').split(';')[0].trim();
      const blob = new Blob(chunks, { type: cleanMime });

      /* ✅ Stop semua track mikrofon */
      stream.getTracks().forEach(t => t.stop());

      /* ✅ Baca sebagai DataURL */
      const reader = new FileReader();
      reader.onloadend = () => {
        audioData = reader.result;

        /* ✅ Set src + reset + tampilkan — TANPA autoplay paksa */
        const a = document.getElementById('audioPreview');
        if (a) {
          a.pause();
          a.removeAttribute('src');   // reset dulu
          a.load();                    // reload elemen
          a.src = audioData;
          a.style.display = 'block';
          /* Tidak autoplay — biar user klik ▶ sendiri */
        }
        if (hint) hint.textContent = `Selesai · ${(blob.size / 1024).toFixed(1)} KB — klik ▶ untuk memutar`;
      };
      reader.onerror = () => {
        if (hint) hint.textContent = 'Gagal membaca hasil rekaman';
        toast('Gagal membaca hasil rekaman');
      };
      reader.readAsDataURL(blob);

      if (btn) { btn.classList.remove('rec-on'); btn.textContent = '●'; }
      clearInterval(recTimer);
    };

    mediaRec.onerror = (e) => {
      console.warn('MediaRecorder error', e);
      toast('Terjadi error saat merekam');
      if (btn) { btn.classList.remove('rec-on'); btn.textContent = '●'; }
      clearInterval(recTimer);
      stream.getTracks().forEach(t => t.stop());
    };

    mediaRec.start(100);

    if (btn) { btn.classList.add('rec-on'); btn.textContent = '■'; }
    if (hint) hint.textContent = 'Sedang merekam...';
    const timeEl = document.getElementById('recTime');
    if (timeEl) timeEl.textContent = '00:00';

    recTimer = setInterval(() => {
      recSecs++;
      if (timeEl) {
        timeEl.textContent = `${String(Math.floor(recSecs / 60)).padStart(2, '0')}:${String(recSecs % 60).padStart(2, '0')}`;
      }
      if (recSecs >= 300) mediaRec.stop();  // max 5 menit
    }, 1000);

  } catch (err) {
    let pesan = 'Tidak bisa akses mikrofon';
    if (err.name === 'NotAllowedError') pesan = 'Akses mikrofon ditolak.';
    else if (err.name === 'NotFoundError') pesan = 'Tidak ada mikrofon.';
    else if (err.name === 'SecurityError') pesan = 'Butuh HTTPS.';
    if (warnEl) { warnEl.style.display = 'block'; warnEl.textContent = '⚠️ ' + pesan; }
    toast(pesan, 3500);
  }
}

function hapusRekaman() {
  audioData = null;
  const a = document.getElementById('audioPreview');
  if (a) {
    a.pause();
    a.removeAttribute('src');
    a.load();
    a.style.display = 'none';
  }
  const timeEl = document.getElementById('recTime');
  if (timeEl) timeEl.textContent = '00:00';
  const hint = document.getElementById('recHint');
  if (hint) hint.textContent = 'Ketuk untuk mulai merekam';
}