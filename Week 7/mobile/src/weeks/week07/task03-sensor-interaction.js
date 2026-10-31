import { useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { isShake } from './motion';
export function useShakeInteraction(sample, enabled, onShake) {
  const lastTriggered = useRef(-Infinity); const [lastEvent, setLastEvent] = useState(null); const callback = useRef(onShake); callback.current = onShake;
  useEffect(() => {
    if (!enabled || !sample) return;
    const now = Date.now();
    if (isShake(sample, now, lastTriggered.current)) {
      lastTriggered.current = now; setLastEvent(new Date(now).toLocaleTimeString('id-ID'));
      Vibration.vibrate(160); callback.current?.();
    }
  }, [sample, enabled]);
  return lastEvent;
}
