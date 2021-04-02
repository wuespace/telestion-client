import { Message } from '@wuespace/telestion-client-types';

export const sampleMessages: Array<readonly [Message, string]> = [
	[{ type: 'ping' }, '{"type":"ping"}'],
	[
		{ type: 'register', address: 'some-address', headers: {} },
		'{"type":"register","address":"some-address","headers":{}}'
	],
	[
		{ type: 'unregister', address: 'other-address', headers: {} },
		'{"type":"unregister","address":"other-address","headers":{}}'
	],
	[
		{
			type: 'publish',
			address: 'broadcast',
			body: 'thebox',
			headers: {}
		},
		'{"type":"publish","address":"broadcast","body":"thebox","headers":{}}'
	]
];
