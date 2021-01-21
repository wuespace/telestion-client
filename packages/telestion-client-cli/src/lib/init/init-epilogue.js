const chalk = require('chalk');

module.exports = projectPath => `
Your ${chalk.bold('project')} is installed and ready to go at:
    ${chalk.blue(projectPath)}

    ${chalk.green('[example command]')}
      [command description]

Happy developing!
Your Telestion team
`;
