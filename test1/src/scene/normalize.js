import * as THREE from 'three'

// Robustly measure a loaded GLB scene: updates world matrices first (critical for
// GLBs with nested/rotated nodes), then returns size, center, and the longest axis.
export function measure(obj) {
  obj.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(obj)
  const size = new THREE.Vector3(); box.getSize(size)
  const center = new THREE.Vector3(); box.getCenter(center)
  const axes = [size.x, size.y, size.z]
  const longest = axes.indexOf(Math.max(...axes))
  return { box, size, center, longest, longSize: axes[longest] }
}

// Rotation (euler array) that brings the given axis index to vertical (+Y).
export function uprightRotation(longest) {
  if (longest === 0) return [0, 0, Math.PI / 2]   // X -> Y
  if (longest === 2) return [-Math.PI / 2, 0, 0]  // Z -> Y
  return [0, 0, 0]                                 // already Y
}
