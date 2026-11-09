// =========================================================
// AUDIO RECORDER — VERSI BEBAS BATASAN (TANPA CUT-OFF)
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

    /* ✅ Pilih mimeType yang didukung */
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

    /* ✅ OPTIMASI: Kompresi Bitrate Rendah (24 kbps) agar file hemat memori */
    mediaRec = new MediaRecorder(stream, {
      mimeType: mimeType ? mimeType : '',
      audioBitsPerSecond: 24000 
    });
    
    chunks = []; recSecs = 0;

    mediaRec.ondataavailable = e => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    mediaRec.onstop = async () => {
      const cleanMime = (mimeType || 'audio/webm').split(';')[0].trim();
      const blob = new Blob(chunks, { type: cleanMime });
      stream.getTracks().forEach(t => t.stop());

      if (btn) { btn.classList.remove('rec-on'); btn.textContent = '●'; }
      clearInterval(recTimer);
      if (hint) hint.textContent = 'Memproses audio...';

      try {
        /* ✅ Pangkas bagian hening di awal & akhir */
        const trimmedBlob = await pangkasHening(blob);
        
        /* ✅ Baca sebagai DataURL */
        const reader = new FileReader();
        reader.onloadend = () => {
          audioData = reader.result;
          const a = document.getElementById('audioPreview');
          if (a) {
            a.pause();
            a.removeAttribute('src');
            a.load();
            a.src = audioData;
            a.style.display = 'block';
          }
          const sizeKB = (trimmedBlob.size / 1024).toFixed(1);
          const durasiMenit = Math.floor(recSecs / 60);
          const durasiDetik = recSecs % 60;
          if (hint) hint.textContent = `Selesai · ${sizeKB} KB · ${durasiMenit}m ${durasiDetik}s — klik ▶ untuk memutar`;
        };
        reader.onerror = () => {
          if (hint) hint.textContent = 'Gagal membaca hasil rekaman';
          toast('Gagal membaca hasil rekaman');
        };
        reader.readAsDataURL(trimmedBlob);

      } catch (err) {
        console.warn('Gagal proses audio:', err);
        // Fallback: jika pemangkasan gagal, tetap kirim audio aslinya
        const reader = new FileReader();
        reader.onloadend = () => {
          audioData = reader.result;
          const a = document.getElementById('audioPreview');
          if (a) {
            a.src = audioData;
            a.style.display = 'block';
          }
          if (hint) hint.textContent = 'Selesai (mode standar)';
        };
        reader.readAsDataURL(blob);
      }
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
      // ✅ TIDAK ADA BATASAN DURASI. Timer terus berjalan sampai user menekan tombol stop.
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

// =========================================================
// FUNGSI HELPER: PANGKAS BAGIAN HENING (SILENCE TRIMMING)
// =========================================================
async function pangkasHening(blob) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const threshold = 0.02; // Batas suara (makin besar, makin agresif memangkas)
    const sampleRate = audioBuffer.sampleRate;
    
    let start = 0;
    let end = channelData.length - 1;
    
    // Cari awal suara (buang hening di depan)
    for (let i = 0; i < channelData.length; i++) {
      if (Math.abs(channelData[i]) > threshold) { start = Math.max(0, i - 1000); break; } // Sisakan 0.1 detik
    }
    // Cari akhir suara (buang hening di belakang)
    for (let i = channelData.length - 1; i > 0; i--) {
      if (Math.abs(channelData[i]) > threshold) { end = Math.min(channelData.length - 1, i + 1000); break; }
    }
    
    // Jika tidak ada suara sama sekali (hening total)
    if (end <= start) return blob; 

    // Potong array
    const trimmedData = channelData.slice(start, end);
    const newBuffer = audioCtx.createBuffer(1, trimmedData.length, sampleRate);
    newBuffer.copyToChannel(trimmedData, 0);
    
    // Konversi AudioBuffer ke WAV (untuk kompatibilitas maksimal)
    const wavBlob = audioBufferToWav(newBuffer);
    
    // Tutup AudioContext untuk hemat memori
    if (audioCtx.state !== 'closed') audioCtx.close();
    
    return wavBlob;
  } catch (err) {
    console.warn('Gagal pangkas hening, pakai aslinya:', err);
    return blob; // Fallback ke blob asli jika gagal
  }
}

// =========================================================
// FUNGSI HELPER: AUDIO BUFFER TO WAV
// =========================================================
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  let result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  
  const dataLength = result.length * (bitDepth / 8);
  const bufferLength = 44 + dataLength;
  const view = new DataView(new ArrayBuffer(bufferLength));
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  let offset = 44;
  for (let i = 0; i < result.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, result[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7FFF;
    view.setInt16(offset, s, true);
  }
  
  return new Blob([view], { type: 'audio/wav' });
}

function interleave(inputL, inputR) {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  let index = 0;
  let inputIndex = 0;
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}