import * as j from './json-serializable';
import * as w from './widget';

declare global {
	namespace TelestionClient {
		export import Widget = w;
		export import JsonSerializable = j.JsonSerializable;
	}
}

export * from './json-serializable';
export * from './widget';
