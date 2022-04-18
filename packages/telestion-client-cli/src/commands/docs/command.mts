import { openUrl } from '../../lib/index.mjs';

/**
 * Opens the Telestion Docs.
 */
export async function docs(): Promise<unknown[]> {
	const errors: unknown[] = [];

	await openUrl('https://docs.telestion.wuespace.de/');

	return errors;
}
