import { Logger, PlainLogger, ComponentLogger } from '@fliegwerk/logsemts';

const logger = new Logger({
	loggers: [PlainLogger()]
});

export function getLogger(system: string): ComponentLogger {
	return logger.getComponentLogger(system);
}
