import { createContext, Dispatch } from 'react';

import defaultAppSettings from './defaultAppSettings';
import AppSettings, { AppSettingsAction } from '../model/AppSettings';

const AppSettingsContext = createContext<
	[AppSettings, Dispatch<AppSettingsAction>]
>([defaultAppSettings, () => {}]);

export default AppSettingsContext;
