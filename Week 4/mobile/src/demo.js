import { localToday } from './weeks/week04/task01-data-model';
const month = localToday().slice(0, 7);
export const demoData = {
  budget: 1_500_000,
  transactions: [
    { id: 'demo-1', title: 'Uang saku bulanan', type: 'income', amount: 2_000_000, category: 'Uang saku', date: `${month}-01` },
    { id: 'demo-2', title: 'Sewa kos', type: 'expense', amount: 600_000, category: 'Kos', date: `${month}-02` },
    { id: 'demo-3', title: 'Belanja makan seminggu', type: 'expense', amount: 235_000, category: 'Makan', date: `${month}-06` },
    { id: 'demo-4', title: 'Bensin ke kampus', type: 'expense', amount: 75_000, category: 'Transportasi', date: `${month}-08` },
    { id: 'demo-5', title: 'Cetak materi kuliah', type: 'expense', amount: 40_000, category: 'Kuliah', date: `${month}-10` }
  ]
};
