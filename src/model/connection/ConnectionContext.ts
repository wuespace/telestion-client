import { createContext, Dispatch } from 'react';

import Connection, { ConnectionAction } from './Connection';
import initialConnection from './initialConnection';

const ConnectionContext = createContext<
	[Connection, Dispatch<ConnectionAction>]
>([initialConnection, () => {}]);

export default ConnectionContext;
