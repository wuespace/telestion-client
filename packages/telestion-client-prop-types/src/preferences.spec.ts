import {
	buildTestsWithInvalidObjectKeyAtomics,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects,
	testPropType
} from '../tests/lib';
import {
	groupSelectorPropType,
	preferencePropType,
	preferencesGroupPropType,
	preferencesStorePropType,
	prefRendererPropType,
	prefSelectorPropType,
	prefValuePropType,
	selectorPropType
} from './preferences';
import {
	arrayCase,
	boolCase,
	functionCase,
	nullCase,
	numberCase,
	objectCase,
	stringCase,
	undefinedCase
} from '../tests/samples/basic';

describe('Tests for preferences', () => {
	describe('Tests for PrefValue', () => {
		testPropType(
			'PrefValue',
			prefValuePropType,
			[arrayCase, boolCase, numberCase, stringCase, objectCase],
			[undefinedCase, nullCase, functionCase]
		);
	});

	describe('Tests for PrefRenderer', () => {
		testPropType(
			'PrefRenderer',
			prefRendererPropType,
			[functionCase],
			[
				undefinedCase,
				nullCase,
				numberCase,
				boolCase,
				stringCase,
				objectCase,
				arrayCase
			]
		);
	});

	describe('Tests for Selector', () => {
		testPropType(
			'Selector',
			selectorPropType,
			[stringCase],
			[
				undefinedCase,
				nullCase,
				numberCase,
				boolCase,
				objectCase,
				arrayCase,
				functionCase
			]
		);
	});

	describe('Tests for PrefSelector', () => {
		testPropType(
			'PrefSelector',
			prefSelectorPropType,
			[stringCase],
			[
				undefinedCase,
				nullCase,
				numberCase,
				boolCase,
				objectCase,
				arrayCase,
				functionCase
			]
		);
	});

	describe('Tests for GroupSelector', () => {
		testPropType(
			'GroupSelector',
			groupSelectorPropType,
			[stringCase, ["specific string: 'null'", 'null']],
			[
				undefinedCase,
				nullCase,
				numberCase,
				boolCase,
				objectCase,
				arrayCase,
				functionCase
			]
		);
	});

	const fullPreference = {
		value: 'anything',
		renderer: () => {}
	};

	describe('Tests for Preference', () => {
		testPropType(
			'Preference',
			preferencePropType,
			[
				...buildTestsWithValidObjects(fullPreference, []),
				...buildTestsWithValidObjectKeyValues(fullPreference, 'value', [
					undefined,
					null,
					true,
					3.14,
					'anything',
					{},
					[]
				]),
				...buildTestsWithValidObjectKeyValues(fullPreference, 'renderer', [
					undefined,
					null,
					() => {}
				])
			],
			[
				...buildTestsWithInvalidObjectKeyAtomics(fullPreference, 'value', [
					'undefined',
					'null',
					'boolean',
					'number',
					'string',
					'object',
					'array'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(fullPreference, 'renderer', [
					'undefined',
					'null',
					'function'
				])
			]
		);
	});

	const anyPreferencesGroup = {
		pref1: fullPreference,
		pref2: fullPreference,
		pref3: fullPreference
	};

	describe('Tests for PreferenceGroup', () => {
		testPropType(
			'PreferenceGroup',
			preferencesGroupPropType,
			buildTestsWithValidObjects(anyPreferencesGroup, []),
			[
				undefinedCase,
				nullCase,
				boolCase,
				numberCase,
				stringCase,
				arrayCase,
				functionCase
			]
		);
	});

	const anyPreferencesStore = {
		group1: anyPreferencesGroup,
		group2: anyPreferencesGroup,
		group3: anyPreferencesGroup
	};

	describe('Tests for PreferencesStore', () => {
		testPropType(
			'PreferencesStore',
			preferencesStorePropType,
			buildTestsWithValidObjects(anyPreferencesStore, []),
			[
				undefinedCase,
				nullCase,
				boolCase,
				numberCase,
				stringCase,
				arrayCase,
				functionCase
			]
		);
	});
});
