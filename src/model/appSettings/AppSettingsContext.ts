import { createContext, Dispatch } from 'react';

import AppSettings, { AppSettingsAction } from './AppSettings';
import defaultAppSettings from './defaultAppSettings';

const AppSettingsContext = createContext<
	[AppSettings, Dispatch<AppSettingsAction>]
>([defaultAppSettings, () => {}]);

export default AppSettingsContext;
