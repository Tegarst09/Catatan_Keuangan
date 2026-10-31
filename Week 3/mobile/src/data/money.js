// Data contoh untuk demo UI Week 2. Perubahan hanya berada dalam state aplikasi.
export const CATEGORIES = ['Makan', 'Transportasi', 'Kuliah', 'Kos', 'Hiburan', 'Lainnya'];
export const rupiah = amount => `Rp${Math.round(amount).toLocaleString('id-ID')}`;
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const month = today().slice(0, 7);
export const demoData = {
  budget: 1500000,
  transactions: [
    { id: '1', title: 'Cetak materi kuliah', amount: 40000, type: 'expense', category: 'Kuliah', date: `${month}-10` },
    { id: '2', title: 'Bensin ke kampus', amount: 75000, type: 'expense', category: 'Transportasi', date: `${month}-08` },
    { id: '3', title: 'Belanja makan seminggu', amount: 235000, type: 'expense', category: 'Makan', date: `${month}-06` },
    { id: '4', title: 'Sewa kos', amount: 600000, type: 'expense', category: 'Kos', date: `${month}-02` },
    { id: '5', title: 'Uang saku bulanan', amount: 2000000, type: 'income', category: 'Uang saku', date: `${month}-01` }
  ]
};
export function summarize(transactions, budget = 0) {
  const income = transactions.filter(x => x.type === 'income').reduce((s, x) => s + x.amount, 0);
  const expense = transactions.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0);
  const byCategory = CATEGORIES.map(category => ({ category, total: transactions.filter(x => x.type === 'expense' && x.category === category).reduce((s, x) => s + x.amount, 0) })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);
  return { income, expense, balance: income - expense, budget, remaining: budget - expense, percent: budget ? Math.round(expense / budget * 100) : 0, byCategory };
}
