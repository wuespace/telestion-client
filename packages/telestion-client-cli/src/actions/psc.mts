import { join, resolve } from 'path';
import { exists, getLogger, readDir, readFile, stat } from '../lib/index.mjs';

const logger = getLogger('PSC Action');

/**
 * Checks, if the given project directory is a PSC root.
 * @param projectDir - path to a possible PSC root
 */
export async function isPSCRoot(projectDir: string): Promise<boolean> {
	return (
		(await exists(join(projectDir, 'package.json'))) &&
		(await exists(join(projectDir, 'src', 'widgets')))
	);
}

/**
 * Searches the PSC root up from the working directory.
 * If no PSC is found, it returns `null`.
 * @param workingDir - the current working directory to check
 */
export async function getPSCRoot(workingDir: string): Promise<string> {
	// remove dangling relative paths
	const searchDir = resolve(workingDir);
	logger.debug('Search directory:', searchDir);
	// return if this is a PSC root
	if (await isPSCRoot(searchDir)) {
		logger.debug('Resolved PSC root:', searchDir);
		return searchDir;
	}

	// search higher up in the tree
	const nextSearchDir = resolve(searchDir, '..');
	logger.debug('Next search directory:', nextSearchDir);
	// we've reached the top
	if (searchDir === nextSearchDir) {
		throw new Error('Not in a Telestion Frontend Project');
	}

	// recursively search next
	return getPSCRoot(nextSearchDir);
}

/**
 * Returns `true` if the widget is installed in the PSC.
 * @param projectDir - path to the root directory of the PSC
 * @param widgetName - the widget name to test
 */
export async function isWidget(
	projectDir: string,
	widgetName: string
): Promise<boolean> {
	const widgetPath = join(projectDir, 'src', 'widgets', widgetName);
	logger.debug('Check widget path:', widgetPath);

	if (!(await stat(widgetPath)).isDirectory()) {
		// widget is not a directory
		return false;
	}

	const widgetIndexPath = join(widgetPath, 'index.ts');
	logger.debug('Widget index.ts path:', widgetIndexPath);
	if (!(await exists(widgetIndexPath))) {
		// index.ts doesn't exist
		return false;
	}
	if (!(await stat(widgetIndexPath)).isFile()) {
		// index.ts isn't a file
		return false;
	}

	const widgetIndex = await readFile(widgetIndexPath);
	logger.debug(`Widget '${widgetName}' index.ts:`, widgetIndex);

	// TODO: Better check
	return widgetIndex.includes('export const widget:');
}

/**
 * Returns a list of installed widgets in the PSC.
 * @param projectDir - the root directory of the PSC
 */
export async function getWidgets(projectDir: string): Promise<string[]> {
	if (!(await isPSCRoot(projectDir))) {
		throw new Error(`The directory '${projectDir}' is not a PSC root`);
	}

	const widgetsDir = join(projectDir, 'src', 'widgets');
	logger.debug('Widget directory:', widgetsDir);
	if (!(await exists(widgetsDir))) {
		throw new Error(
			`/src/widgets does not exist in the project '${projectDir}'`
		);
	}
	if (!(await stat(widgetsDir)).isDirectory()) {
		throw new Error(
			`/src/widgets is not a directory in the project '${projectDir}'`
		);
	}

	const possibleWidgets = await readDir(widgetsDir);
	logger.debug('Found possible widgets:', possibleWidgets);

	const isWidgetArr = await Promise.all(
		possibleWidgets.map(widget => isWidget(projectDir, widget))
	);
	logger.debug('List of is widget state of all possible widgets:', isWidgetArr);

	const widgets = possibleWidgets.filter((widget, index) => isWidgetArr[index]);
	logger.debug('Real widgets:', widgets);

	return widgets;
}

/**
 * Reads, parses and returns the `package.json` for the specified project.
 * @param projectDir - path to the project root
 */
export async function getPackageJson(
	projectDir: string
): Promise<Record<string, unknown>> {
	logger.debug('Parse package.json for project:', projectDir);

	const packageJson = JSON.parse(
		await readFile(join(projectDir, 'package.json'))
	) as Record<string, unknown>;
	logger.debug('PSC package.json:', packageJson);
	return packageJson;
}
