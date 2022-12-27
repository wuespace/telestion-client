#!/usr/bin/env node

import { createServer } from 'node:http';
import serveStatic from 'serve-static';
import finalHandler from 'finalhandler';
import { commands, actions } from '@wuespace/telestion-client-cli';
import cypress from 'cypress';

const projectRootPath = await actions.psc.getPSCRoot(process.cwd());

function log(...args) {
	console.log('\n:: ', ...args, ' ::\n');
}

log('Build project');

await commands.runBuildCommand({
	loglevel: 'warn',
	workingDir: projectRootPath,
	platform: ['all'],
	arch: ['all'],
	electron: false
});

log('Start static http server');

const serve = serveStatic('dist', { index: ['index.html'] });
const httpServer = createServer((req, res) => {
	serve(req, res, finalHandler(req, res));
});
console.log('Listening on :8080...');
httpServer.listen(8080);

log('Run Cypress test');

const cypressResult = await cypress.run();
const exitCode = cypressResult.totalFailed > 0 ? 1 : 0;

log('Finished');

httpServer.close();
process.exit(exitCode);
