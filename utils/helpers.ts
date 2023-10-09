/**
 * Calculate positions for items along the circumference of an ellipse (modified semi-circle).
 *
 * @param {number} radius - The radius of the base semi-circle before modifications.
 * @param {number} itemCount - The total number of items.
 * @returns {Array<[number, number, number]>} An array of [x, y, z] positions for each item.
 */
export function positionsOnEllipse(
  radius: number,
  itemCount: number
): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = []

  const deltaTheta = Math.PI / (itemCount - 1)

  for (let i = 0; i < itemCount; i++) {
    const theta = -Math.PI / 2 + i * deltaTheta
    const x = 0
    const y = radius * Math.sin(theta)
    const z = -radius * Math.cos(theta)

    positions.push([x, y, z])
  }

  return positions
}

// Clamp number between two values with the following line:
export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)

export const pixelToSceneUnits = (
  canvasWidth: number,
  canvasHeight: number,
  camera: THREE.PerspectiveCamera,
  z: number
) => {
  // Calculate the height of the camera's frustum at distance z
  const vFov = camera.fov * (Math.PI / 180) // Convert fov to radians
  const heightAtZ = 2 * Math.tan(vFov / 2) * z

  // Use the aspect ratio to get the width at distance z
  const widthAtZ = heightAtZ * camera.aspect

  // The width of a single pixel in Three.js units
  const pixelWidth = widthAtZ / canvasWidth
  const pixelHeight = heightAtZ / canvasHeight

  return { pixelWidth, pixelHeight }
}
