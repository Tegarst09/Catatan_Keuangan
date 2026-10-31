import React, { useRef, useState } from 'react';
import { View, Text, Modal, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Chip, Field, Heading, Notice } from '../weeks/week02/task03-accessibility';
import { CATEGORIES, INCOME_CATEGORIES, localToday, validateTransaction, transactionToDTO } from '../weeks/week04/task01-data-model';
import { colors as c } from '../theme';
export function Overlay({ children, onClose }) {
  return <Modal visible animationType="slide" transparent onRequestClose={onClose} accessibilityViewIsModal><SafeAreaView style={{ flex: 1, backgroundColor: '#172d2ba6', justifyContent: 'center', padding: 14 }}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ maxHeight: '96%', width: '100%', maxWidth: 580, alignSelf: 'center', backgroundColor: c.bg, borderRadius: 24 }}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 22, gap: 12 }}>{children}</ScrollView></KeyboardAvoidingView></SafeAreaView></Modal>;
}
export function TransactionForm({ item, api, onSaved, onClose }) {
  const [type, setType] = useState(item?.type || 'expense'); const [title, setTitle] = useState(item?.title || '');
  const [amount, setAmount] = useState(item?.amount ? String(item.amount) : ''); const [category, setCategory] = useState(item?.category || 'Makan');
  const [date, setDate] = useState(item?.date || localToday()); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const requestKey = useRef(`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
  async function save() {
    const data = { title, amount: /^\d+$/.test(amount) ? Number(amount) : NaN, category, date, type };
    const issue = validateTransaction(data); if (issue) return setError(issue);
    setSaving(true); setError('');
    try {
      await api(item?.id ? `/transactions/${item.id}` : '/transactions', { method: item?.id ? 'PATCH' : 'POST', body: transactionToDTO(data), headers: item?.id ? {} : { 'Idempotency-Key': requestKey.current } });
      await onSaved();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  }
  return <Overlay onClose={() => !saving && onClose()}><Heading>{item?.id ? 'Edit catatan' : 'Tambah catatan'}</Heading><Text style={{ color: c.muted, lineHeight: 23 }}>Nominal dalam rupiah bulat. Tulis angka tanpa titik atau koma.</Text>
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{[['expense', 'Pengeluaran'], ['income', 'Pemasukan']].map(([key, label]) => <Chip key={key} selected={type === key} onPress={() => { setType(key); setCategory(key === 'expense' ? 'Makan' : 'Uang saku'); }}>{label}</Chip>)}</View>
    <Field label="Catatan" placeholder="Contoh: makan siang di kantin" value={title} onChangeText={setTitle} maxLength={80} />
    <Field label="Nominal (Rp)" placeholder="25000" value={amount} onChangeText={setAmount} keyboardType="number-pad" maxLength={10} />
    <Text style={{ color: c.ink, fontWeight: '600' }}>Kategori</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{(type === 'income' ? INCOME_CATEGORIES : CATEGORIES).map(cat => <Chip key={cat} selected={category === cat} onPress={() => setCategory(cat)}>{cat}</Chip>)}</View>
    <Field label="Tanggal (YYYY-MM-DD)" value={date} onChangeText={setDate} autoCapitalize="none" placeholder="2026-10-27" maxLength={10} />
    {!!error && <Notice error>{error}</Notice>}<Button busy={saving} onPress={save}>Simpan catatan</Button><Button secondary disabled={saving} onPress={onClose}>Batal</Button>
  </Overlay>;
}
export function DeleteConfirmation({ item, onConfirm, onClose, busy, error }) {
  return <Overlay onClose={() => !busy && onClose()}><Heading>Hapus catatan ini?</Heading><Text style={{ color: c.muted, lineHeight: 24 }}>{item.title} akan dihapus dari akunmu.</Text>{!!error && <Notice error>{error}</Notice>}<Button danger busy={busy} onPress={onConfirm}>Hapus catatan</Button><Button secondary disabled={busy} onPress={onClose}>Batal</Button></Overlay>;
}
