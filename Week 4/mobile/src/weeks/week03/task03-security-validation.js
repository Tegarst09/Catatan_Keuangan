// Week 3 Task 3: validasi dipakai form dan diuji melalui node:test.
export function validateCredentials({ email, password, name, confirmPassword }, registering = false) {
  if (!email?.trim() || !password || (registering && !name?.trim())) return 'Lengkapi semua kolom yang wajib diisi.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254) return 'Masukkan alamat email yang valid.';
  if (password.length < 8 || password.length > 128) return 'Password harus berisi 8–128 karakter.';
  if (registering && (name.trim().length < 2 || name.trim().length > 60)) return 'Nama perlu berisi 2–60 karakter.';
  if (registering && password !== confirmPassword) return 'Konfirmasi password belum sama.';
  return '';
}
