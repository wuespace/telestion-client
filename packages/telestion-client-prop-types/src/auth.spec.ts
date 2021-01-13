import { testPropType } from '../tests/lib/test-prop-type';

import { authResultTypePropType, signInResultPropType } from './auth';
import {
	buildTestsWithInvalidObjectKeyValues,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects
} from '../tests/lib/build-object-test-cases';

describe('Tests for authentication', () => {
	describe('Tests for AuthResultType', () => {
		testPropType(
			'AuthResultType',
			authResultTypePropType,
			[
				["specific string: 'signIn'", 'signIn'],
				["specific string: 'signOut'", 'signOut']
			],
			[['generic string', 'The Box']]
		);
	});

	const fullSignIn = {
		type: 'signIn',
		reason: 'Because why not? :D',
		user: 'alice',
		eventBusUrl: 'http://localhost:9870/bridge'
	};

	describe('Tests for SignInResult', () => {
		testPropType(
			'SignInResult',
			signInResultPropType,
			[
				...buildTestsWithValidObjects(fullSignIn, [
					'type',
					'user',
					'eventBusUrl'
				]),
				...buildTestsWithValidObjectKeyValues('type', 'signIn', fullSignIn),
				...buildTestsWithValidObjectKeyValues(
					'reason',
					[undefined, null, 'anything'],
					fullSignIn
				),
				...buildTestsWithValidObjectKeyValues('user', 'alice', fullSignIn),
				...buildTestsWithValidObjectKeyValues(
					'eventBusUrl',
					'http://localhost:9870/bridge',
					fullSignIn
				)
			],
			[
				...buildTestsWithObjectsMissingRequiredKeys(fullSignIn, [
					'type',
					'user',
					'eventBusUrl'
				]),
				...buildTestsWithInvalidObjectKeyValues('type', 'string', fullSignIn),
				...buildTestsWithInvalidObjectKeyValues(
					'reason',
					['undefined', 'null', 'string'],
					fullSignIn
				),
				...buildTestsWithInvalidObjectKeyValues('user', 'string', fullSignIn),
				...buildTestsWithInvalidObjectKeyValues(
					'eventBusUrl',
					'string',
					fullSignIn
				),
				[
					"object key 'type' with generic string",
					{ ...fullSignIn, type: 'The Box' }
				]
			]
		);
	});
});
