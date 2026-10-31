import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Field, Heading, Notice } from '../week02/task03-accessibility';
import { useResponsive } from '../week02/task02-responsive';
import { validateCredentials } from './task03-security-validation';
import { useSession } from '../week05/task03-session';
import { colors as c } from '../../theme';
export function AuthScreen({ onPreview }) {
  const { signIn, notice, restore } = useSession(); const { wide, padding } = useResponsive();
  const [registering, setRegistering] = useState(false); const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const set = key => value => setForm(prev => ({ ...prev, [key]: value }));
  async function submit() {
    const issue = validateCredentials(form, registering); if (issue) return setError(issue);
    setBusy(true); setError('');
    try { await signIn({ email: form.email.trim().toLowerCase(), password: form.password, ...(registering ? { name: form.name.trim() } : {}) }, registering); }
    catch (e) { setError(e.message || 'Belum dapat masuk. Silakan coba lagi.'); }
    finally { setBusy(false); setForm(prev => ({ ...prev, password: '', confirmPassword: '' })); }
  }
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, padding, justifyContent: 'center' }}>
    <View style={[s.shell, wide && { flexDirection: 'row', padding: 40, gap: 48 }]}>
      <View style={{ flex: 1, gap: 18 }}>
        <View style={s.brand}><Image source={require('../../../assets/icon.png')} accessibilityLabel="Logo dompet Money Track" style={{ width: 46, height: 46, borderRadius: 12 }} /><Text style={s.brandText}>Money Track</Text></View>
        <Text style={s.tag}>BUAT HARI KULIAHMU</Text>
        <Heading style={{ fontSize: wide ? 42 : 34, lineHeight: wide ? 50 : 42 }}>Uangmu, lebih{ '\n' }terarah.</Heading>
        <Text style={s.body}>Uang saku sering habis tanpa terasa? Mulai dari satu catatan kecil setiap hari.</Text>
        <View style={s.illustration} accessibilityLabel="Ilustrasi catatan uang saku mahasiswa">
          <Text style={{ color: c.green, fontWeight: '700' }}>CATAT. PAHAMI. ATUR.</Text>
          <Text style={{ color: c.ink, fontSize: 27, fontWeight: '800', marginVertical: 12 }}>Rencana kecil,{ '\n' }lebih tenang.</Text>
          <Text style={s.body}>Pantau pengeluaranmu dan tentukan batas belanja bulanan.</Text>
        </View>
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <Heading>{registering ? 'Mulai catatanmu' : 'Selamat datang kembali'}</Heading>
        <Text style={[s.body, { marginBottom: 18 }]}>{registering ? 'Buat akun untuk menyimpan catatan milikmu.' : 'Masuk untuk melanjutkan catatan keuanganmu.'}</Text>
        {!!notice && <><Notice>{notice}</Notice><Button secondary onPress={restore}>Coba pulihkan sesi</Button></>}
        {registering && <Field label="Nama" value={form.name} onChangeText={set('name')} autoComplete="name" maxLength={60} />}
        <Field label="Email" value={form.email} onChangeText={set('email')} autoCapitalize="none" autoComplete="email" keyboardType="email-address" maxLength={254} placeholder="nama@kampus.ac.id" />
        <Field label="Password" value={form.password} onChangeText={set('password')} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} autoComplete={registering ? 'new-password' : 'current-password'} maxLength={128} placeholder="Minimal 8 karakter" />
        <Button secondary onPress={() => setShowPassword(v => !v)} label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? 'Sembunyikan password' : 'Tampilkan password'}</Button>
        {registering && <Field style={{ marginTop: 12 }} label="Konfirmasi password" value={form.confirmPassword} onChangeText={set('confirmPassword')} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} maxLength={128} />}
        {!!error && <Notice error>{error}</Notice>}
        <Button style={{ marginTop: 12 }} onPress={submit} busy={busy}>{registering ? 'Daftar & mulai' : 'Masuk'}</Button>
        <Button secondary disabled={busy} onPress={() => { setRegistering(v => !v); setError(''); setShowPassword(false); setForm({ name: '', email: '', password: '', confirmPassword: '' }); }}>{registering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}</Button>
        <Button secondary onPress={onPreview} disabled={busy} hint="Membuka contoh dengan data fiktif tanpa login">Lihat contoh tampilan</Button>
        <Text style={[s.body, { fontSize: 12, textAlign: 'center', marginTop: 8 }]}>Password tidak disimpan di perangkat.{Platform.OS === 'web' ? ' Pratinjau web menyimpan sesi di memori hingga halaman ditutup.' : ''}</Text>
      </View>
    </View>
  </ScrollView></KeyboardAvoidingView>;
}
const s = StyleSheet.create({ shell: { width: '100%', maxWidth: 1080, alignSelf: 'center', padding: 20, borderRadius: 28, backgroundColor: '#fff', gap: 28 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }, brandText: { color: c.ink, fontSize: 23, fontWeight: '800' }, tag: { color: c.green, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }, body: { color: c.muted, fontSize: 15, lineHeight: 24 }, illustration: { backgroundColor: c.mint, padding: 24, borderRadius: 24 } });
