import { Logger, BrowserLogger, ComponentLogger } from '@fliegwerk/logsemts';

const logger = new Logger({
	loggers: [BrowserLogger()]
});

export function getLogger(system: string): ComponentLogger {
	return logger.getComponentLogger(system);
}
