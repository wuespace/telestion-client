import { openUrl } from '../../lib/index.mjs';

/**
 * Opens the Telestion Docs.
 */
export async function runDocsCommand(): Promise<unknown[]> {
	const errors: unknown[] = [];

	await openUrl(new URL('https://docs.telestion.wuespace.de/'));

	return errors;
}
