const util = require('util');
const child_process = require('child_process');

const exec = util.promisify(child_process.exec);

async function asyncExec(command, options) {
	await exec(command, options);
}

module.exports = asyncExec;
