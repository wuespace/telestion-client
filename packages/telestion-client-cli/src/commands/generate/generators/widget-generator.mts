import * as path from 'path';
import { camelCase, paramCase, sentenceCase } from 'change-case';
import { GeneratorStrategy } from './generator-strategy.mjs';
import {
	existsSync,
	getLogger,
	mkdir,
	readFile,
	writeFile
} from '../../../lib/index.mjs';

const logger = getLogger('Widget Generator');

/**
 * A generator strategy to generate a widget.
 */
export class WidgetGenerator implements GeneratorStrategy {
	readonly name = 'widget';
	readonly alias = 'w';
	private readonly importInsertMark = '// IMPORT_INSERT_MARK';
	private readonly arrayInsertMark = '// ARRAY_FIRST_ELEMENT_INSERT_MARK';

	async generate(pscPath: string, name: string): Promise<void> {
		const widgetsFolder = path.join(pscPath, 'src', 'widgets');
		this.assertExists(widgetsFolder, 'Widgets folder');

		await this.createWidget(widgetsFolder, name);
		await this.registerWidget(widgetsFolder, name);
	}

	private async createWidget(widgetsFolder: string, name: string) {
		const widgetFolder = path.join(widgetsFolder, paramCase(name));
		this.assertDoesNotExist(widgetFolder, 'Generated widget folder');

		logger.info(`Creating widget ${name}...`);
		await mkdir(widgetFolder, true);
		await this.createWidgetTSX(widgetFolder, name);
		await this.createWidgetIndexTs(widgetFolder, name);
		logger.success(`Created widget ${name} at ${widgetFolder}!`);
	}

	private async createWidgetIndexTs(widgetFolder: string, name: string) {
		const indexFile = path.join(widgetFolder, 'index.ts');
		await writeFile(
			indexFile,
			[
				`import { Widget } from '@wuespace/telestion-client-types';`,
				`import { Widget as WidgetRenderer } from "./widget";`,
				'',
				'export const widget: Widget = {',
				`\tname: '${name}',`,
				`\ttitle: '${sentenceCase(name)}',`,
				`\tversion: '0.0.0',`,
				`\tWidget: WidgetRenderer`,
				`};`,
				``
			].join('\n')
		);
	}

	private async createWidgetTSX(widgetFolder: string, name: string) {
		const widgetFile = path.join(widgetFolder, 'widget.tsx');
		await writeFile(
			widgetFile,
			[
				`import { Heading } from '@adobe/react-spectrum';`,
				'',
				'export function Widget() {',
				`\treturn <Heading level={2}>Hello, ${name}!</Heading>;`,
				'}',
				''
			].join('\n')
		);
	}

	private async registerWidget(widgetsFolder: string, name: string) {
		const indexFile = path.join(widgetsFolder, 'index.ts');
		this.assertExists(indexFile, 'Index file');

		logger.info(`Registering widget ${name}...`);
		await writeFile(
			indexFile,
			this.getWidgetRegistrationCode(await readFile(indexFile), name)
		);
		logger.success(`Registered widget ${name} in ${indexFile}!`);
	}

	private getWidgetRegistrationCode(originalCode: string, name: string) {
		const widgetName = camelCase(name);
		const widgetPath = paramCase(name);
		return originalCode
			.split('\n')
			.flatMap<string>(line => {
				if (line.includes(this.importInsertMark))
					return [
						line.replace(
							this.importInsertMark,
							`import { widget as ${widgetName} } from './${widgetPath}';`
						),
						line
					];
				if (line.includes(this.arrayInsertMark))
					return [line, line.replace(this.arrayInsertMark, `${widgetName},`)];
				return line;
			})
			.join('\n');
	}

	private assertDoesNotExist(path: string, name: string) {
		if (existsSync(path)) {
			throw new Error(`${name} already exists at ${path}`);
		}
	}

	private assertExists(path: string, name: string) {
		if (!existsSync(path)) {
			throw new Error(`${name} does not exist at ${path}`);
		}
	}
}
