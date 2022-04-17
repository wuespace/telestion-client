import { resolve, join, parse } from 'path';
import dirTree, {
	DirectoryElement,
	FileElement,
	TreeElement
} from '@fliegwerk/dir-tree';
import { renderFile } from 'ejs';

import {
	copyFile,
	getDependencies,
	getDevDependencies,
	getLogger,
	getPackagePath,
	mkdir,
	readFile,
	writeFile
} from '../lib/index.mjs';

const logger = getLogger('Template Action');

/**
 * The scraped template information from the {@link getTemplateInformation}.
 */
export interface TemplateInformation {
	/**
	 * An absolute path to the root directory that contains the template source files.
	 */
	templatePath: string;

	/**
	 * An absolute path to the template package directory.
	 */
	templatePackagePath: string;

	/**
	 * A list of production dependencies that the template specifies.
	 */
	dependencies: Record<string, string>;

	/**
	 * A list of development dependencies that the template specifies.
	 */
	devDependencies: Record<string, string>;

	/**
	 * A list of workspace dependencies that should be linked instead of installed via the official registry.
	 */
	workspaceDependencies: string[];
}

/**
 * Describes the replacers that the templating engine receives during template transformation.
 */
export interface TemplateReplacers {
	/**
	 * The normalized name of the new Frontend Project.
	 */
	moduleName: string;

	/**
	 * The pretty Frontend Project name (e.g. provided by the user).
	 */
	projectName: string;

	/**
	 * The stringified production dependencies for the new Frontend Project.
	 */
	dependencies: string;

	/**
	 * The stringified development dependencies for the new Frontend Project.
	 */
	devDependencies: string;
}

/**
 * Specifies the property in the `package.json` which relatively points to the root directory
 * that contains the template files.
 */
export const templateDirProperty = 'templateDir';

/**
 * Extracts dependencies specified with the 'workspace' protocol.
 * @param allDependencies - the dependency object that contains both real and workspace dependencies
 */
function extractWorkspaceDependencies(
	allDependencies: Record<string, string>
): [
	realDependencies: Record<string, string>,
	workspaceDependencies: Array<string>
] {
	const workspaceDependencies: string[] = [];

	const realDependencies = Object.keys(allDependencies).reduce((obj, key) => {
		const value = allDependencies[key];
		if (value.toLowerCase().includes('workspace')) {
			// remove workspace dependency and put it in separate list
			workspaceDependencies.push(key);
		} else {
			// keep current semver spec
			obj[key] = value;
		}
		return obj;
	}, {} as Record<string, string>);

	return [realDependencies, workspaceDependencies];
}

/**
 * Searches a template with the provided template name and returns the scraped {@link TemplateInformation}.
 * @param templateName - the name of the template package
 */
export async function getTemplateInformation(
	templateName: string
): Promise<TemplateInformation> {
	let templatePackagePath: string;
	try {
		templatePackagePath = await getPackagePath(templateName);
		logger.debug('Found template package:', templatePackagePath);
	} catch (err) {
		throw new Error(
			`Cannot resolve template. Try to install it first with: pnpm install --global ${templateName}`
		);
	}

	const packageJsonPath = resolve(templatePackagePath, 'package.json');
	logger.debug('package.json path:', packageJsonPath);
	const packageJson = JSON.parse(await readFile(packageJsonPath)) as Record<
		string,
		unknown
	>;
	logger.debug('Loaded package.json:', packageJson);

	// test property for existence and the right type
	if (!packageJson.hasOwnProperty(templateDirProperty)) {
		throw new Error(
			`The provided template doesn't contain the '${templateDirProperty}' property. Please provide one to continue`
		);
	}

	if (typeof packageJson[templateDirProperty] !== 'string') {
		throw new Error(
			`The '${templateDirProperty}' property exists but has an invalid type: Expected: string, Got: ${typeof packageJson[
				templateDirProperty
			]}`
		);
	}

	const allDependencies = await getDependencies(packageJson);
	const allDevDependencies = await getDevDependencies(packageJson);
	logger.debug('All production dependencies:', allDependencies);
	logger.debug('All development dependencies:', allDevDependencies);

	// handle the pnpm workspace protocol
	// extracts workspace dependencies and links them in the pnpm install stage
	const [dependencies, workspaceDeps] =
		extractWorkspaceDependencies(allDependencies);
	const [devDependencies, workspaceDevDependencies] =
		extractWorkspaceDependencies(allDevDependencies);
	const workspaceDependencies = [...workspaceDevDependencies, ...workspaceDeps];
	logger.debug('Real production dependencies:', dependencies);
	logger.debug('Real development dependencies:', devDependencies);
	logger.debug('Workspace dependencies:', workspaceDependencies);

	return {
		templatePath: resolve(
			templatePackagePath,
			packageJson[templateDirProperty]
		),
		templatePackagePath,
		dependencies,
		devDependencies,
		workspaceDependencies
	};
}

