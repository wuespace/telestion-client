import { Logger, ChalkLogger, ComponentLogger } from '@fliegwerk/logsemts';
import chalk from 'chalk';
import { LevelLogger } from './level-logger.mjs';

const logger = new Logger({
	// @ts-ignore
	loggers: [LevelLogger(ChalkLogger(chalk), 'warn')]
});

/**
 * Returns a logger interface for the specified component.
 * @param componentName - the name of the component
 */
export function getLogger(componentName: string): ComponentLogger {
	return logger.getComponentLogger(componentName);
}
