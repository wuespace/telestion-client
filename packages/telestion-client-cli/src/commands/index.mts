import { build as buildInit } from './init/index.mjs';
import { build as buildDocs } from './docs/index.mjs';
import { build as buildStats } from './stats/index.mjs';
import { CommandBuilder } from '../model/commands.mjs';

export const builders: CommandBuilder[] = [buildInit, buildDocs, buildStats];
