import * as p from './page-functional-component';
import * as w from './widget';
import * as u from './user-config';
import * as a from './auth';

declare global {
	namespace TelestionClient {
		export import Page = p;
		export import Widget = w;
		export import UserConfig = u;
		export import Auth = a;
	}
}

export * from './page-functional-component';
export * from './widget';
export * from './user-config';
export * from './auth';
