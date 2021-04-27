const chalk = require('chalk');
const path = require('path');

module.exports = projectPath => `
Your ${chalk.bold('project')} is installed and ready to go at:
    ${chalk.blue(projectPath)}

Use ${chalk.green(
	'cd ' + path.relative(process.cwd(), projectPath)
)} to enter that directory.

There, you can use

    ${chalk.green('npm start')}
      (which, in turn, runs ${chalk.green('tc-cli start --electron')})
      to run a development version of your client during development

    or ${chalk.green('npm run build')}
      (which, in turn, runs ${chalk.green('tc-cli build')})
      to build a ready-to-ship web application and native app.

For an overview of all ${chalk.green(
	'tc-cli'
)} commands, please run ${chalk.green('tc-cli --help')}

Happy developing!
Your Telestion team
`;
