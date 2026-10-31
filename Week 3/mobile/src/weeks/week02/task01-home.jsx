import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { Button, Heading } from './task03-accessibility';
import { useResponsive } from './task02-responsive';
import { rupiah, summarize } from '../../data/money';
import { TransactionList } from '../../components/TransactionList';
import { colors as c } from '../../theme';
export function HomeScreen({ name, data, onAdd, onHistory, onBudget, hideAmounts, setHideAmounts, readonly }) {
  const { wide, compact } = useResponsive(); const sum = summarize(data.transactions, data.budget);
  const show = amount => hideAmounts ? '••••••' : rupiah(amount);
  return <View style={{ gap: 22 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
      <View style={{ flex: 1, minWidth: 160 }}><Text style={s.eyebrow}>HALO, {name.toUpperCase()}</Text><Heading>Catatan kecil.{ '\n' }Langkah lebih tenang.</Heading></View>
      <Image source={require('../../../assets/icon.png')} style={{ width: 64, height: 64, borderRadius: 20 }} accessibilityLabel="Ilustrasi dompet untuk catatan keuangan mahasiswa" />
    </View>
    <View style={[s.balance, wide && { padding: 30 }]}>
      <Text style={{ color: '#e5f0e7', fontSize: 14, lineHeight: 22 }}>Sisa uang bulan ini</Text>
      <Text style={{ color: '#fff', fontSize: compact ? 30 : 36, fontWeight: '800', marginVertical: 12, flexShrink: 1 }}>{show(sum.balance)}</Text>
      <Text style={{ color: '#e5f0e7', fontSize: 13, lineHeight: 21 }}>Pemasukan dikurangi pengeluaran pada bulan berjalan.</Text>
      <Button secondary style={{ marginTop: 18, alignSelf: 'flex-start' }} onPress={() => setHideAmounts(!hideAmounts)}>{hideAmounts ? 'Tampilkan nominal' : 'Sembunyikan nominal'}</Button>
      <View style={s.metrics}>
        {[['Pemasukan', sum.income, '+'], ['Pengeluaran', sum.expense, '−']].map(([label, amount, symbol]) => <View key={label} style={{ flex: 1, minWidth: 140, gap: 7 }}><Text style={{ color: '#e5f0e7', fontSize: 13 }}>{symbol} {label}</Text><Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{show(amount)}</Text></View>)}
      </View>
    </View>
    <Button onPress={onAdd} hint={readonly ? 'Contoh tampilan hanya dapat dibaca' : 'Membuka form pemasukan atau pengeluaran'}>+ Tambah catatan</Button>
    <View style={{ flexDirection: wide ? 'row' : 'column', gap: 18 }}>
      <View style={[s.card, { flex: 1 }]}><Text style={s.eyebrow}>BATAS BELANJA BULANAN</Text><Heading style={{ fontSize: 22 }}>{sum.budget ? `${sum.percent}% sudah terpakai` : 'Beri batas untuk dirimu'}</Heading>
        {sum.budget > 0 && <><View accessibilityRole="progressbar" accessibilityLabel={`Penggunaan anggaran ${sum.percent} persen`} accessibilityValue={{ min: 0, max: 100, now: Math.min(sum.percent, 100) }} style={s.track}><View style={{ width: `${Math.min(100, sum.percent)}%`, backgroundColor: sum.percent > 100 ? c.red : c.green, height: 9, borderRadius: 8 }} /></View><Text style={s.body}>{sum.remaining >= 0 ? `Sisa anggaran ${show(sum.remaining)}` : `Melebihi anggaran ${show(-sum.remaining)}`}</Text></>}
        <Button secondary onPress={onBudget}>Atur anggaran</Button>
      </View>
      <View style={[s.card, { flex: 1, backgroundColor: c.lime }]}><Text style={s.eyebrow}>KEBIASAAN HARI INI</Text><Heading style={{ fontSize: 22 }}>Satu menit{ '\n' }untuk mencatat.</Heading><Text style={s.body}>Catat belanja setelah membayar. Pengeluaran kecil lebih mudah terlihat saat kamu menuliskannya.</Text><Text style={{ color: c.ink, fontSize: 28 }}>↗</Text></View>
    </View>
    <View style={{ gap: 14 }}><Heading style={{ fontSize: 21 }}>Pengeluaran per kategori</Heading>
      {!sum.byCategory.length && <Text style={s.body}>Belum ada pengeluaran untuk dibandingkan.</Text>}
      {sum.byCategory.map((item, i) => <View key={item.category} style={{ gap: 7 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}><Text style={s.body}>{item.category}</Text><Text style={s.body}>{show(item.total)} ({Math.round(item.total / sum.expense * 100)}%)</Text></View><View style={s.track}><View style={{ backgroundColor: [c.green, c.blue, c.ink, '#8c4d21'][i % 4], width: `${item.total / sum.expense * 100}%`, height: 9, borderRadius: 8 }} /></View></View>)}
    </View>
    <Heading style={{ fontSize: 21 }}>Catatan terakhir</Heading>
    <TransactionList items={data.transactions.slice(0, 3)} readonly hideAmounts={hideAmounts} />
    <Button secondary onPress={onHistory}>Lihat semua transaksi</Button>
  </View>;
}
const s = StyleSheet.create({ eyebrow: { color: c.green, fontSize: 11, lineHeight: 18, letterSpacing: 1, fontWeight: '800', marginBottom: 7 }, balance: { backgroundColor: c.ink, padding: 22, borderRadius: 28 }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, paddingTop: 22, marginTop: 22, borderTopWidth: 1, borderColor: '#58766d' }, card: { borderRadius: 24, backgroundColor: '#fff', borderWidth: 1, borderColor: c.line, padding: 22, gap: 14 }, track: { width: '100%', height: 9, backgroundColor: c.line, borderRadius: 8, overflow: 'hidden' }, body: { color: c.muted, fontSize: 14, lineHeight: 23 } });
