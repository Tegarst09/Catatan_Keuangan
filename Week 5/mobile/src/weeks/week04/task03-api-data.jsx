import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useCallback } from 'react';
import { Button, Notice } from '../week02/task03-accessibility';
import { useRemoteResource } from '../../core/use-resource';
import { transactionFromDTO, rupiah } from './task01-data-model';
import { TEST_SCENARIO } from '../../config';
import { colors as c } from '../../theme';
export function useMoneyData(api, month, offline, userId) {
  const load = useCallback(async signal => {
    const query = `?month=${encodeURIComponent(month)}${TEST_SCENARIO ? `&scenario=${encodeURIComponent(TEST_SCENARIO)}` : ''}`;
    const [transactions, budget] = await Promise.all([api(`/transactions${query}`, { signal }), api(`/budget?month=${encodeURIComponent(month)}`, { signal })]);
    if (!Array.isArray(transactions.data) || !Number.isSafeInteger(budget.amount_rupiah) || budget.amount_rupiah < 0) throw new Error('Format data dari server tidak sesuai.');
    return { transactions: transactions.data.map(transactionFromDTO), budget: budget.amount_rupiah };
  }, [api, month]);
  return useRemoteResource(load, { offline, enabled: !!userId, scopeKey: userId });
}
export function ResourceStatus({ resource }) {
  if (resource.status === 'loading' || resource.status === 'idle') return <View style={s.state} accessibilityLiveRegion="polite"><ActivityIndicator size="large" color={c.green} /><Text style={s.body}>Memuat catatanmu...</Text></View>;
  if (['error', 'offline'].includes(resource.status)) return <View style={s.state}><Text style={s.title}>{resource.status === 'offline' ? 'Koneksi sedang terputus' : 'Catatan belum berhasil dimuat'}</Text><Notice error>{resource.error?.message}</Notice><Button onPress={resource.retry}>Coba lagi</Button></View>;
  return null;
}
export function TransactionList({ items, onEdit, onDelete, readonly = false, hideAmounts = false }) {
  if (!items.length) return <View style={s.state}><Text style={s.title}>Mulai dari catatan pertamamu</Text><Text style={s.body}>Belum ada transaksi pada bulan ini. Catat pemasukan atau pengeluaran melalui tombol Tambah catatan.</Text></View>;
  return <View style={{ gap: 12 }}>{items.map(item => <View key={item.id} style={s.row}>
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <View style={{ flex: 1, minWidth: 120 }}><Text style={s.title}>{item.title}</Text><Text style={s.body}>{item.category} · {item.date}</Text></View>
      <View style={{ alignItems: 'flex-end' }}><Text style={{ color: item.type === 'income' ? c.green : c.red, fontWeight: '800', fontSize: 17 }}>{hideAmounts ? '••••••' : `${item.type === 'income' ? '+' : '−'}${rupiah(item.amount)}`}</Text><Text style={s.body}>{item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</Text></View>
    </View>
    {!readonly && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}><Button secondary label={`Edit catatan ${item.title}`} onPress={() => onEdit(item)}>Edit</Button><Button secondary danger label={`Hapus catatan ${item.title}`} onPress={() => onDelete(item)}>Hapus</Button></View>}
  </View>)}</View>;
}
const s = StyleSheet.create({ row: { backgroundColor: '#fff', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: c.line }, title: { color: c.ink, fontSize: 16, fontWeight: '700', lineHeight: 24 }, body: { color: c.muted, fontSize: 13, lineHeight: 21 }, state: { padding: 24, borderRadius: 22, backgroundColor: '#fff', gap: 14, alignItems: 'stretch' } });
