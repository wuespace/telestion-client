import { testPropType } from '../tests/lib/test-prop-type';

import { authResultPropType, signInResultPropType } from './auth';
import {
	buildTestsWithInvalidObjectKeyValues,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjects
} from '../tests/lib/build-object-test-cases';

describe('Tests for authentication', () => {
	describe.only('Tests for AuthResultType', () => {
		testPropType(
			'AuthResultType',
			authResultPropType,
			[['blabla', 'signIn']],
			[]
		);
	});

	/* const fullSignIn = {
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
				[
					"object key 'type' with valid string: 'signIn'",
					{ ...fullSignIn, type: 'signIn' }
				],
				...buildTestsWithValidObjects(fullSignIn, [
					'type',
					'user',
					'eventBusUrl'
				])
			],
			[
				...buildTestsWithObjectsMissingRequiredKeys(fullSignIn, [
					'type',
					'user',
					'eventBusUrl'
				]),
				...buildTestsWithInvalidObjectKeyValues('type', 'string', fullSignIn),
				...buildTestsWithInvalidObjectKeyValues('reason', 'string', fullSignIn),
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
	}); */
});
