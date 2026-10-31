export const GRAVITY = 9.80665;
export const accelerationMS2 = sample => ({ x: sample.x * GRAVITY, y: sample.y * GRAVITY, z: sample.z * GRAVITY });
export function isShake(sample, now, lastTriggered = -Infinity, { thresholdG = 1.8, cooldownMs = 2000 } = {}) {
  return !!sample && [sample.x, sample.y, sample.z].every(Number.isFinite) && Math.hypot(sample.x, sample.y, sample.z) > thresholdG && now - lastTriggered >= cooldownMs;
}
