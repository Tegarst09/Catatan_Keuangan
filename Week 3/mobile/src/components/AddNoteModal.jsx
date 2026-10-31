import React, { useState } from 'react';
import { Modal, View, ScrollView, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Chip, Field, Heading, Notice } from '../weeks/week02/task03-accessibility';
import { CATEGORIES, today } from '../data/money';
import { colors as c } from '../theme';
export function AddNoteModal({ onClose, onSave }) {
  const [title, setTitle] = useState(''); const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); const [category, setCategory] = useState('Makan'); const [error, setError] = useState('');
  const save = () => {
    const number = /^\d+$/.test(amount) ? Number(amount) : NaN;
    if (title.trim().length < 2) return setError('Isi catatan dengan minimal 2 karakter.');
    if (!Number.isSafeInteger(number) || number < 1 || number > 1000000000) return setError('Isi rupiah bulat antara 1 dan 1.000.000.000, tanpa titik atau koma.');
    onSave({ id: `note-${Date.now()}-${Math.random().toString(36).slice(2)}`, title: title.trim(), amount: number, type, category, date: today() });
  };
  return <Modal visible transparent animationType="slide" onRequestClose={onClose} accessibilityViewIsModal><SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#172d2ba6', padding: 14 }}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ backgroundColor: c.bg, maxHeight: '94%', width: '100%', maxWidth: 560, alignSelf: 'center', borderRadius: 24 }}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 22, gap: 14 }}>
    <Heading>Tambah catatan</Heading><Text style={{ color: c.muted, lineHeight: 23 }}>Coba catat pemasukan atau pengeluaranmu. Isian ini dipakai untuk demo tampilan.</Text>
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{[['expense', 'Pengeluaran'], ['income', 'Pemasukan']].map(([key, label]) => <Chip key={key} selected={type === key} onPress={() => { setType(key); setCategory(key === 'expense' ? 'Makan' : 'Uang saku'); }}>{label}</Chip>)}</View>
    <Field label="Catatan" value={title} onChangeText={setTitle} placeholder="Contoh: makan siang" maxLength={80} />
    <Field label="Nominal (Rp)" value={amount} onChangeText={setAmount} placeholder="25000" keyboardType="number-pad" maxLength={10} />
    <Text style={{ color: c.ink, fontWeight: '600' }}>Kategori</Text><View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{(type === 'expense' ? CATEGORIES : ['Uang saku', 'Beasiswa', 'Kerja sampingan', 'Lainnya']).map(item => <Chip key={item} selected={category === item} onPress={() => setCategory(item)}>{item}</Chip>)}</View>
    {!!error && <Notice error>{error}</Notice>}<Button onPress={save}>Simpan contoh catatan</Button><Button secondary onPress={onClose}>Batal</Button>
  </ScrollView></KeyboardAvoidingView></SafeAreaView></Modal>;
}
