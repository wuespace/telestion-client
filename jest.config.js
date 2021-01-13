module.exports = {
	rootDir: '.',
	coverageReporters: ['json', 'text', 'text-summary', 'lcov'],
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
			collectCoverageFrom: [
				'<rootDir>/packages/telestion-client-prop-types/src/**'
			],
			coveragePathIgnorePatterns: [
				'<rootDir>/node_modules/',
				'<rootDir>/packages/telestion-client-prop-types/node_modules/',
				'<rootDir>/packages/telestion-client-prop-types/build/',
				'<rootDir>/packages/telestion-client-prop-types/tests/',
				'<rootDir>/packages/vertx-event-bus/build/',
				'<rootDir>/packages/telestion-client-prop-types/node_modules/@wuespace/vertx-event-bus/build/index.js'
			],
			testMatch: [
				'<rootDir>/packages/telestion-client-prop-types/src/**/?(*.)+(spec|test).[jt]s'
			]
		}
	]
};
