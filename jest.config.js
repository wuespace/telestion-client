module.exports = {
	rootDir: '.',
	coverageReporters: ['json'],
	projects: [
		{
			displayName: 'PropTypes',
			globals: {
				'ts-jest': {
					tsconfig: 'base-configs/tsconfig.spec.json'
				}
			},
			preset: 'ts-jest',
			testEnvironment: 'node',
			testMatch: [
				'<rootDir>/packages/telestion-client-prop-types/src/**/?(*.)+(spec|test).[jt]s'
			]
		}
	]
};
