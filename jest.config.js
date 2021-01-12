module.exports = {
	coverageReporters: ['json'],
	projects: [
		{
			displayName: 'PropTypes',
			preset: 'ts-jest',
			testEnvironment: 'node',
			testMatch: [
				'<rootDir>/packages/telestion-client-prop-types/src/**/?(*.)+(spec|test).[jt]s'
			]
		}
	]
};
