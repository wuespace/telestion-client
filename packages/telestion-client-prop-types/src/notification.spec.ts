import {
	buildTestsWithInvalidObjectKeyAtomics,
	buildTestsWithInvalidObjectKeyValues,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects,
	testPropType
} from '../tests/lib';
import { notificationPropType, notificationTypePropType } from './notification';
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

describe('Tests for notification', () => {
	describe('Tests for NotificationType', () => {
		testPropType(
			'NotificationType',
			notificationTypePropType,
			[
				["special string: 'INFO'", 'INFO'],
				["special string: 'SUCCESS'", 'SUCCESS'],
				["special string: 'WARNING'", 'WARNING'],
				["special string: 'ERROR'", 'ERROR']
			],
			[
				undefinedCase,
				nullCase,
				boolCase,
				numberCase,
				stringCase,
				objectCase,
				arrayCase,
				functionCase
			]
		);
	});

	const fullNotification = {
		type: 'INFO',
		message: 'Something happened',
		description: 'Something happened you should look for.',
		isDismissed: false
	};

	describe('Tests for Notification', () => {
		testPropType(
			'Notification',
			notificationPropType,
			[
				...buildTestsWithValidObjects(fullNotification, [
					'type',
					'message',
					'description',
					'isDismissed'
				]),
				...buildTestsWithValidObjectKeyValues(fullNotification, 'type', [
					'INFO',
					'SUCCESS',
					'WARNING',
					'ERROR'
				]),
				...buildTestsWithValidObjectKeyValues(fullNotification, 'message', [
					'Some random string'
				]),
				...buildTestsWithValidObjectKeyValues(fullNotification, 'description', [
					'Another random string'
				]),
				...buildTestsWithValidObjectKeyValues(fullNotification, 'isDismissed', [
					true,
					false
				])
			],
			[
				...buildTestsWithObjectsMissingRequiredKeys(fullNotification, [
					'type',
					'message',
					'description',
					'isDismissed'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(fullNotification, 'type', [
					'string'
				]),
				...buildTestsWithInvalidObjectKeyValues(fullNotification, 'type', [
					'A random string'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(fullNotification, 'message', [
					'string'
				]),
				...buildTestsWithInvalidObjectKeyAtomics(
					fullNotification,
					'description',
					['string']
				),
				...buildTestsWithInvalidObjectKeyAtomics(
					fullNotification,
					'isDismissed',
					['boolean']
				)
			]
		);
	});
});
