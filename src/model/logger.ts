import { Logger, BrowserLogger } from '@fliegwerk/logsemts';

const logger = new Logger({
	loggers: [BrowserLogger()]
});

export default logger;
