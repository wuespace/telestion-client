import { EventBus } from '@wuespace/vertx-event-bus';
import { testPropType } from '../../tests/lib';
import { eventBusPropType } from './vertx-event-bus';
import {
	arrayCase,
	boolCase,
	nullCase,
	numberCase,
	objectCase,
	stringCase,
	undefinedCase
} from '../../tests/samples/basic';

describe('Tests for vert.x event bus', () => {
	describe('Tests for EventBus', () => {
		const eventBus = new EventBus('http://255.255.255.255/');

		testPropType(
			'EventBus',
			eventBusPropType,
			[['an event bus instance', eventBus]],
			[
				undefinedCase,
				nullCase,
				numberCase,
				stringCase,
				boolCase,
				objectCase,
				arrayCase
			]
		);

		// cleanup
		eventBus.close();
	});
});
