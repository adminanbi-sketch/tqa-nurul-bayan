/// =========================================================
// DATABASE — SQLite (sqlite3, async wrapper)
// =========================================================
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'tqa.db');
const db = new sqlite3.Database(DB_PATH);

// =========================================================
// HELPER: Promise wrapper
// =========================================================
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// =========================================================
// INIT — buat tabel & seed
// =========================================================
async function init() {
  // Buat tabel
  await exec(`
    CREATE TABLE IF NOT EXISTS santri (
      id INTEGER PRIMARY KEY,
      nama TEXT NOT NULL,
      username TEXT,
      halaqah TEXT,
      target INTEGER DEFAULT 30,
      tglLahir TEXT,
      namaWali TEXT,
      hpWali TEXT,
      foto TEXT,
      kodeId TEXT,
      passSantri TEXT,
      passWali TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS setoran (
      id INTEGER PRIMARY KEY,
      santriId INTEGER NOT NULL,
      jenis TEXT,
      juz INTEGER,
      surah TEXT,
      ayat TEXT,
      nilai TEXT,
      tajwid TEXT,
      catatan TEXT,
      audio TEXT,
      tanggal TEXT,
      dariSantri INTEGER DEFAULT 0,
      diinputOleh TEXT,
      diverifikasi INTEGER DEFAULT 1,
      diverifikasiOleh TEXT,
      diverifikasiTanggal TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS absen (
      id INTEGER PRIMARY KEY,
      santriId INTEGER NOT NULL,
      tanggal TEXT NOT NULL,
      status TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS mutabaah (
      id INTEGER PRIMARY KEY,
      santriId INTEGER NOT NULL,
      tanggal TEXT NOT NULL,
      items TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS halaqah (
      id INTEGER PRIMARY KEY,
      nama TEXT UNIQUE NOT NULL,
      musyrif TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS amalan (
      id TEXT PRIMARY KEY,
      t TEXT NOT NULL,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      nama TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pengumuman (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      teks TEXT,
      updatedAt TEXT
    );
  `);

  // =========================================================
  // SEED — data default
  // =========================================================
  const { hashPass } = require('./hash');

  // Halaqah default
  const halaqahCount = await get('SELECT COUNT(*) AS c FROM halaqah');
  if (halaqahCount.c === 0) {
    const now = new Date().toISOString();
    await run('INSERT INTO halaqah (id, nama, musyrif, createdAt) VALUES (?, ?, ?, ?)', [Date.now(), 'Halaqah A', 'musyrif', now]);
    await run('INSERT INTO halaqah (id, nama, musyrif, createdAt) VALUES (?, ?, ?, ?)', [Date.now() + 1, 'Halaqah B', null, now]);
  }

  // Amalan default
  const amalanCount = await get('SELECT COUNT(*) AS c FROM amalan');
  if (amalanCount.c === 0) {
    const now = new Date().toISOString();
    const defaults = [
      ['subuh', 'Sholat Subuh berjamaah'],
      ['dzuhur', 'Sholat Dzuhur berjamaah'],
      ['ashar', 'Sholat Ashar berjamaah'],
      ['maghrib', 'Sholat Maghrib berjamaah'],
      ['isya', 'Sholat Isya berjamaah'],
      ['tahajud', 'Sholat Tahajud / Witir'],
      ['dhuha', 'Sholat Dhuha'],
      ['tilawah', "Tilawah Al-Qur'an"],
      ['murojaah', "Muroja'ah hafalan"],
      ['dzikir', 'Dzikir pagi & petang'],
    ];
    for (const [id, t] of defaults) {
      await run('INSERT INTO amalan (id, t, createdAt) VALUES (?, ?, ?)', [id, t, now]);
    }
  }

  // Users default
  const usersCount = await get('SELECT COUNT(*) AS c FROM users');
  if (usersCount.c === 0) {
    await run('INSERT INTO users (username, password, role, nama) VALUES (?, ?, ?, ?)', ['admin', hashPass('admin123'), 'admin', 'Administrator']);
    await run('INSERT INTO users (username, password, role, nama) VALUES (?, ?, ?, ?)', ['musyrif', hashPass('musyrif123'), 'musyrif', 'Musyrif']);
  }

  // Pengumuman default
  const pengCount = await get('SELECT COUNT(*) AS c FROM pengumuman');
  if (pengCount.c === 0) {
    await run('INSERT INTO pengumuman (id, teks, updatedAt) VALUES (1, ?, ?)', ['', new Date().toISOString()]);
  }

  console.log('✅ Database siap');
}

module.exports = { db, run, get, all, exec, init };