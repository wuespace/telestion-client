const util = require('util');
const child_process = require('child_process');

const exec = util.promisify(child_process.exec);

async function asyncExec(command, options) {
	return await exec(command, options);
}

module.exports = asyncExec;
