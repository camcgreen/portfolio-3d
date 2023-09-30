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
