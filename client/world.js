// Shared collision rules: the player is a circle on the X/Z plane.
export const PLAYER_RADIUS = 0.28;
export const START = { x: 0, z: 4.7, yaw: 0, pitch: -0.06 };
export const OBSTACLES = [
  { x: -3.7, z: -2.3, w: 2.5, d: 1.5 },
  { x: 3.7, z: -2.3, w: 2.5, d: 1.5 },
  { x: -3.7, z: -0.8, w: 0.75, d: 0.8 },
  { x: 3.7, z: -0.8, w: 0.75, d: 0.8 },
  { x: 0, z: 0, w: 1.5, d: 1.5 },
  { x: -5.1, z: 3.7, w: 0.9, d: 0.9 },
  { x: 5.1, z: 3.7, w: 0.9, d: 0.9 },
  { x: 4.8, z: -4.7, w: 1.5, d: 0.7 }
];
export function canStand(x, z, unlocked = false) {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
  if (Math.abs(x) > 5.65 || z > 5.65 || z < (unlocked && Math.abs(x) < 0.9 ? -7.65 : -5.65)) return false;
  if (z < -5.4 && Math.abs(x) > 0.9) return false;
  return !OBSTACLES.some(o => Math.abs(x - o.x) < o.w / 2 + PLAYER_RADIUS && Math.abs(z - o.z) < o.d / 2 + PLAYER_RADIUS);
}
export function movePlayer(position, dx, dz, unlocked = false) {
  // Short substeps avoid walking through furniture after a slow frame.
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / 0.1));
  let { x, z } = position;
  for (let i = 0; i < steps; i++) {
    if (canStand(x + dx / steps, z, unlocked)) x += dx / steps;
    if (canStand(x, z + dz / steps, unlocked)) z += dz / steps;
  }
  return { x, z };
}
