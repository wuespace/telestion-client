/**
 * Options to configure the Vert.x mock server in the listen process.
 */
export interface ListenOptions {
	/**
	 * The port on which the server listens.
	 *
	 * Defaults to `9870`.
	 */
	port: number;

	/**
	 * The hostname on which the server listens.
	 *
	 * Defaults to `'0.0.0.0'`.
	 */
	hostname: string;
}
