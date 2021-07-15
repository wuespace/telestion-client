const util = require('util');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const exec = util.promisify(child_process.exec);

async function run() {
	try {
		const gitRoot = (await exec('git rev-parse --show-toplevel')).stdout.trim();
		// path to the hooks folder in git
		const hooksFolder = path.join(gitRoot, '.git', 'hooks');
		// path to the pre-commit hook
		const preCommitPath = path.join(hooksFolder, 'pre-commit');

		// create hooks folder if it doesn't exists
		if (!fs.existsSync(hooksFolder)) {
			fs.mkdirSync(hooksFolder);
		}

		// check if someone already has registered a pre-commit hook
		if (fs.existsSync(preCommitPath)) {
			console.warn(
				'WARN: Someone else has already registered a pre-commit hook. ' +
					'Deleting it to continue...'
			);
			fs.unlinkSync(preCommitPath);
		}

		// relative path used in pre-commit hook
		const relativePath = path
			.relative(gitRoot, path.join(__dirname, '..'))
			.split('\\')
			.join('/');
		const cdPath = relativePath || '.';

		fs.writeFileSync(
			preCommitPath,
			// shebang
			'#!/bin/sh\n' +
				// store current pwd
				'PWD="$(pwd)"\n' +
				// go to client part
				`cd "${cdPath}"\n` +
				// run styling
				'npx pretty-quick --staged\n' +
				// go back to current pwd
				'cd "$PWD"'
		);

		// make pre-commit executable
		fs.chmodSync(preCommitPath, '755');

		console.log('SUCCESS: Pre-commit hook registered at:', preCommitPath);
	} catch (e) {
		console.error('ERROR: Unknown error:', e);
		process.exit(1);
	}
}

run();
