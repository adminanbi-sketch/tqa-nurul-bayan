// =========================================================
// HASH PASSWORD — sama seperti di frontend
// =========================================================
function hashPass(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  try {
    return 'h' + Math.abs(h).toString(36) + '_' + Buffer.from(s).toString('base64').slice(0, 8);
  } catch (e) {
    return 'h' + Math.abs(h).toString(36);
  }
}

module.exports = { hashPass };