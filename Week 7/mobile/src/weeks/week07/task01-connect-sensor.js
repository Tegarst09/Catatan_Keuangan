import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
export function useDeviceSensor() {
  const [sample, setSample] = useState(null); const [gyro, setGyro] = useState(null); const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('idle'); const [message, setMessage] = useState('Sensor belum aktif.');
  const subscriptions = useRef([]); const generation = useRef(0); const lastLog = useRef(0);
  const stop = useCallback(() => {
    generation.current++; subscriptions.current.forEach(sub => sub.remove()); subscriptions.current = [];
    setStatus('idle'); setSample(null); setGyro(null); setHistory([]); setMessage('Sensor berhenti. Aktifkan lagi untuk membaca gerakan.');
  }, []);
  const start = useCallback(async () => {
    stop(); const current = generation.current; setStatus('loading'); setMessage('Memeriksa izin sensor...');
    try {
      const permission = await Accelerometer.requestPermissionsAsync();
      if (current !== generation.current) return;
      if (!permission.granted) { setStatus('denied'); setMessage('Izin gerakan belum diberikan. Izinkan dari pengaturan HP untuk memakai fitur ini.'); return; }
      const available = await Accelerometer.isAvailableAsync();
      if (current !== generation.current) return;
      if (!available) { setStatus('unavailable'); setMessage('Accelerometer tidak tersedia. Gunakan tombol Tambah catatan sebagai alternatif.'); return; }
      Accelerometer.setUpdateInterval(100);
      subscriptions.current.push(Accelerometer.addListener(data => {
        if (current !== generation.current) return;
        const next = { x: data.x, y: data.y, z: data.z, recordedAt: Date.now() };
        setSample(next); setHistory(prev => [...prev.slice(-23), next]);
        if (typeof __DEV__ !== 'undefined' && __DEV__ && Date.now() - lastLog.current > 1000) { console.debug('Accelerometer [g]', { x: data.x.toFixed(2), y: data.y.toFixed(2), z: data.z.toFixed(2) }); lastLog.current = Date.now(); }
      }));
      setStatus('active'); setMessage('Sensor aktif. Nilai diperbarui setiap 100 ms.');
      // Gyroscope menjadi pembanding rotasi, bukan syarat aksi goyang.
      try {
        if (await Gyroscope.isAvailableAsync()) {
          const gyroPermission = await Gyroscope.requestPermissionsAsync();
          if (current !== generation.current) return;
          if (gyroPermission.granted) {
            Gyroscope.setUpdateInterval(100);
            subscriptions.current.push(Gyroscope.addListener(data => { if (current === generation.current) setGyro(data); }));
          }
        }
      } catch { /* Accelerometer tetap dapat dipakai jika gyroscope tidak tersedia. */ }
    } catch { if (current === generation.current) { setStatus('error'); setMessage('Sensor belum dapat diakses. Coba pada HP fisik melalui Expo Go.'); } }
  }, [stop]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => { if (state !== 'active') stop(); });
    return () => { generation.current++; subscriptions.current.forEach(item => item.remove()); subscriptions.current = []; sub.remove(); };
  }, [stop]);
  return { sample, gyro, history, status, message, start, stop };
}
