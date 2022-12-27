module.exports = {
	rootDir: '.',
	coverageReporters: ['json', 'text', 'text-summary', 'lcov'],
	projects: [
		{
			displayName: 'Telestion Client PropTypes',
			globals: {
				'ts-jest': {
					tsconfig: 'packages/telestion-client-prop-types/tsconfig.json'
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
				'<rootDir>/packages/telestion-client-prop-types/dist/',
				'<rootDir>/packages/telestion-client-prop-types/tests/',
				'<rootDir>/packages/vertx-event-bus/dist/',
				'<rootDir>/packages/telestion-client-prop-types/node_modules/@wuespace/vertx-event-bus/dist/index.js'
			],
			testMatch: [
				'<rootDir>/packages/telestion-client-prop-types/src/**/*(*.)@(spec|test).[jt]s'
			]
		},
		{
			displayName: 'Vert.x Event Bus',
			globals: {
				'ts-jest': {
					tsconfig: 'packages/vertx-event-bus/tsconfig.json'
				}
			},
			preset: 'ts-jest',
			testEnvironment: 'node',
			collectCoverageFrom: ['<rootDir>/packages/vertx-event-bus/src/**'],
			coveragePathIgnorePatterns: ['<rootdir>/packages/vertx-event-bus/dist'],
			testMatch: [
				'<rootDir>/packages/vertx-event-bus/src/**/*(*.)@(spec|test).[jt]s'
			]
		}
		// TODO: Uncomment when mock server has jest unit tests
		// {
		// 	displayName: 'MockServer',
		// 	globals: {
		// 		"ts-jest": {
		// 			tsconfig: 'packages/vertx-mock-server/tsconfig.json'
		// 		}
		// 	},
		// 	preset: 'ts-jest',
		// 	testEnvironment: 'node',
		// 	collectCoverageFrom: [
		// 		'<rootDir>/packages/vertx-mock-server/src/**'
		// 	],
		// 	coveragePathIgnorePatterns: ['<rootDir>/packages/vertx-mock-server/dist'],
		// 	testMatch: [
		// 		'<rootDir>/packages/vertx-mock-server/src/**/*(*.)@(spec|test).[jt]s'
		// 	]
		// }
	]
};
