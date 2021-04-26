const util = require('util');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const exec = util.promisify(child_process.exec);

async function run() {
	try {
		const gitRoot = (await exec('git rev-parse --show-toplevel')).stdout.trim();
		let hooksFolder = path.join(gitRoot, '.git', 'hooks');

		if (!fs.existsSync(hooksFolder)) {
			fs.mkdirSync(hooksFolder);
		}

		const preCommitPath = path.join(hooksFolder, 'pre-commit');
		if (!fs.existsSync(preCommitPath)) {
			fs.writeFileSync(
				preCommitPath,
				`#!/bin/sh
				../../client/node_modules/.bin/pretty-quick --staged --pattern "client/**/*"`
			);
		}
	} catch (e) {
		// fail silently
		console.log('fail silently :P');
	}
}

run();
