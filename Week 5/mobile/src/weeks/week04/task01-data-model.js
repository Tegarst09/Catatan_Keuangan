// Week 4 Task 1: DTO server (snake_case) diubah menjadi model UI (camelCase).
export const CATEGORIES = ['Makan', 'Transportasi', 'Kuliah', 'Kos', 'Hiburan', 'Lainnya'];
export const INCOME_CATEGORIES = ['Uang saku', 'Beasiswa', 'Kerja sampingan', 'Lainnya'];
export const rupiah = (amount) => `Rp${Math.round(amount).toLocaleString('id-ID')}`;
export function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= '2000-01-01' && value <= '2100-12-31';
}
export const validMonth = value => /^\d{4}-(0[1-9]|1[0-2])$/.test(value || '') && value >= '2000-01' && value <= '2100-12';
export function transactionFromDTO(dto) {
  if (!dto || typeof dto.id !== 'string' || typeof dto.title !== 'string' ||
      !['income', 'expense'].includes(dto.type) || !Number.isSafeInteger(dto.amount_rupiah) || dto.amount_rupiah <= 0 ||
      typeof dto.category !== 'string' || !validDate(dto.transaction_date)) throw new Error('Format transaksi dari server tidak sesuai.');
  return { id: dto.id, title: dto.title, type: dto.type, amount: dto.amount_rupiah, category: dto.category, date: dto.transaction_date };
}
export function validateTransaction(data) {
  if (!data || typeof data.title !== 'string' || data.title.trim().length < 2 || data.title.trim().length > 80) return 'Catatan perlu berisi 2–80 karakter.';
  if (!['income', 'expense'].includes(data.type)) return 'Pilih pemasukan atau pengeluaran.';
  if (!Number.isSafeInteger(data.amount) || data.amount < 1 || data.amount > 1_000_000_000) return 'Nominal harus berupa rupiah bulat antara 1 dan 1.000.000.000.';
  const choices = data.type === 'income' ? INCOME_CATEGORIES : CATEGORIES;
  if (!choices.includes(data.category)) return 'Pilih kategori yang sesuai.';
  if (!validDate(data.date)) return 'Tanggal harus valid dengan format YYYY-MM-DD (tahun 2000–2100).';
  return '';
}
export const transactionToDTO = item => ({ title: item.title.trim(), type: item.type, amount_rupiah: item.amount, category: item.category, transaction_date: item.date });
export function summarize(transactions, budget = 0) {
  const income = transactions.filter(x => x.type === 'income').reduce((s, x) => s + x.amount, 0);
  const expense = transactions.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const byCategory = CATEGORIES.map(category => ({ category, total: transactions.filter(x => x.type === 'expense' && x.category === category).reduce((s, x) => s + x.amount, 0) })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);
  return { income, expense, balance: income - expense, budget, remaining: budget - expense, percent: budget > 0 ? Math.round(expense / budget * 100) : 0, byCategory };
}
export function shiftMonth(month, offset) {
  const [year, m] = month.split('-').map(Number); const d = new Date(Date.UTC(year, m - 1 + offset, 1));
  return d.toISOString().slice(0, 7);
}
