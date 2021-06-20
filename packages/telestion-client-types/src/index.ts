import * as j from './json-serializable';
import * as p from './pages/page-functional-component';
import * as w from './widgets/widget';
import * as u from './widgets/user-config';
import * as a from './auth';
import * as c from './context-menu';
import * as e from './preferences';
import * as n from './notification';
import * as v from './vertx-event-bus';
import * as s from './spectrum-color';

declare global {
	namespace TelestionClientTypes {
		export import JsonSerializable = j.JsonSerializable;
		export import Page = p;
		export import Widget = w;
		export import UserConfig = u;
		export import Auth = a;
		export import ContextMenu = c;
		export import Preferences = e;
		export import Notification = n;
		export import VertxEventBus = v;
		export import SpectrumColor = s;
	}
}

export * from './json-serializable';
export * from './pages/page-functional-component';
export * from './widgets/widget';
export * from './widgets/user-config';
export * from './auth';
export * from './context-menu';
export * from './preferences';
export * from './notification';
export * from './vertx-event-bus';
export * from './spectrum-color';
