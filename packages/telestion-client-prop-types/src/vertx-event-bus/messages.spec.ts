import { TestCase, testPropType } from '../../tests/lib/test-prop-type';
import {
	addressableMessagePropType,
	baseMessagePropType,
	callbackPropType,
	contentMessagePropType,
	errorMessagePropType,
	headersPropType,
	jsonSerializablePropType,
	messagePropType,
	messageTypePropType,
	pingMessagePropType,
	publishMessagePropType,
	receiveMessagePropType,
	registerMessagePropType,
	sendMessagePropType,
	unregisterMessagePropType
} from './messages';
import {
	arrayCase,
	basicTypeCases,
	boolCase,
	functionCase,
	nullCase,
	numberCase,
	objectCase,
	stringCase,
	undefinedCase
} from '../../tests/samples/basic';
import {
	buildTestsWithInvalidObjectKeyAtomics,
	buildTestsWithInvalidObjectKeyValues,
	buildTestsWithObjectsMissingRequiredKeys,
	buildTestsWithValidObjectKeyValues,
	buildTestsWithValidObjects
} from '../../tests/lib/build-object-test-cases';

describe('Tests for event bus messages', () => {
	describe('Tests for JsonSerializable', () => {
		testPropType(
			'JsonSerializable',
			jsonSerializablePropType,
			[arrayCase, boolCase, numberCase, stringCase, objectCase],
			[undefinedCase, nullCase, functionCase]
		);
	});

	describe('Tests for Headers', () => {
		testPropType(
			'Headers',
			headersPropType,
			[objectCase],
			[
				undefinedCase,
				nullCase,
				numberCase,
				boolCase,
				stringCase,
				arrayCase,
				functionCase
			]
		);
	});

	describe('Tests for MessageType', () => {
		testPropType(
			'MessageType',
			messageTypePropType,
			[
				["specific string: 'ping'", 'ping'],
				["specific string: 'register'", 'register'],
				["specific string: 'unregister'", 'unregister'],
				["specific string: 'publish'", 'publish'],
				["specific string: 'send'", 'send'],
				["specific string: 'rec'", 'rec'],
				["specific string: 'err'", 'err']
			],
			[...basicTypeCases]
		);
	});

	const fullBaseMessage = {
		type: 'ping'
	};

	const validTestsForBaseMessage: Array<TestCase<typeof fullBaseMessage>> = [
		...buildTestsWithValidObjects(fullBaseMessage, ['type']),
		...buildTestsWithValidObjectKeyValues(fullBaseMessage, 'type', [
			'ping',
			'register',
			'unregister',
			'publish',
			'send',
			'rec',
			'err'
		])
	];
	const invalidTestsForBaseMessage: Array<TestCase<typeof fullBaseMessage>> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullBaseMessage, ['type']),
		...buildTestsWithInvalidObjectKeyAtomics(fullBaseMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyValues(fullBaseMessage, 'type', [
			'any',
			'other',
			'string'
		])
	];

	describe('Tests for BaseMessage', () => {
		testPropType(
			'BaseMessage',
			baseMessagePropType,
			validTestsForBaseMessage,
			invalidTestsForBaseMessage
		);
	});

	const fullAddressableMessage = {
		...fullBaseMessage,
		headers: {},
		replyAddress: 'Go there!',
		reply: () => {}
	};

	const validTestsForAddressableMessage: Array<
		TestCase<typeof fullAddressableMessage>
	> = [
		...buildTestsWithValidObjects(fullAddressableMessage, ['type', 'headers']),
		...buildTestsWithValidObjectKeyValues(fullAddressableMessage, 'type', [
			'ping',
			'register',
			'unregister',
			'publish',
			'send',
			'rec',
			'err'
		]),
		...buildTestsWithValidObjectKeyValues(fullAddressableMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(
			fullAddressableMessage,
			'replyAddress',
			[undefined, null, 'Here!']
		),
		...buildTestsWithValidObjectKeyValues(fullAddressableMessage, 'reply', [
			undefined,
			null,
			() => {}
		])
	];
	const invalidTestsForAddressableMessage: Array<
		TestCase<typeof fullAddressableMessage>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullAddressableMessage, [
			'type',
			'headers'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullAddressableMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullAddressableMessage,
			'headers',
			['object']
		),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullAddressableMessage,
			'replyAddress',
			['undefined', 'null', 'string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullAddressableMessage, 'reply', [
			'undefined',
			'null',
			'function'
		])
	];

	describe('Tests for AddressableMessage', () => {
		testPropType(
			'AddressableMessage',
			addressableMessagePropType,
			validTestsForAddressableMessage,
			invalidTestsForAddressableMessage
		);
	});

	const fullContentMessage = {
		...fullAddressableMessage,
		body: { prop: 'value' }
	};

	const validTestsForContentMessage: Array<
		TestCase<typeof fullContentMessage>
	> = [
		...buildTestsWithValidObjects(fullContentMessage, [
			'type',
			'headers',
			'body'
		]),
		...buildTestsWithValidObjectKeyValues(fullContentMessage, 'type', [
			'ping',
			'register',
			'unregister',
			'publish',
			'send',
			'rec',
			'err'
		]),
		...buildTestsWithValidObjectKeyValues(fullContentMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(fullContentMessage, 'replyAddress', [
			undefined,
			null,
			'Here!'
		]),
		...buildTestsWithValidObjectKeyValues(fullContentMessage, 'reply', [
			undefined,
			null,
			() => {}
		]),
		...buildTestsWithValidObjectKeyValues(fullContentMessage, 'body', [
			[],
			true,
			'Hey',
			3.14,
			{ prop: 'value' }
		])
	];
	const invalidTestsForContentMessage: Array<
		TestCase<typeof fullContentMessage>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullContentMessage, [
			'type',
			'headers',
			'body'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullContentMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullContentMessage, 'headers', [
			'object'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullContentMessage,
			'replyAddress',
			['undefined', 'null', 'string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullContentMessage, 'reply', [
			'undefined',
			'null',
			'function'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullContentMessage, 'body', [
			'array',
			'boolean',
			'string',
			'number',
			'object'
		])
	];

	describe('Tests for ContentMessage', () => {
		testPropType(
			'ContentMessage',
			contentMessagePropType,
			validTestsForContentMessage,
			invalidTestsForContentMessage
		);
	});

	const fullPingMessage = {
		...fullBaseMessage,
		type: 'ping'
	};

	const validTestsForPingMessage: Array<TestCase<typeof fullPingMessage>> = [
		...buildTestsWithValidObjects(fullPingMessage, ['type']),
		...buildTestsWithValidObjectKeyValues(fullPingMessage, 'type', ['ping'])
	];

	const invalidTestsForPingMessage: Array<TestCase<typeof fullPingMessage>> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullPingMessage, ['type']),
		...buildTestsWithInvalidObjectKeyAtomics(fullPingMessage, 'type', [
			'string'
		])
	];

	describe('Tests for PingMessage', () => {
		testPropType('PingMessage', pingMessagePropType, validTestsForPingMessage, [
			...invalidTestsForPingMessage,
			...buildTestsWithInvalidObjectKeyValues(fullPingMessage, 'type', [
				'register',
				'unregister',
				'publish',
				'send',
				'rec',
				'err'
			])
		]);
	});

	const fullRegisterMessage = {
		...fullAddressableMessage,
		type: 'register'
	};

	const validTestsForRegisterMessage: Array<
		TestCase<typeof fullRegisterMessage>
	> = [
		...buildTestsWithValidObjects(fullRegisterMessage, ['type', 'headers']),
		...buildTestsWithValidObjectKeyValues(fullRegisterMessage, 'type', [
			'register'
		]),
		...buildTestsWithValidObjectKeyValues(fullRegisterMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(fullRegisterMessage, 'replyAddress', [
			undefined,
			null,
			'Here!'
		]),
		...buildTestsWithValidObjectKeyValues(fullRegisterMessage, 'reply', [
			undefined,
			null,
			() => {}
		])
	];
	const invalidTestsForRegisterMessage: Array<
		TestCase<typeof fullRegisterMessage>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullRegisterMessage, [
			'type',
			'headers'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullRegisterMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullRegisterMessage, 'headers', [
			'object'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullRegisterMessage,
			'replyAddress',
			['undefined', 'null', 'string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullRegisterMessage, 'reply', [
			'undefined',
			'null',
			'function'
		])
	];

	describe('Tests for RegisterMessage', () => {
		testPropType(
			'RegisterMessage',
			registerMessagePropType,
			validTestsForRegisterMessage,
			[
				...invalidTestsForRegisterMessage,
				...buildTestsWithInvalidObjectKeyValues(fullRegisterMessage, 'type', [
					'ping',
					'unregister',
					'publish',
					'send',
					'rec',
					'err'
				])
			]
		);
	});

	const fullUnregisterMessage = {
		...fullAddressableMessage,
		type: 'unregister'
	};

	const validTestsForUnregisterMessage: Array<
		TestCase<typeof fullUnregisterMessage>
	> = [
		...buildTestsWithValidObjects(fullUnregisterMessage, ['type', 'headers']),
		...buildTestsWithValidObjectKeyValues(fullUnregisterMessage, 'type', [
			'unregister'
		]),
		...buildTestsWithValidObjectKeyValues(fullUnregisterMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(
			fullUnregisterMessage,
			'replyAddress',
			[undefined, null, 'Here!']
		),
		...buildTestsWithValidObjectKeyValues(fullUnregisterMessage, 'reply', [
			undefined,
			null,
			() => {}
		])
	];

	const invalidTestsForUnregisterMessage: Array<
		TestCase<typeof fullUnregisterMessage>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullUnregisterMessage, [
			'type',
			'headers'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullUnregisterMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullUnregisterMessage, 'headers', [
			'object'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullUnregisterMessage,
			'replyAddress',
			['undefined', 'null', 'string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullUnregisterMessage, 'reply', [
			'undefined',
			'null',
			'function'
		])
	];

	describe('Tests for UnregisterMessage', () => {
		testPropType(
			'UnregisterMessage',
			unregisterMessagePropType,
			validTestsForUnregisterMessage,
			[
				...invalidTestsForUnregisterMessage,
				...buildTestsWithInvalidObjectKeyValues(fullUnregisterMessage, 'type', [
					'ping',
					'register',
					'publish',
					'send',
					'rec',
					'err'
				])
			]
		);
	});

	const fullPublishMessage = {
		...fullContentMessage,
		type: 'publish'
	};

	const validTestsForPublishMessage: Array<
		TestCase<typeof fullPublishMessage>
	> = [
		...buildTestsWithValidObjects(fullPublishMessage, [
			'type',
			'headers',
			'body'
		]),
		...buildTestsWithValidObjectKeyValues(fullPublishMessage, 'type', [
			'publish'
		]),
		...buildTestsWithValidObjectKeyValues(fullPublishMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(fullPublishMessage, 'replyAddress', [
			undefined,
			null,
			'Here!'
		]),
		...buildTestsWithValidObjectKeyValues(fullPublishMessage, 'reply', [
			undefined,
			null,
			() => {}
		]),
		...buildTestsWithValidObjectKeyValues(fullPublishMessage, 'body', [
			[],
			true,
			'Hey',
			3.14,
			{ prop: 'value' }
		])
	];
	const invalidTestsForPublishMessage: Array<
		TestCase<typeof fullPublishMessage>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullPublishMessage, [
			'type',
			'headers',
			'body'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullPublishMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullPublishMessage, 'headers', [
			'object'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullPublishMessage,
			'replyAddress',
			['undefined', 'null', 'string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullPublishMessage, 'reply', [
			'undefined',
			'null',
			'function'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullPublishMessage, 'body', [
			'array',
			'boolean',
			'string',
			'number',
			'object'
		])
	];

	describe('Tests for PublishMessage', () => {
		testPropType(
			'PublishMessage',
			publishMessagePropType,
			validTestsForPublishMessage,
			[
				...invalidTestsForPublishMessage,
				...buildTestsWithInvalidObjectKeyValues(fullPublishMessage, 'type', [
					'ping',
					'register',
					'unregister',
					'send',
					'rec',
					'err'
				])
			]
		);
	});

	const fullSendMessage = {
		...fullContentMessage,
		type: 'send'
	};

	const validTestsForSendMessage: Array<TestCase<typeof fullSendMessage>> = [
		...buildTestsWithValidObjects(fullSendMessage, ['type', 'headers', 'body']),
		...buildTestsWithValidObjectKeyValues(fullSendMessage, 'type', ['send']),
		...buildTestsWithValidObjectKeyValues(fullSendMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(fullSendMessage, 'replyAddress', [
			undefined,
			null,
			'Here!'
		]),
		...buildTestsWithValidObjectKeyValues(fullSendMessage, 'reply', [
			undefined,
			null,
			() => {}
		]),
		...buildTestsWithValidObjectKeyValues(fullSendMessage, 'body', [
			[],
			true,
			'Hey',
			3.14,
			{ prop: 'value' }
		])
	];
	const invalidTestsForSendMessage: Array<TestCase<typeof fullSendMessage>> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullSendMessage, [
			'type',
			'headers',
			'body'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullSendMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullSendMessage, 'headers', [
			'object'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullSendMessage, 'replyAddress', [
			'undefined',
			'null',
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullSendMessage, 'reply', [
			'undefined',
			'null',
			'function'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullSendMessage, 'body', [
			'array',
			'boolean',
			'string',
			'number',
			'object'
		])
	];

	describe('Tests for SendMessage', () => {
		testPropType('SendMessage', sendMessagePropType, validTestsForSendMessage, [
			...invalidTestsForSendMessage,
			...buildTestsWithInvalidObjectKeyValues(fullSendMessage, 'type', [
				'ping',
				'register',
				'unregister',
				'publish',
				'rec',
				'err'
			])
		]);
	});

	const fullReceiveMessage = {
		...fullContentMessage,
		type: 'rec'
	};

	const validTestsForReceiveMessage: Array<
		TestCase<typeof fullReceiveMessage>
	> = [
		...buildTestsWithValidObjects(fullReceiveMessage, [
			'type',
			'headers',
			'body'
		]),
		...buildTestsWithValidObjectKeyValues(fullReceiveMessage, 'type', ['rec']),
		...buildTestsWithValidObjectKeyValues(fullReceiveMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(fullReceiveMessage, 'replyAddress', [
			undefined,
			null,
			'Here!'
		]),
		...buildTestsWithValidObjectKeyValues(fullReceiveMessage, 'reply', [
			undefined,
			null,
			() => {}
		]),
		...buildTestsWithValidObjectKeyValues(fullReceiveMessage, 'body', [
			[],
			true,
			'Hey',
			3.14,
			{ prop: 'value' }
		])
	];
	const invalidTestsForReceiveMessage: Array<
		TestCase<typeof fullReceiveMessage>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullReceiveMessage, [
			'type',
			'headers',
			'body'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullReceiveMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullReceiveMessage, 'headers', [
			'object'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(
			fullReceiveMessage,
			'replyAddress',
			['undefined', 'null', 'string']
		),
		...buildTestsWithInvalidObjectKeyAtomics(fullReceiveMessage, 'reply', [
			'undefined',
			'null',
			'function'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullReceiveMessage, 'body', [
			'array',
			'boolean',
			'string',
			'number',
			'object'
		])
	];

	describe('Tests for ReceiveMessage', () => {
		testPropType(
			'ReceiveMessage',
			receiveMessagePropType,
			validTestsForReceiveMessage,
			[
				...invalidTestsForReceiveMessage,
				...buildTestsWithInvalidObjectKeyValues(fullReceiveMessage, 'type', [
					'ping',
					'register',
					'unregister',
					'publish',
					'send',
					'err'
				])
			]
		);
	});

	const fullErrorMessage = {
		...fullAddressableMessage,
		type: 'err',
		failureCode: 13,
		failureType: 'UnknownError',
		message: 'Something gone wrong'
	};

	const validTestsForErrorMessage: Array<TestCase<typeof fullErrorMessage>> = [
		...buildTestsWithValidObjects(fullErrorMessage, [
			'type',
			'headers',
			'failureCode',
			'failureType',
			'message'
		]),
		...buildTestsWithValidObjectKeyValues(fullErrorMessage, 'type', ['err']),
		...buildTestsWithValidObjectKeyValues(fullErrorMessage, 'headers', [
			{},
			{ prop: 'value' }
		]),
		...buildTestsWithValidObjectKeyValues(fullErrorMessage, 'replyAddress', [
			undefined,
			null,
			'Here!'
		]),
		...buildTestsWithValidObjectKeyValues(fullErrorMessage, 'reply', [
			undefined,
			null,
			() => {}
		]),
		...buildTestsWithValidObjectKeyValues(fullErrorMessage, 'failureCode', [
			13,
			25,
			78
		]),
		...buildTestsWithValidObjectKeyValues(fullErrorMessage, 'failureType', [
			'Error',
			'TypeError',
			'UnknownError'
		]),
		...buildTestsWithValidObjectKeyValues(fullErrorMessage, 'message', [
			'Something gone wrong',
			'Cannot transmit message'
		])
	];

	const invalidTestsForErrorMessage: Array<
		TestCase<typeof fullErrorMessage>
	> = [
		...buildTestsWithObjectsMissingRequiredKeys(fullErrorMessage, [
			'type',
			'headers',
			'failureCode',
			'failureType',
			'message'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullErrorMessage, 'type', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullErrorMessage, 'headers', [
			'object'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullErrorMessage, 'replyAddress', [
			'undefined',
			'null',
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullErrorMessage, 'reply', [
			'undefined',
			'null',
			'function'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullErrorMessage, 'failureCode', [
			'number'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullErrorMessage, 'failureType', [
			'string'
		]),
		...buildTestsWithInvalidObjectKeyAtomics(fullErrorMessage, 'message', [
			'string'
		])
	];

	describe('Tests for ErrorMessage', () => {
		testPropType(
			'ErrorMessage',
			errorMessagePropType,
			validTestsForErrorMessage,
			[
				...invalidTestsForErrorMessage,
				...buildTestsWithInvalidObjectKeyValues(fullErrorMessage, 'type', [
					'ping',
					'register',
					'unregister',
					'publish',
					'send',
					'rec'
				])
			]
		);
	});

	describe('Tests for Message', () => {
		testPropType(
			'Message',
			messagePropType,
			[
				...validTestsForPingMessage,
				...validTestsForRegisterMessage,
				...validTestsForUnregisterMessage,
				...validTestsForPublishMessage,
				...validTestsForSendMessage,
				...validTestsForReceiveMessage,
				...validTestsForErrorMessage
			],
			[
				...invalidTestsForPingMessage,
				...invalidTestsForRegisterMessage,
				...invalidTestsForUnregisterMessage,
				...invalidTestsForPublishMessage,
				...invalidTestsForSendMessage,
				...invalidTestsForReceiveMessage,
				...invalidTestsForErrorMessage
			]
		);
	});

	describe('Tests for Callback', () => {
		testPropType(
			'Callback',
			callbackPropType,
			[functionCase],
			[
				undefinedCase,
				nullCase,
				boolCase,
				numberCase,
				stringCase,
				arrayCase,
				objectCase
			]
		);
	});
});
