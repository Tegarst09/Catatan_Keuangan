import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Field, Heading, Notice } from '../weeks/week02/task03-accessibility';
import { rupiah, summarize } from '../weeks/week04/task01-data-model';
import { colors as c } from '../theme';
export function BudgetScreen({ data, month, api, refresh, readonly, hideAmounts = false }) {
  const [value, setValue] = useState(data.budget ? String(data.budget) : ''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { setValue(data.budget ? String(data.budget) : ''); }, [data.budget, month]);
  const sum = summarize(data.transactions, data.budget);
  const show = amount => hideAmounts ? '••••••' : rupiah(amount);
  async function save() {
    setError(''); setMessage(''); if (readonly) return setMessage('Masuk atau daftar untuk mengatur anggaran milikmu.');
    const amount = /^\d+$/.test(value) ? Number(value) : NaN;
    if (!Number.isSafeInteger(amount) || amount < 0 || amount > 1_000_000_000) return setError('Masukkan anggaran bulat antara 0 dan 1.000.000.000 rupiah. Angka 0 menghapus batas anggaran.');
    setBusy(true);
    try { await api('/budget', { method: 'PUT', body: { month, amount_rupiah: amount } }); await refresh(); setMessage('Anggaran tersimpan.'); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <View style={{ gap: 18 }}><Heading>Belanja dengan batas.</Heading><Text style={{ color: c.muted, lineHeight: 24 }}>Tentukan batas pengeluaran untuk bulan {month}. Anggaran ini menjadi pembanding pengeluaran yang kamu catat.</Text>
    <View style={{ backgroundColor: c.mint, borderRadius: 24, padding: 24, gap: 12 }}><Text style={{ color: c.ink }}>Sudah terpakai</Text><Text style={{ fontSize: 28, fontWeight: '800', color: c.ink }}>{show(sum.expense)}</Text><Text style={{ color: c.ink, lineHeight: 23 }}>{sum.budget ? (sum.remaining < 0 ? `Melebihi anggaran sebesar ${show(-sum.remaining)}.` : `Sisa batas belanja ${show(sum.remaining)}.`) : 'Belum ada batas anggaran.'}</Text></View>
    <Field label="Anggaran pengeluaran bulanan (Rp)" value={value} onChangeText={setValue} secureTextEntry={hideAmounts} placeholder="1500000" keyboardType="number-pad" maxLength={10} />
    {!!error && <Notice error>{error}</Notice>}{!!message && <Notice>{message}</Notice>}<Button onPress={save} busy={busy}>Simpan anggaran</Button>
  </View>;
}
