import logger from '../model/logger';

export default function useLogger(system: string) {
	return logger.getSubsystemLogger(system);
}
