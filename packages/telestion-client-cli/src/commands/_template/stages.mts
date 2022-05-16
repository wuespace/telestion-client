import { TemplateOptions } from './model.mjs';
import * as process from 'process';
import { getLogger } from '../../lib/index.mjs';

const logger = getLogger('Template Stage');

export interface Information {
	someDynamicInformation: string;
}

export async function informationStage(
	options: TemplateOptions
): Promise<Information> {
	return { someDynamicInformation: process.cwd() };
}

export async function processStage(
	options: TemplateOptions,
	infos: Information
): Promise<boolean> {
	logger.debug('Run process stage');
	logger.debug('Received infos:', infos);

	return true; // everything worked fine
}
