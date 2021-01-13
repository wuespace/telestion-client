import { TestCase, testPropType } from '../tests/lib/test-prop-type';
import {
	dashboardPropType,
	userConfigPropType,
	widgetDefinitionPropType
} from './user-config';
import {
	buildTestsWithInvalidObjectKeyAtomics,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects
} from '../tests/lib/build-object-test-cases';

describe('Tests for user config', () => {
	const fullWidgetDefinition = {
		width: 10,
		height: 12,
		widgetName: 'RandomWidget',
		title: 'A random widget',
		initialProps: { randomProp: 'Boxing' }
	};

	const validTestsForWidgetDefinition: Array<
		TestCase<typeof fullWidgetDefinition>
	> = [
		...buildTestsWithValidObjects(fullWidgetDefinition, [
			'width',
			'height',
			'widgetName',
			'title'
		]),
		...buildTestsWithValidObjectKeyValues(fullWidgetDefinition, 'width', [
			12,
			42,
			13
		]),
		...buildTestsWithValidObjectKeyValues(fullWidgetDefinition, 'height', [
			13,
			45,
			21
		]),
		...buildTestsWithValidObjectKeyValues(fullWidgetDefinition, 'widgetName', [
			'RandomWidget'
		]),
		...buildTestsWithValidObjectKeyValues(fullWidgetDefinition, 'title', [
			'A random widget'
		]),
		...buildTestsWithValidObjectKeyValues(
			fullWidgetDefinition,
			'initialProps',
			[undefined, null, {}, { randomProp: 'Boxing' }]
		)
	];

	const invalidTestsForWidgetDefinition: Array<
		TestCase<typeof fullWidgetDefinition>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullWidgetDefinition, [
			'width',
			'height',
			'widgetName',
			'title'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullWidgetDefinition, 'width', [
			'number'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullWidgetDefinition, 'height', [
			'number'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullWidgetDefinition,
			'widgetName',
			['string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullWidgetDefinition,
			'initialProps',
			['undefined', 'null', 'object']
		)
	];

	describe('Tests for WidgetDefinition', () => {
		testPropType(
			'WidgetDefinition',
			widgetDefinitionPropType,
			validTestsForWidgetDefinition,
			invalidTestsForWidgetDefinition
		);
	});

	const fullDashboard = {
		title: 'Random Dashboard',
		columns: 40,
		rows: 80,
		widgets: [fullWidgetDefinition]
	};

	const validTestsForDashboard: Array<TestCase<typeof fullDashboard>> = [
		...buildTestsWithValidObjects(fullDashboard, [
			'title',
			'columns',
			'rows',
			'widgets'
		]),
		...buildTestsWithValidObjectKeyValues(fullDashboard, 'title', [
			'Random Dashboard'
		]),
		...buildTestsWithValidObjectKeyValues(fullDashboard, 'columns', [
			13,
			26,
			40
		]),
		...buildTestsWithValidObjectKeyValues(fullDashboard, 'rows', [14, 26, 42]),
		...buildTestsWithValidObjectKeyValues(fullDashboard, 'widgets', [
			[],
			[fullWidgetDefinition]
		])
	];

	const invalidTestsForDashboard: Array<TestCase<typeof fullDashboard>> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullDashboard, [
			'title',
			'columns',
			'rows',
			'widgets'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullDashboard, 'title', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullDashboard, 'columns', [
			'number'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullDashboard, 'rows', ['number']),
		...buildTestsWithInvalidObjectKeyAtomics(fullDashboard, 'widgets', [
			'array'
		])
	];

	describe('Tests for Dashboard', () => {
		testPropType(
			'Dashboard',
			dashboardPropType,
			validTestsForDashboard,
			invalidTestsForDashboard
		);
	});

	const fullUserConfig = {
		username: 'Alice',
		dashboards: [fullDashboard]
	};

	const validTestsForUserConfig: Array<TestCase<typeof fullUserConfig>> = [
		...buildTestsWithValidObjects(fullUserConfig, ['username', 'dashboards']),
		...buildTestsWithValidObjectKeyValues(fullUserConfig, 'username', [
			'Alice'
		]),
		...buildTestsWithValidObjectKeyValues(fullUserConfig, 'dashboards', [
			[],
			[fullDashboard]
		])
	];

	const invalidTestsForUserConfig: Array<TestCase<typeof fullUserConfig>> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullUserConfig, [
			'username',
			'dashboards'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullUserConfig, 'username', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullUserConfig, 'dashboards', [
			'array'
		])
	];

	describe('Tests for UserConfig', () => {
		testPropType(
			'UserConfig',
			userConfigPropType,
			validTestsForUserConfig,
			invalidTestsForUserConfig
		);
	});
});
