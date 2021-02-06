const logger = require('../logger')('ask-project-name');
const path = require('path');
const inquirer = require('inquirer');

async function askProjectName() {
	const answers = await inquirer.prompt({
		type: 'input',
		name: 'name',
		message: "What's the name of your new project?",
		validate: input => {
			if (!input) return 'Please provide a name for your project';
			if (input !== path.basename(input))
				return 'Please provide a valid name for your project';
			return true;
		}
	});
	logger.debug('Inquirer name answers:', answers);
	return answers['name'];
}

module.exports = askProjectName;
