import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionProvider, useSession } from './src/weeks/week05/task03-session';
import { AuthScreen } from './src/weeks/week03/task01-auth-flow';
import { HomeScreen } from './src/weeks/week02/task01-home';
import { useResponsive } from './src/weeks/week02/task02-responsive';
import { Button, Chip, Heading, Notice } from './src/weeks/week02/task03-accessibility';
import { localToday, shiftMonth, validMonth } from './src/weeks/week04/task01-data-model';
import { useMoneyData, ResourceStatus, TransactionList } from './src/weeks/week04/task03-api-data';
import { useOffline } from './src/weeks/week06/task03-offline';
import { SensorScreen } from './src/weeks/week07/task02-sensor-data';
import { TransactionForm, DeleteConfirmation } from './src/components/TransactionForm';
import { BudgetScreen } from './src/components/BudgetScreen';
import { demoData } from './src/demo';
import { colors as c } from './src/theme';
const tabs = [['home', '◉', 'Ringkasan'], ['transactions', '≡', 'Transaksi'], ['budget', '▤', 'Anggaran'], ['sensor', '⌁', 'Sensor'], ['account', '☺', 'Akun']];
function MoneyShell({ user, resource, api, month, setMonth, readonly = false, onExit }) {
  const [tab, setTab] = useState('home'); const [form, setForm] = useState(null); const [deleteItem, setDeleteItem] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false); const [deleteError, setDeleteError] = useState('');
  const [filter, setFilter] = useState('all'); const [notice, setNotice] = useState(''); const [hideAmounts, setHide] = useState(false);
  const { padding, wide, compact } = useResponsive();
  useEffect(() => { AsyncStorage.getItem('moneytrack.hide-balance').then(value => { if (value !== null) setHide(value === 'true'); }).catch(() => {}); }, []);
  const setHideAmounts = value => { setHide(value); AsyncStorage.setItem('moneytrack.hide-balance', String(value)).catch(() => {}); };
  const add = useCallback(() => { if (readonly) { setNotice('Ini contoh dengan data fiktif. Masuk atau daftar untuk menyimpan catatanmu sendiri.'); return; } setForm({}); }, [readonly]);
  const ready = ['success', 'empty'].includes(resource.status); const data = resource.data;
  async function remove() {
    setDeleteBusy(true); setDeleteError('');
    try { await api(`/transactions/${deleteItem.id}`, { method: 'DELETE' }); setDeleteItem(null); await resource.retry(); setNotice('Catatan dihapus.'); }
    catch (e) { setDeleteError(e.message); } finally { setDeleteBusy(false); }
  }
  const changeMonth = offset => { const next = shiftMonth(month, offset); if (validMonth(next)) { setMonth(next); setNotice(''); } };
  return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top', 'left', 'right', 'bottom']}>
    <StatusBar barStyle="dark-content" backgroundColor={c.bg} />
    <View style={[s.header, { paddingHorizontal: padding }]}><View style={{ flexDirection: 'row', gap: 9, alignItems: 'center', flex: 1 }}><Image source={require('./assets/icon.png')} accessible={false} style={{ height: 32, width: 32, borderRadius: 10 }} /><Text style={{ color: c.ink, fontWeight: '800', fontSize: compact ? 18 : 21 }}>Money Track</Text></View><View style={s.badge}><Text style={{ color: c.green, fontSize: 11, fontWeight: '700' }}>MAHASISWA</Text></View></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding, paddingBottom: 30 }}>
      <View style={{ maxWidth: 1040, width: '100%', alignSelf: 'center', gap: 18 }}>
        {readonly && <Notice>Mode contoh · data fiktif, tidak terhubung ke akun.</Notice>}
        {!!notice && <Notice>{notice}</Notice>}
        {['home', 'transactions', 'budget'].includes(tab) && <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ color: c.muted, fontSize: 14, fontWeight: '700' }}>BULAN {month}</Text><View style={{ flexDirection: 'row', gap: 8 }}><Button secondary onPress={() => changeMonth(-1)} label="Bulan sebelumnya">‹</Button><Button secondary onPress={() => changeMonth(1)} label="Bulan berikutnya">›</Button>{!readonly && <Button secondary onPress={resource.retry} label="Muat ulang data">↻</Button>}</View></View>}
        {['home', 'transactions', 'budget'].includes(tab) && !ready && <ResourceStatus resource={resource} />}
        {tab === 'home' && ready && <HomeScreen name={user.name} data={data} onAdd={add} onHistory={() => setTab('transactions')} onBudget={() => setTab('budget')} hideAmounts={hideAmounts} setHideAmounts={setHideAmounts} readonly={readonly} />}
        {tab === 'transactions' && ready && <View style={{ gap: 18 }}><Heading>Ke mana uangmu pergi?</Heading><Text style={s.body}>Lihat setiap pemasukan dan pengeluaran pada bulan ini.</Text><Button onPress={add}>+ Tambah catatan</Button><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{[['all', 'Semua'], ['income', 'Pemasukan'], ['expense', 'Pengeluaran']].map(([key, label]) => <Chip key={key} selected={filter === key} onPress={() => setFilter(key)}>{label}</Chip>)}</View><TransactionList items={data.transactions.filter(x => filter === 'all' || x.type === filter)} onEdit={setForm} onDelete={item => { setDeleteError(''); setDeleteItem(item); }} hideAmounts={hideAmounts} readonly={readonly} /></View>}
        {tab === 'budget' && ready && <BudgetScreen data={data} month={month} api={api} refresh={async () => { await resource.retry(); setNotice('Anggaran tersimpan.'); }} readonly={readonly} hideAmounts={hideAmounts} />}
        {tab === 'sensor' && <SensorScreen onQuickExpense={add} interactionAllowed={!form} />}
        {tab === 'account' && <View style={{ gap: 20 }}><Heading>Ruang milikmu.</Heading><View style={s.card}><Text style={{ color: c.ink, fontSize: 23, fontWeight: '800' }}>{user.name}</Text><Text style={s.body}>{user.email}</Text><Text style={s.body}>{readonly ? 'Ini akun contoh. Data yang tampil hanya untuk melihat fitur.' : 'Catat rutinitasmu, atur anggaranmu, lalu evaluasi pelan-pelan.'}</Text></View><Button secondary onPress={() => setHideAmounts(!hideAmounts)}>{hideAmounts ? 'Tampilkan nominal keuangan' : 'Sembunyikan nominal keuangan'}</Button><Button danger onPress={onExit}>{readonly ? 'Kembali ke login' : 'Keluar dari akun'}</Button></View>}
        <Text style={{ color: c.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 12 }}>Money Track · Mulai dari satu catatan hari ini.</Text>
      </View>
    </ScrollView>
    <View accessibilityRole="tablist" style={[s.tabs, { paddingHorizontal: wide ? 24 : 4 }]}>{tabs.map(([key, icon, title]) => <Pressable key={key} accessibilityRole="tab" accessibilityLabel={title} accessibilityState={{ selected: tab === key }} onPress={() => { setTab(key); setNotice(''); }} style={[s.tab, tab === key && { backgroundColor: c.mint }]}><Text accessible={false} style={{ fontSize: 22, color: tab === key ? c.green : c.muted }}>{icon}</Text><Text style={{ fontSize: compact ? 10 : 11, lineHeight: 17, textAlign: 'center', color: tab === key ? c.green : c.muted, fontWeight: '600' }}>{title}</Text></Pressable>)}</View>
    {form && <TransactionForm item={form} api={api} onClose={() => setForm(null)} onSaved={async () => { setForm(null); await resource.retry(); setNotice('Catatan tersimpan.'); }} />}
    {deleteItem && <DeleteConfirmation item={deleteItem} onClose={() => setDeleteItem(null)} onConfirm={remove} busy={deleteBusy} error={deleteError} />}
  </SafeAreaView>;
}
function LiveMoney() {
  const { user, api, logout } = useSession(); const [month, setMonth] = useState(localToday().slice(0, 7)); const offline = useOffline();
  const resource = useMoneyData(api, month, offline, user.id);
  return <MoneyShell {...{ user, resource, api, month, setMonth }} onExit={logout} />;
}
function GuestMoney({ onExit }) {
  const [month, setMonth] = useState(localToday().slice(0, 7)); const transactions = demoData.transactions.filter(x => x.date.startsWith(month)).sort((a, b) => b.date.localeCompare(a.date));
  return <MoneyShell user={{ name: 'Teman kampus', email: 'contoh@moneytrack.local' }} resource={{ status: transactions.length ? 'success' : 'empty', data: { ...demoData, transactions }, retry: async () => {} }} month={month} setMonth={setMonth} readonly onExit={onExit} />;
}
function Gate() {
  const { user, booting } = useSession(); const [preview, setPreview] = useState(false);
  if (booting) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}><ActivityIndicator size="large" color={c.green} /><Text style={s.body}>Membuka Money Track...</Text></View>;
  if (user) return <LiveMoney key={user.id} />;
  if (preview) return <GuestMoney onExit={() => setPreview(false)} />;
  return <SafeAreaView style={{ flex: 1 }}><AuthScreen onPreview={() => setPreview(true)} /></SafeAreaView>;
}
export default function App() { return <SafeAreaProvider><View style={{ flex: 1, backgroundColor: c.bg }}><SessionProvider><Gate /></SessionProvider></View></SafeAreaProvider>; }
const s = StyleSheet.create({ header: { paddingVertical: 16, flexDirection: 'row', gap: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: c.line, flexWrap: 'wrap' }, badge: { padding: 9, borderRadius: 20, backgroundColor: c.mint }, tabs: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', borderTopWidth: 1, borderColor: c.line, paddingVertical: 8, gap: 2, justifyContent: 'space-around' }, tab: { flex: 1, minWidth: 52, maxWidth: 180, minHeight: 58, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 14, paddingHorizontal: 3, paddingVertical: 6 }, card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, gap: 14 }, body: { color: c.muted, fontSize: 14, lineHeight: 24 } });
