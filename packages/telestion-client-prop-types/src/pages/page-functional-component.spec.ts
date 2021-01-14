import { TestCase, testPropType } from '../../tests/lib/test-prop-type';
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
	buildTestsWithInvalidObjectKeyAtomics,
	buildTestsWithInvalidObjectKeyValues,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects
} from '../../tests/lib/build-object-test-cases';

describe('Tests for page functional component', () => {
	const fullAbstractRouting = {
		path: '/route',
		exact: true
	};

	const validTestsForAbstractRouting: Array<
		TestCase<typeof fullAbstractRouting>
	> = [
		...buildTestsWithValidObjects(fullAbstractRouting, ['path']),
		...buildTestsWithValidObjectKeyValues(fullAbstractRouting, 'path', [
			'/route'
		]),
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
		...buildTestsWithInvalidObjectKeyAtomics(fullAbstractRouting, 'path', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullAbstractRouting, 'exact', [
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
		...buildTestsWithValidObjectKeyValues(fullAbstractRedirect, 'path', [
			'/route'
		]),
		...buildTestsWithValidObjectKeyValues(fullAbstractRedirect, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAbstractRedirect,
			'redirectPath',
			['/another-route']
		)
	];

	const invalidTestsForAbstractRedirect: Array<
		TestCase<typeof fullAbstractRedirect>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullAbstractRedirect, [
			'path',
			'redirectPath'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullAbstractRedirect, 'path', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullAbstractRedirect, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullAbstractRedirect,
			'redirectPath',
			['string']
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
		...buildTestsWithValidObjectKeyValues(fullAdditionalRedirect, 'path', [
			'/route'
		]),
		...buildTestsWithValidObjectKeyValues(fullAdditionalRedirect, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAdditionalRedirect,
			'redirectPath',
			['/another-route']
		),
		...buildTestsWithValidObjectKeyValues(fullAdditionalRedirect, 'last', [
			true
		])
	];

	const invalidTestsForAdditionalRedirect: Array<
		TestCase<typeof fullAdditionalRedirect>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullAdditionalRedirect, [
			'path',
			'redirectPath',
			'last'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullAdditionalRedirect, 'path', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullAdditionalRedirect, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullAdditionalRedirect,
			'redirectPath',
			['string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullAdditionalRedirect, 'last', [
			'boolean'
		])
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
		...buildTestsWithValidObjectKeyValues(fullDefaultRouting, 'path', [
			'/route'
		]),
		...buildTestsWithValidObjectKeyValues(fullDefaultRouting, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(fullDefaultRouting, 'type', [
			'default'
		]),
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
		...buildTestsWithInvalidObjectKeyAtomics(fullDefaultRouting, 'path', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullDefaultRouting, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullDefaultRouting, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
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
			[
				...invalidTestsForDefaultRouting,
				...buildTestsWithInvalidObjectKeyValues(fullDefaultRouting, 'type', [
					'unAuth',
					'auth'
				])
			]
		);
	});

	const fullUnAuthRouting = {
		...partBaseRouting,
		type: 'unAuth',
		redirectPath: '/another-route'
	};

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
		...buildTestsWithValidObjectKeyValues(fullAuthRouting, 'path', ['/route']),
		...buildTestsWithValidObjectKeyValues(fullAuthRouting, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(fullAuthRouting, 'redirectPath', [
			'/another-route'
		]),
		...buildTestsWithValidObjectKeyValues(fullAuthRouting, 'type', ['auth']),
		...buildTestsWithValidObjectKeyValues(
			fullAuthRouting,
			'additionalRedirects',
			[undefined, null, []]
		)
	];

	const validTestsForUnAuthRouting: Array<
		TestCase<typeof fullUnAuthRouting>
	> = [
		...buildTestsWithValidObjects(fullUnAuthRouting, [
			'path',
			'redirectPath',
			'type'
		]),
		...buildTestsWithValidObjectKeyValues(fullUnAuthRouting, 'path', [
			'/route'
		]),
		...buildTestsWithValidObjectKeyValues(fullUnAuthRouting, 'exact', [
			undefined,
			null,
			true
		]),
		...buildTestsWithValidObjectKeyValues(fullUnAuthRouting, 'redirectPath', [
			'/another-route'
		]),
		...buildTestsWithValidObjectKeyValues(fullUnAuthRouting, 'type', [
			'unAuth'
		]),
		...buildTestsWithValidObjectKeyValues(
			fullUnAuthRouting,
			'additionalRedirects',
			[undefined, null, []]
		)
	];

	const invalidTestsForAnyAuthRouting: Array<
		TestCase<typeof fullUnAuthRouting | typeof fullAuthRouting>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullUnAuthRouting, [
			'path',
			'redirectPath',
			'type'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullUnAuthRouting, 'path', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullUnAuthRouting, 'exact', [
			'undefined',
			'null',
			'boolean'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullUnAuthRouting,
			'redirectPath',
			['string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullUnAuthRouting, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
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
			[
				...invalidTestsForAnyAuthRouting,
				...buildTestsWithInvalidObjectKeyValues(fullUnAuthRouting, 'type', [
					'default',
					'auth'
				])
			]
		);
	});

	describe('Tests for AuthRouting', () => {
		testPropType('AuthRouting', authRoutingPropType, validTestsForAuthRouting, [
			...invalidTestsForAnyAuthRouting,
			...buildTestsWithInvalidObjectKeyValues(fullAuthRouting, 'type', [
				'default',
				'unAuth'
			])
		]);
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
			[...invalidTestsForDefaultRouting, ...invalidTestsForAnyAuthRouting]
		);
	});
});
