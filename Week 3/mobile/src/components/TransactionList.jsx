import React from 'react';
import { View, Text } from 'react-native';
import { colors as c } from '../theme';
import { rupiah } from '../data/money';
export function TransactionList({ items, hideAmounts = false }) {
  if (!items.length) return <Text style={{ color: c.muted, lineHeight: 24 }}>Belum ada transaksi yang sesuai dengan pilihanmu.</Text>;
  return <View style={{ gap: 12 }}>{items.map(item => <View key={item.id} style={{ padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: c.line, flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <View style={{ flex: 1, minWidth: 120, gap: 4 }}><Text style={{ color: c.ink, fontSize: 16, lineHeight: 24, fontWeight: '700' }}>{item.title}</Text><Text style={{ color: c.muted, fontSize: 13, lineHeight: 21 }}>{item.category} · {item.date}</Text></View>
    <View style={{ alignItems: 'flex-end', gap: 4 }}><Text style={{ color: item.type === 'income' ? c.green : c.red, fontSize: 17, fontWeight: '800' }}>{hideAmounts ? '••••••' : `${item.type === 'income' ? '+' : '−'}${rupiah(item.amount)}`}</Text><Text style={{ color: c.muted, fontSize: 13 }}>{item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</Text></View>
  </View>)}</View>;
}
