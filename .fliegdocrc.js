module.exports = {
	baseUrl: '/telestion-client/',
	outDir: './docs',
	readme: './README.md',
	modules: [
		{
			package: './packages/vertx-event-bus/package.json',
			tsconfig: './packages/vertx-event-bus/tsconfig.json',
			mainFile: 'index.ts'
		},
		{
			package: './packages/vertx-mock-server/package.json',
			tsconfig: './packages/vertx-mock-server/tsconfig.json',
			mainFile: 'index.ts'
		},
		{
			package: './packages/telestion-client-types/package.json',
			tsconfig: './packages/telestion-client-types/tsconfig.json',
			mainFile: 'index.ts'
		},
		{
			package: './packages/telestion-client-prop-types/package.json',
			tsconfig: './packages/telestion-client-prop-types/tsconfig.json',
			mainFile: 'index.ts'
		},
		{
			package: './packages/telestion-client-core/package.json',
			tsconfig: './packages/telestion-client-core/tsconfig.json',
			mainFile: 'index.ts'
		},
		{
			package: './packages/telestion-client-common/package.json',
			tsconfig: './packages/telestion-client-common/tsconfig.json',
			mainFile: 'index.ts'
		},
		{
			package: './packages/telestion-client-cli/package.json',
			tsconfig: './packages/telestion-client-cli/tsconfig.json',
			mainFile: 'api.mts'
		},
		{
			package: './packages/parcel-optimizer-electron-require/package.json',
			tsconfig: './packages/parcel-optimizer-electron-require/tsconfig.json',
			mainFile: 'optimizer.ts'
		},
		{
			package: './packages/parcel-reporter-tc-cli/package.json',
			tsconfig: './packages/parcel-reporter-tc-cli/tsconfig.json',
			mainFile: 'reporter.ts'
		},
		{
			package: './packages/parcel-resolver-react/package.json',
			tsconfig: './packages/parcel-resolver-react/tsconfig.json',
			mainFile: 'resolver.ts'
		}
	],
	title: 'Telestion Client Monorepo',
	externalLinks: {
		GitHub: 'https://github.com/wuespace/telestion-client/',
		Homepage: 'https://telestion.wuespace.de/',
		'React Spectrum Libraries': 'https://react-spectrum.adobe.com/',
		'Legal Notice': 'https://www.wuespace.de/legal-notice/'
	}
};
