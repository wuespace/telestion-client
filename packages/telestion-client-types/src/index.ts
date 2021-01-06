import * as j from './json-serializable';
import * as p from './page-functional-component';
import * as w from './widget';

declare global {
	namespace TelestionClient {
		export import JsonSerializable = j.JsonSerializable;
		export import Page = p;
		export import Widget = w;
	}
}

export * from './json-serializable';
export * from './page-functional-component';
export * from './widget';
