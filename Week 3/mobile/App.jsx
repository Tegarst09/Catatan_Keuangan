import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/weeks/week02/task01-home';
import { useResponsive } from './src/weeks/week02/task02-responsive';
import { Button, Chip, Field, Heading, Notice } from './src/weeks/week02/task03-accessibility';
import { TransactionList } from './src/components/TransactionList';
import { AddNoteModal } from './src/components/AddNoteModal';
import { demoData, rupiah, summarize, today } from './src/data/money';
import { colors as c } from './src/theme';
import { SessionProvider, useSession } from './src/weeks/week03/local-session';
import { AuthScreen } from './src/weeks/week03/task01-auth-flow';
const tabs = [['home', '◉', 'Ringkasan'], ['history', '≡', 'Transaksi'], ['budget', '▤', 'Anggaran'], ['profile', '☺', 'Profil']];
function MoneyTrack({ user, onExit, preview = false }) {
  const [tab, setTab] = useState('home'); const [items, setItems] = useState(() => [...demoData.transactions]);
  const [budget, setBudget] = useState(demoData.budget); const [budgetInput, setBudgetInput] = useState(String(demoData.budget));
  const [hideAmounts, setHideAmounts] = useState(false); const [formOpen, setFormOpen] = useState(false); const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const { padding, compact } = useResponsive();
  const summary = summarize(items, budget); const display = amount => hideAmounts ? '••••••' : rupiah(amount);
  const move = key => { setTab(key); setMessage(''); setError(''); };
  const saveBudget = () => {
    const value = /^\d+$/.test(budgetInput) ? Number(budgetInput) : NaN;
    if (!Number.isSafeInteger(value) || value < 0 || value > 1000000000) return setError('Isi rupiah bulat antara 0 dan 1.000.000.000.');
    setBudget(value); setError(''); setMessage('Contoh anggaran diperbarui.');
  };
  return <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: c.bg }}>
    <StatusBar barStyle="dark-content" backgroundColor={c.bg} />
    <View style={[s.header, { paddingHorizontal: padding }]}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}><Image source={require('./assets/icon.png')} style={{ width: 34, height: 34, borderRadius: 10 }} accessibilityLabel="Logo dompet Money Track" /><Text style={{ fontWeight: '800', color: c.ink, fontSize: compact ? 18 : 22 }}>Money Track</Text></View><Text style={{ color: c.green, backgroundColor: c.mint, padding: 9, borderRadius: 16, fontSize: 11, fontWeight: '700' }}>MAHASISWA</Text></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding, paddingBottom: 28 }}><View style={{ maxWidth: 1040, width: '100%', alignSelf: 'center', gap: 20 }}>
      <Text style={{ color: c.muted, fontSize: 13, fontWeight: '700' }}>BULAN {today().slice(0, 7)}</Text>
      {preview && <Notice>Mode contoh dengan data fiktif.</Notice>}{!!message && <Notice>{message}</Notice>}{!!error && <Notice error>{error}</Notice>}
      {tab === 'home' && <HomeScreen name={user.name} data={{ transactions: items, budget }} onAdd={() => setFormOpen(true)} onHistory={() => move('history')} onBudget={() => move('budget')} hideAmounts={hideAmounts} setHideAmounts={setHideAmounts} />}
      {tab === 'history' && <View style={{ gap: 18 }}><Heading>Ke mana uangmu pergi?</Heading><Text style={s.body}>Lihat pemasukan dan pengeluaran bulan ini.</Text><Button onPress={() => setFormOpen(true)}>+ Tambah catatan</Button><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{[['all', 'Semua'], ['income', 'Pemasukan'], ['expense', 'Pengeluaran']].map(([key, text]) => <Chip key={key} selected={filter === key} onPress={() => setFilter(key)}>{text}</Chip>)}</View><TransactionList items={items.filter(x => filter === 'all' || x.type === filter)} hideAmounts={hideAmounts} /></View>}
      {tab === 'budget' && <View style={{ gap: 18 }}><Heading>Belanja dengan batas.</Heading><Text style={s.body}>Tentukan contoh batas pengeluaran bulanan. Angka 0 berarti tanpa batas anggaran.</Text><View style={s.card}><Text style={s.body}>Sudah terpakai</Text><Heading>{display(summary.expense)}</Heading><Text style={s.body}>{budget ? (summary.remaining >= 0 ? `Sisa anggaran ${display(summary.remaining)}.` : `Melebihi anggaran ${display(-summary.remaining)}.`) : 'Belum ada batas anggaran.'}</Text></View><Field label="Anggaran bulanan (Rp)" value={budgetInput} onChangeText={setBudgetInput} keyboardType="number-pad" maxLength={10} secureTextEntry={hideAmounts} /><Button onPress={saveBudget}>Simpan contoh anggaran</Button></View>}
      {tab === 'profile' && <View style={{ gap: 18 }}><Heading>Ruang milikmu.</Heading><View style={s.card}><Text style={{ color: c.ink, fontSize: 22, fontWeight: '800' }}>{user.name}</Text><Text style={s.body}>{user.email}</Text><Text style={s.body}>Mulai kebiasaan mencatat pengeluaran kecil setiap hari.</Text></View><Notice>Data yang tampil adalah contoh latihan. Perubahan berlaku selama aplikasi masih terbuka.</Notice><Button secondary onPress={() => setHideAmounts(v => !v)}>{hideAmounts ? 'Tampilkan nominal' : 'Sembunyikan nominal'}</Button><Button secondary onPress={() => { setItems([...demoData.transactions]); setBudget(demoData.budget); setBudgetInput(String(demoData.budget)); setMessage('Data contoh dikembalikan.'); }}>Kembalikan data contoh</Button><Button danger onPress={onExit}>{preview ? 'Kembali ke login' : 'Keluar dari akun'}</Button></View>}
      <Text style={{ color: c.muted, fontSize: 12, textAlign: 'center', lineHeight: 21 }}>Money Track · Mulai dari satu catatan hari ini.</Text>
    </View></ScrollView>
    <View accessibilityRole="tablist" style={s.tabs}>{tabs.map(([key, icon, label]) => <Pressable key={key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: tab === key }} onPress={() => move(key)} style={[s.tab, tab === key && { backgroundColor: c.mint }]}><Text accessible={false} style={{ fontSize: 22, color: tab === key ? c.green : c.muted }}>{icon}</Text><Text style={{ fontSize: 12, lineHeight: 18, fontWeight: '600', textAlign: 'center', color: tab === key ? c.green : c.muted }}>{label}</Text></Pressable>)}</View>
    {formOpen && <AddNoteModal onClose={() => setFormOpen(false)} onSave={item => { setItems(prev => [item, ...prev]); setFormOpen(false); setMessage('Contoh catatan ditambahkan.'); }} />}
  </SafeAreaView>;
}
function Gate() {
  const { user, booting, logout } = useSession(); const [preview, setPreview] = useState(false);
  if (booting) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={c.green} /><Text style={s.body}>Membuka Money Track...</Text></View>;
  if (user) return <MoneyTrack key={user.id} user={user} onExit={logout} />;
  if (preview) return <MoneyTrack user={{ name: 'Teman kampus', email: 'contoh@moneytrack.local' }} preview onExit={() => setPreview(false)} />;
  return <SafeAreaView style={{ flex: 1 }}><AuthScreen onPreview={() => setPreview(true)} /></SafeAreaView>;
}
export default function App() { return <SafeAreaProvider><SessionProvider><Gate /></SessionProvider></SafeAreaProvider>; }
const s = StyleSheet.create({ header: { paddingVertical: 16, flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap', borderBottomWidth: 1, borderColor: c.line }, body: { fontSize: 14, lineHeight: 24, color: c.muted }, card: { backgroundColor: '#fff', borderRadius: 24, padding: 22, gap: 12 }, tabs: { flexDirection: 'row', flexWrap: 'wrap', padding: 7, backgroundColor: '#fff', borderTopWidth: 1, borderColor: c.line, gap: 3 }, tab: { flex: 1, minWidth: 58, minHeight: 58, borderRadius: 14, alignItems: 'center', justifyContent: 'center', padding: 7, gap: 3 } });
