import { testPropType } from '../tests/lib';
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
import { jsonSerializablePropType } from './json-serializable';

describe('Tests for JsonSerializable', () => {
	testPropType(
		'JsonSerializable',
		jsonSerializablePropType,
		[arrayCase, boolCase, numberCase, stringCase, objectCase],
		[undefinedCase, nullCase, functionCase]
	);
});
