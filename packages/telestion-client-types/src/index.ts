import * as p from './page-functional-component';
import * as w from './widget';
import * as u from './user-config';

declare global {
	namespace TelestionClient {
		export import Page = p;
		export import Widget = w;
		export import UserConfig = u;
	}
}

export * from './page-functional-component';
export * from './widget';
export * from './user-config';
