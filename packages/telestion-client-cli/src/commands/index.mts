import { CommandBuilder } from '../model/commands.mjs';
import { initCommandBuilder } from './init/index.mjs';
import { docsCommandBuilder } from './docs/index.mjs';
import { statsCommandBuilder } from './stats/index.mjs';
import { startCommandBuilder } from './start/index.mjs';
import { buildCommandBuilder } from './build/index.mjs';

export const commandBuilders: CommandBuilder[] = [
	initCommandBuilder,
	docsCommandBuilder,
	statsCommandBuilder,
	startCommandBuilder,
	buildCommandBuilder
];

export * from './init/index.mjs';
export * from './docs/index.mjs';
export * from './stats/index.mjs';
export * from './start/index.mjs';
export * from './build/index.mjs';
