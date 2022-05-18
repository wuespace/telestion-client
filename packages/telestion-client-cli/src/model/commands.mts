// @ts-ignore
import { Command } from 'commander';
import { LogLevel } from '../lib/index.mjs';

export interface BaseOptions {
	loglevel: LogLevel;

	workingDir: string;
}

export type BaseWithPartial<T extends BaseOptions> = Omit<
	Partial<T>,
	keyof BaseOptions
> &
	BaseOptions;

export type CommandBuilder = (command: Command) => void;
