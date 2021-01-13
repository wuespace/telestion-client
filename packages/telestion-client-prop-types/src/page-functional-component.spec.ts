import { TestCase, testPropType } from '../tests/lib/test-prop-type';
import {
	abstractRedirectPropType,
	abstractRoutingPropType,
	additionalRedirectPropType,
	authRoutingPropType,
	defaultRoutingPropType,
	routingPropType,
	routingTypePropType,
	unAuthRoutingPropType
} from './page-functional-component';
import {
	buildTestsWithInvalidObjectKeyValues,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects
} from '../tests/lib/build-object-test-cases';

describe('Tests for page functional component', () => {
	const fullAbstractRouting = {
		path: '/route',
		exact: true
	};

	const validTestsForAbstractRouting: Array<
		TestCase<typeof fullAbstractRouting>
	> = [
		...buildTestsWithValidObjects(fullAbstractRouting, ['path']),
		...buildTestsWithValidObjectKeyValues(
			fullAbstractRouting,
			'path',
			'/route'
		),
		...buildTestsWithValidObjectKeyValues(fullAbstractRouting, 'exact', [
			undefined,
			null,
			true
		])
	];

	const invalidTestsForAbstractRouting: Array<
		TestCase<typeof fullAbstractRouting>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullAbstractRouting, ['path']),
		...buildTestsWithInvalidObjectKeyValues(
			fullAbstractRouting,
			'path',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(fullAbstractRouting, 'exact', [
			'undefined',
			'null',
			'boolean'
		])
	];

	describe('Tests for AbstractRouting', () => {
		testPropType(
			'AbstractRouting',
			abstractRoutingPropType,
			validTestsForAbstractRouting,
			invalidTestsForAbstractRouting
		);
	});

	const fullAbstractRedirect = {
		...fullAbstractRouting,
		redirectPath: '/another-route'
	};

	const validTestsForAbstractRedirect: Array<
		TestCase<typeof fullAbstractRedirect>
	> = [
		...buildTestsWithValidObjects(fullAbstractRedirect, [
			'path',
			'redirectPath'
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAbstractRedirect,
			'path',
			'/route'
		),
		...buildTestsWithValidObjectKeyValues(fullAbstractRedirect, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAbstractRedirect,
			'redirectPath',
			'/another-route'
		)
	];

	const invalidTestsForAbstractRedirect: Array<
		TestCase<typeof fullAbstractRedirect>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullAbstractRedirect, [
			'path',
			'redirectPath'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullAbstractRedirect,
			'path',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(fullAbstractRedirect, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullAbstractRedirect,
			'redirectPath',
			'string'
		)
	];

	describe('Tests for AbstractRedirect', () => {
		testPropType(
			'AbstractRedirect',
			abstractRedirectPropType,
			validTestsForAbstractRedirect,
			invalidTestsForAbstractRedirect
		);
	});

	const fullAdditionalRedirect = {
		...fullAbstractRedirect,
		last: true
	};

	const validTestsForAdditionalRedirect: Array<
		TestCase<typeof fullAdditionalRedirect>
	> = [
		...buildTestsWithValidObjects(fullAdditionalRedirect, [
			'path',
			'redirectPath',
			'last'
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAdditionalRedirect,
			'path',
			'/route'
		),
		...buildTestsWithValidObjectKeyValues(fullAdditionalRedirect, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAdditionalRedirect,
			'redirectPath',
			'/another-route'
		),
		...buildTestsWithValidObjectKeyValues(fullAdditionalRedirect, 'last', true)
	];

	const invalidTestsForAdditionalRedirect: Array<
		TestCase<typeof fullAdditionalRedirect>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullAdditionalRedirect, [
			'path',
			'redirectPath',
			'last'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullAdditionalRedirect,
			'path',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(fullAdditionalRedirect, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullAdditionalRedirect,
			'redirectPath',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(
			fullAdditionalRedirect,
			'last',
			'boolean'
		)
	];

	describe('Tests for AdditionalRedirect', () => {
		testPropType(
			'AdditionalRedirect',
			additionalRedirectPropType,
			validTestsForAdditionalRedirect,
			invalidTestsForAdditionalRedirect
		);
	});

	describe('Tests for RoutingType', () => {
		testPropType(
			'RoutingType',
			routingTypePropType,
			[
				["specific string: 'default'", 'default'],
				["specific string: 'unAuth'", 'unAuth'],
				["specific string: 'auth'", 'auth']
			],
			[['generic string', 'The Box']]
		);
	});

	const partBaseRouting = {
		...fullAbstractRouting,
		additionalRedirects: []
	};

	const fullDefaultRouting = {
		...partBaseRouting,
		type: 'default'
	};

	const validTestsForDefaultRouting: Array<
		TestCase<typeof fullDefaultRouting>
	> = [
		...buildTestsWithValidObjects(fullDefaultRouting, ['path', 'type']),
		...buildTestsWithValidObjectKeyValues(fullDefaultRouting, 'path', '/route'),
		...buildTestsWithValidObjectKeyValues(fullDefaultRouting, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(
			fullDefaultRouting,
			'type',
			'default'
		),
		...buildTestsWithValidObjectKeyValues(
			fullDefaultRouting,
			'additionalRedirects',
			[undefined, null, []]
		)
	];

	const invalidTestsForDefaultRouting: Array<
		TestCase<typeof fullDefaultRouting>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullDefaultRouting, [
			'path',
			'type'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullDefaultRouting,
			'path',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(fullDefaultRouting, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullDefaultRouting,
			'type',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(
			fullDefaultRouting,
			'additionalRedirects',
			['undefined', 'null', 'array']
		)
	];

	describe('Tests for DefaultRouting', () => {
		testPropType(
			'DefaultRouting',
			defaultRoutingPropType,
			validTestsForDefaultRouting,
			invalidTestsForDefaultRouting
		);
	});

	const fullUnAuthRouting = {
		...partBaseRouting,
		type: 'unAuth',
		redirectPath: '/another-route'
	};

	const validTestsForUnAuthRouting: Array<
		TestCase<typeof fullUnAuthRouting>
	> = [
		...buildTestsWithValidObjects(fullUnAuthRouting, [
			'path',
			'redirectPath',
			'type'
		]),
		...buildTestsWithValidObjectKeyValues(fullUnAuthRouting, 'path', '/route'),
		...buildTestsWithValidObjectKeyValues(fullUnAuthRouting, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(
			fullUnAuthRouting,
			'redirectPath',
			'/another-route'
		),
		...buildTestsWithValidObjectKeyValues(fullUnAuthRouting, 'type', 'unAuth'),
		...buildTestsWithValidObjectKeyValues(
			fullUnAuthRouting,
			'additionalRedirects',
			[undefined, null, []]
		)
	];

	const invalidTestsForUnAuthRouting: Array<
		TestCase<typeof fullUnAuthRouting>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullUnAuthRouting, [
			'path',
			'redirectPath',
			'type'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullUnAuthRouting,
			'path',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(fullUnAuthRouting, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullUnAuthRouting,
			'redirectPath',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(
			fullUnAuthRouting,
			'type',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(
			fullUnAuthRouting,
			'additionalRedirects',
			['undefined', 'null', 'array']
		)
	];

	describe('Tests for UnAuthRouting', () => {
		testPropType(
			'UnAuthRouting',
			unAuthRoutingPropType,
			validTestsForUnAuthRouting,
			invalidTestsForUnAuthRouting
		);
	});

	const fullAuthRouting = {
		...partBaseRouting,
		type: 'auth',
		redirectPath: '/another-route'
	};

	const validTestsForAuthRouting: Array<TestCase<typeof fullAuthRouting>> = [
		...buildTestsWithValidObjects(fullAuthRouting, [
			'path',
			'redirectPath',
			'type'
		]),
		...buildTestsWithValidObjectKeyValues(fullAuthRouting, 'path', '/route'),
		...buildTestsWithValidObjectKeyValues(fullAuthRouting, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAuthRouting,
			'redirectPath',
			'/another-route'
		),
		...buildTestsWithValidObjectKeyValues(fullAuthRouting, 'type', 'auth'),
		...buildTestsWithValidObjectKeyValues(
			fullAuthRouting,
			'additionalRedirects',
			[undefined, null, []]
		)
	];

	const invalidTestsForAuthRouting: Array<TestCase<typeof fullAuthRouting>> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullAuthRouting, [
			'path',
			'redirectPath',
			'type'
		]),
		...buildTestsWithInvalidObjectKeyValues(fullAuthRouting, 'path', 'string'),
		...buildTestsWithInvalidObjectKeyValues(fullAuthRouting, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyValues(
			fullAuthRouting,
			'redirectPath',
			'string'
		),
		...buildTestsWithInvalidObjectKeyValues(fullAuthRouting, 'type', 'string'),
		...buildTestsWithInvalidObjectKeyValues(
			fullAuthRouting,
			'additionalRedirects',
			['undefined', 'null', 'array']
		)
	];

	describe('Tests for AuthRouting', () => {
		testPropType(
			'AuthRouting',
			authRoutingPropType,
			validTestsForAuthRouting,
			invalidTestsForAuthRouting
		);
	});

	describe('Tests for Routing (aka DefaultRouting, UnAuthRouting and AuthRouting)', () => {
		testPropType(
			'Routing',
			routingPropType,
			[
				...validTestsForDefaultRouting,
				...validTestsForUnAuthRouting,
				...validTestsForAuthRouting
			],
			[
				...invalidTestsForDefaultRouting,
				...invalidTestsForUnAuthRouting,
				...invalidTestsForAuthRouting
			]
		);
	});
});
