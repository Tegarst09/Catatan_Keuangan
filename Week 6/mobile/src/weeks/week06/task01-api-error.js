// Week 6 Task 1: response HTTP, format data, timeout dan kegagalan jaringan.
export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK' } = {}) { super(message); this.name = 'ApiError'; this.status = status; this.code = code; }
}
export function httpError(status, message) {
  const known = {
    400: 'Data yang dikirim belum sesuai. Periksa isianmu.',
    401: 'Sesi berakhir. Silakan masuk kembali.',
    403: 'Kamu tidak memiliki izin untuk data ini.',
    404: 'Data yang dicari tidak ditemukan.',
    409: 'Data sudah digunakan. Coba pilihan lain.',
    429: 'Terlalu banyak percobaan. Tunggu sebentar.'
  };
  return new ApiError(status >= 500 ? 'Server sedang bermasalah. Coba lagi sebentar.' : (known[status] || message || 'Permintaan belum berhasil.'), { status, code: 'HTTP' });
}