/**
 * Returns a tree of all template files below the provided template path.
 * @param templatePath - the path to the template files
 */
export async function getTemplateDirTree(
	templatePath: string
): Promise<TreeElement> {
	logger.debug('Template path:', templatePath);

	// default exports don't work!
	// @ts-ignore
	return dirTree(templatePath);
}

/**
 * Generates the {@link TemplateReplacers} based on the given information.
 * @param prettyName - the pretty name of the project (e.g. `"Test Project"`)
 * @param moduleName - the npm-package guidelines compatible project name (e.g. `"test-project"`)
 * @param dependencies - an object that contains all production dependencies for the new project
 * @param devDependencies - an object that contains all development dependencies for the new project
 */
export async function getTemplateReplacers(
	prettyName: string,
	moduleName: string,
	dependencies: Record<string, string>,
	devDependencies: Record<string, string>
): Promise<TemplateReplacers> {
	const addIndentation = (stringified: string) =>
		stringified
			.split('\n')
			.map((line, index) => (index > 0 ? `\t${line}` : line)) // the first line is in front of property
			.join('\n');

	return {
		moduleName,
		projectName: prettyName,
		dependencies: addIndentation(JSON.stringify(dependencies, null, '\t')),
		devDependencies: addIndentation(JSON.stringify(devDependencies, null, '\t'))
	};
}

/**
 * Processes a directory node inside the template tree.
 * @param node - the directory node
 * @param targetPath - the output path
 * @param replacers - received replacers
 */
async function processDirectory(
	node: DirectoryElement,
	targetPath: string,
	replacers: TemplateReplacers
): Promise<void> {
	logger.debug(`Process directory '${node.path}' for target '${targetPath}'`);
	await mkdir(targetPath, true);

	await Promise.all(
		node.children.map(async child =>
			processTemplateTree(child, join(targetPath, child.name), replacers)
		)
	);
}

/**
 * Processes a file node inside the template tree.
 * @param node - the file node
 * @param targetPath - the output path
 * @param replacers - received replacers
 */
async function processFile(
	node: FileElement,
	targetPath: string,
	replacers: TemplateReplacers
): Promise<void> {
	logger.debug(`Process file '${node.path}' for target '${targetPath}'`);

	if (node.ext === '.ejs') {
		logger.debug(`File '${node.path}' is an EJS file. Processing it...`);
		const fileInfo = parse(targetPath);
		// remove .ejs extension but preserve the actual extension
		const filePathWithoutExt = join(fileInfo.dir, fileInfo.name);
		logger.debug('Target file path:', filePathWithoutExt);
		await writeFile(filePathWithoutExt, await renderFile(node.path, replacers));
	} else {
		logger.debug(`File '${node.path}' is a normal file. Copy it...`);
		await copyFile(node.path, targetPath);
	}
}

/**
 * Accepts a template tree generated by the {@link getTemplateDirTree} function,
 * transforms every node inside the tree with the help of the provided {@link TemplateReplacers}
 * and writes the output inside the target path directory.
 *
 * @param node - the start node to "template" from
 * @param targetPath - the path that contains the transformed files after the execution
 * @param replacers - replacers that are inserted during transformation
 */
export async function processTemplateTree(
	node: TreeElement,
	targetPath: string,
	replacers: TemplateReplacers
): Promise<void> {
	switch (node.type) {
		case 'directory':
			await processDirectory(node, targetPath, replacers);
			return;
		case 'file':
			await processFile(node, targetPath, replacers);
			return;
		default:
			logger.warn(
				`Reached unsupported node type ${node.type}: Node:`,
				node,
				', target path:',
				targetPath,
				', replacers:',
				replacers
			);
	}
}
