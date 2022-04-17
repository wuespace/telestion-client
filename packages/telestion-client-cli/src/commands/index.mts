import { build as buildInit } from './init/index.mjs';
import { CommandBuilder } from '../model/commands.mjs';

export const builders: CommandBuilder[] = [buildInit];
