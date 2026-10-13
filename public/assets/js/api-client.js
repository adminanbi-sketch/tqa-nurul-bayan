// =========================================================
// API CLIENT — Helper untuk panggil backend
// =========================================================

// Base URL: otomatis detect (localhost atau domain)
const API_BASE = window.location.origin + '/api';

/**
 * Request ke API
 * @param {string} method - GET, POST, PUT, DELETE
 * @param {string} endpoint - contoh: '/santri'
 * @param {object} body - data untuk POST/PUT
 */
async function apiCall(method, endpoint, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + endpoint, opts);
  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error('Response bukan JSON: ' + res.status);
  }
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data;
}

// =========================================================
// SHORTCUTS
// =========================================================
const api = {
  get: (endpoint) => apiCall('GET', endpoint),
  post: (endpoint, body) => apiCall('POST', endpoint, body),
  put: (endpoint, body) => apiCall('PUT', endpoint, body),
  del: (endpoint) => apiCall('DELETE', endpoint),

  // Auth
  login: (username, password, role) => apiCall('POST', '/login', { username, password, role }),

  // Santri
  getSantri: () => apiCall('GET', '/santri'),
  addSantri: (data) => apiCall('POST', '/santri', data),
  updateSantri: (id, data) => apiCall('PUT', '/santri/' + id, data),
  deleteSantri: (id) => apiCall('DELETE', '/santri/' + id),

  // Setoran
  getSetoran: () => apiCall('GET', '/setoran'),
  addSetoran: (data) => apiCall('POST', '/setoran', data),
  verifikasiSetoran: (id, oleh) => apiCall('PUT', '/setoran/' + id + '/verifikasi', { oleh }),
  deleteSetoran: (id) => apiCall('DELETE', '/setoran/' + id),

  // Absen
  getAbsen: () => apiCall('GET', '/absen'),
  saveAbsen: (items) => apiCall('POST', '/absen', { items }),

  // Mutabaah
  getMutabaah: () => apiCall('GET', '/mutabaah'),
  saveMutabaah: (data) => apiCall('POST', '/mutabaah', data),

  // Halaqah
  getHalaqah: () => apiCall('GET', '/halaqah'),
  addHalaqah: (data) => apiCall('POST', '/halaqah', data),
  deleteHalaqah: (id) => apiCall('DELETE', '/halaqah/' + id),

  // Amalan
  getAmalan: () => apiCall('GET', '/amalan'),
  addAmalan: (t) => apiCall('POST', '/amalan', { t }),
  deleteAmalan: (id) => apiCall('DELETE', '/amalan/' + id),

  // Users (Musyrif)
  getUsers: () => apiCall('GET', '/users'),
  addUser: (data) => apiCall('POST', '/users', data),
  deleteUser: (username) => apiCall('DELETE', '/users/' + username),

  // Pengumuman
  getPengumuman: () => apiCall('GET', '/pengumuman'),
  savePengumuman: (teks) => apiCall('POST', '/pengumuman', { teks }),

  // Ganti Password
  gantiPassword: (data) => apiCall('POST', '/ganti-password', data),
};