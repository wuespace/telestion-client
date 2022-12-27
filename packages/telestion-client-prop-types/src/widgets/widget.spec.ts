import { createElement } from 'react';
import {
	buildTestsWithInvalidObjectKeyAtomics,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects,
	testPropType
} from '../../tests/lib';
import {
	basePropTypePropType,
	genericPropsPropType,
	globalRendererPropsPropType,
	widgetPropType
} from './widget';
import {
	arrayCase,
	boolCase,
	functionCase,
	nullCase,
	numberCase,
	objectCase,
	stringCase,
	undefinedCase
} from '../../tests/samples/basic';

describe('Tests for widgets', () => {
	describe('Tests for BasePropType', () => {
		testPropType(
			'BasePropType',
			basePropTypePropType,
			[arrayCase, boolCase, numberCase, stringCase, objectCase],
			[undefinedCase, nullCase, functionCase]
		);
	});

	describe('Tests for GenericProps', () => {
		testPropType(
			'GenericProps',
			genericPropsPropType,
			[objectCase],
			[undefinedCase, nullCase, numberCase, boolCase, arrayCase, functionCase]
		);
	});

	const fullGlobalRendererProps = {
		title: 'My random widget'
	};

	describe('Tests for GlobalRendererProps', () => {
		testPropType(
			'GlobalRendererProps',
			globalRendererPropsPropType,
			[
				...buildTestsWithValidObjects(fullGlobalRendererProps, ['title']),
				...buildTestsWithValidObjectKeyValues(
					fullGlobalRendererProps,
					'title',
					['My random widget']
				)
			],
			[
				...buildTestsWithObjectsMissingRequiredKeys(fullGlobalRendererProps, [
					'title'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(
					fullGlobalRendererProps,
					'title',
					['string']
				)
			]
		);
	});

	const fullWidget = {
		name: 'RandomWidget',
		Widget: function MyComponent() {
			return createElement('div');
		},
		ConfigControls: function MyConfigControls() {
			return createElement('div');
		}
	};

	describe('Tests for Widget', () => {
		testPropType(
			'Widget',
			widgetPropType,
			[
				...buildTestsWithValidObjects(fullWidget, ['name', 'Widget']),
				...buildTestsWithValidObjectKeyValues(fullWidget, 'name', [
					'RandomWidget',
					'MyWidget'
				]),
				...buildTestsWithValidObjectKeyValues(fullWidget, 'Widget', [
					fullWidget.Widget
				]),
				...buildTestsWithValidObjectKeyValues(fullWidget, 'ConfigControls', [
					undefined,
					null,
					fullWidget.ConfigControls
				])
			],
			[
				...buildTestsWithObjectsMissingRequiredKeys(fullWidget, [
					'name',
					'Widget'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(fullWidget, 'name', [
					'string'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(fullWidget, 'Widget', [
					'function',
					'string'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(fullWidget, 'ConfigControls', [
					'undefined',
					'null',
					'function',
					'string'
				])
			]
		);
	});
});
