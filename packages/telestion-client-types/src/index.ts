import * as j from './json-serializable';
import * as p from './pages/page-functional-component';
import * as w from './widgets/widget';
import * as u from './widgets/user-config';
import * as a from './auth';
import * as e from './preferences';

declare global {
	namespace TelestionClient {
		export import JsonSerializable = j;
		export import Page = p;
		export import Widget = w;
		export import UserConfig = u;
		export import Auth = a;
		export import Preferences = e;
	}
}

export * from './json-serializable';
export * from './pages/page-functional-component';
export * from './widgets/widget';
export * from './widgets/user-config';
export * from './auth';
export * from './preferences';
