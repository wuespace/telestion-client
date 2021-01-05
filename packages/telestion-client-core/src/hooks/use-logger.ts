import { getLogger } from '../lib/logger';

export function useLogger(system: string): ReturnType<typeof getLogger> {
	return getLogger(system);
}
