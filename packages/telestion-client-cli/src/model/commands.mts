// @ts-ignore
import { Command } from 'commander';
import { LogLevel } from '../lib/index.mjs';

/**
 * Every command receives this options by commander by default.
 * Extend this interface if you've added more options to your command.
 */
export interface BaseOptions {
	/**
	 * The current application loglevel.
	 */
	loglevel: LogLevel;

	/**
	 * The application working directory.
	 */
	workingDir: string;
}

/**
 * Receives command options and make all options optional
 * except the base options-
 */
export type BaseWithPartial<T extends BaseOptions> = Omit<
	Partial<T>,
	keyof BaseOptions
> &
	BaseOptions;

/**
 * A command builder receives the parent command
 * and should attach his command, arguments and options on call.
 */
export type CommandBuilder = (command: Command) => void;
