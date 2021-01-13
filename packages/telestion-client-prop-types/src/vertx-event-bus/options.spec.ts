import { testPropType } from '../../tests/lib/test-prop-type';
import { optionsPropType } from './options';
import {
	buildTestsWithInvalidObjectKeyAtomics,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects
} from '../../tests/lib/build-object-test-cases';

describe('Tests for event bus options', () => {
	const fullOptions = {
		pingInterval: 5000 /* ms */,
		reconnectAttempts: Infinity,
		reconnectExponent: 2,
		delayMin: 1000 /* ms */,
		delayMax: 5000 /* ms */,
		randomizationFactor: 0.5
	};

	describe('Tests for Options', () => {
		testPropType(
			'Options',
			optionsPropType,
			[
				...buildTestsWithValidObjects(fullOptions, []),
				...buildTestsWithValidObjectKeyValues(fullOptions, 'pingInterval', [
					undefined,
					null,
					13,
					25,
					46
				]),
				...buildTestsWithValidObjectKeyValues(
					fullOptions,
					'reconnectAttempts',
					[undefined, null, 13, 25, 46]
				),
				...buildTestsWithValidObjectKeyValues(
					fullOptions,
					'reconnectExponent',
					[undefined, null, 13, 25, 46]
				),
				...buildTestsWithValidObjectKeyValues(fullOptions, 'delayMin', [
					undefined,
					null,
					13,
					25,
					46
				]),
				...buildTestsWithValidObjectKeyValues(fullOptions, 'delayMax', [
					undefined,
					null,
					13,
					25,
					46
				]),
				...buildTestsWithValidObjectKeyValues(
					fullOptions,
					'randomizationFactor',
					[undefined, null, 0.1, 0.4, 0.56]
				)
			],
			[
				...buildTestsWithInvalidObjectKeyAtomics(fullOptions, 'pingInterval', [
					'undefined',
					'null',
					'number'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(
					fullOptions,
					'reconnectAttempts',
					['undefined', 'null', 'number']
				),
				...buildTestsWithInvalidObjectKeyAtomics(
					fullOptions,
					'reconnectExponent',
					['undefined', 'null', 'number']
				),
				...buildTestsWithInvalidObjectKeyAtomics(fullOptions, 'delayMin', [
					'undefined',
					'null',
					'number'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(fullOptions, 'delayMax', [
					'undefined',
					'null',
					'number'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(
					fullOptions,
					'randomizationFactor',
					['undefined', 'null', 'number']
				)
			]
		);
	});
});
