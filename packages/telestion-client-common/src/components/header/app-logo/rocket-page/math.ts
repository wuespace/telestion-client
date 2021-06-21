/**
 * A simple vector type.
 */
export type Vector = number[];

/**
 * Result of multiplying components of vec by scalar.
 * @param vec - the vector to scale
 * @param scalar - the scale factor
 *
 * @example
 * ```ts
 * console.log(scale([0, 1, 2], 3)); // [0, 3, 6]
 * console.log(scale([2, 4], 4)); // [8, 16]
 * console.log(scale([0, 0.5, 1, 2.5], 2.5)); // [0, 1.25, 2.5, 6.25]
 * ```
 */
export function scale(vec: Vector, scalar: number): Vector {
	return vec.map(elem => elem * scalar);
}

/**
 * Euclidean distance between vec1 and vec2.
 * @param vec1 - the first vector
 * @param vec2 - the second vector
 *
 * @throws Error - if vectors have different sizes
 *
 * @example
 * ```tsx
 * const vec1: Vector = [0, 1, 2];
 * const vec2: Vector = [1, 2, 3];
 *
 * console.log(distance(vec1, vec2)); // 1.730508...
 * ```
 */
export function distance(vec1: Vector, vec2: Vector): number {
	if (vec1.length !== vec2.length)
		throw new Error('Vectors have different sizes');

	return Math.sqrt(
		vec1.reduce((acc, elem, index) => acc + (elem - vec2[index]) ** 2, 0)
	);
}
