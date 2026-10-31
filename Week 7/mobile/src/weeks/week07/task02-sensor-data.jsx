import React, { useState } from 'react';
import { View, Text, Switch, Linking } from 'react-native';
import { useDeviceSensor } from './task01-connect-sensor';
import { useShakeInteraction } from './task03-sensor-interaction';
import { accelerationMS2 } from './motion';
import { Button, Heading, Notice } from '../week02/task03-accessibility';
import { colors as c } from '../../theme';
export function SensorScreen({ onQuickExpense, interactionAllowed = true }) {
  const sensor = useDeviceSensor(); const [shakeEnabled, setShakeEnabled] = useState(false);
  const lastEvent = useShakeInteraction(sensor.sample, shakeEnabled && interactionAllowed, onQuickExpense);
  const values = sensor.sample ? accelerationMS2(sensor.sample) : null;
  return <View style={{ gap: 18 }}>
    <Text style={{ color: c.green, fontWeight: '700' }}>CATAT LEBIH CEPAT</Text><Heading>Goyang, lalu catat.</Heading>
    <Text style={{ color: c.muted, lineHeight: 24 }}>Aktifkan sensor, lalu izinkan pintasan goyang. Gerakan HP akan membuka form pengeluaran dan memberi getaran singkat. Kamu tetap memeriksa dan menyimpan catatan sendiri.</Text>
    <Notice>{sensor.message}</Notice>
    {sensor.status === 'active' ? <Button secondary onPress={() => { sensor.stop(); setShakeEnabled(false); }}>Hentikan sensor</Button> : <Button busy={sensor.status === 'loading'} onPress={sensor.start}>Aktifkan sensor</Button>}
    {sensor.status === 'denied' && <Button secondary onPress={() => Linking.openSettings()}>Buka pengaturan izin</Button>}
    <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 20, gap: 16 }}>
      <Heading style={{ fontSize: 19 }}>Accelerometer</Heading><Text style={{ color: c.muted }}>Percepatan termasuk gravitasi (m/s²)</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>{['x', 'y', 'z'].map(axis => <View key={axis} style={{ flex: 1, minWidth: 70, backgroundColor: c.mint, padding: 14, borderRadius: 16 }}><Text style={{ color: c.green, fontWeight: '700' }}>{axis.toUpperCase()}</Text><Text style={{ color: c.ink, fontSize: 22, fontWeight: '800', marginTop: 10 }}>{values ? values[axis].toFixed(2) : '—'}</Text></View>)}</View>
      <Text style={{ color: c.muted }}>Data sensor: {sensor.sample ? new Date(sensor.sample.recordedAt).toLocaleTimeString('id-ID') : 'menunggu pembacaan'}</Text>
      <Text style={{ color: c.muted, lineHeight: 23 }}>Gyroscope (rad/s): {sensor.gyro ? ['x', 'y', 'z'].map(axis => `${axis.toUpperCase()} ${sensor.gyro[axis].toFixed(2)}`).join(' · ') : 'belum tersedia'}</Text>
    </View>
    <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 24, gap: 14 }}>
      <Text style={{ color: c.ink, fontSize: 16, fontWeight: '700' }}>Riwayat besar percepatan</Text>
      <View accessible accessibilityLabel="Grafik riwayat besar percepatan, maksimum 24 sampel terakhir" style={{ height: 90, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
        {sensor.history.map((p, i) => <View key={`${p.recordedAt}-${i}`} style={{ flex: 1, height: `${Math.min(100, Math.hypot(p.x, p.y, p.z) / 3 * 100)}%`, minHeight: 2, backgroundColor: c.green, borderRadius: 4 }} />)}
      </View><Text style={{ color: c.muted }}>Sampel terbaru di kanan. Skala 0–3 g, tinggi dibatasi 3 g.</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.mint, padding: 18, borderRadius: 20 }}><Text style={{ flex: 1, color: c.ink, fontSize: 16, fontWeight: '600' }}>Pintasan goyang untuk pengeluaran</Text><Switch accessibilityLabel="Aktifkan pintasan goyang untuk membuka form pengeluaran" value={shakeEnabled} disabled={sensor.status !== 'active'} onValueChange={setShakeEnabled} trackColor={{ false: '#71827b', true: c.green }} /></View>
    {lastEvent && <Notice>Goyang terdeteksi pada {lastEvent}. Form pengeluaran dibuka.</Notice>}
    <Text style={{ color: c.muted, lineHeight: 23 }}>Ambang gerakan 1,8 g, jeda 2 detik per aksi. Sensor berhenti saat kamu meninggalkan halaman atau aplikasi masuk ke latar belakang.</Text>
    <Button secondary onPress={onQuickExpense}>Buka form secara manual</Button>
  </View>;
}
