import { useContext } from 'react';
import AppSettingsContext from '../lib/AppSettingsContext';

/**
 * Returns the current app settings
 * and a dispatch function to change the app settings.
 * @returns a tuple of the current app settings and a dispatch function
 *
 * @see AppSettings
 *
 * @example ```
 * const [appSettings, dispatch] = useAppSettings();
 *
 * const handleClick = () => {
 *	 dispatch(changeColorScheme('dark'));
 * };
 *
 * return <button onClick={handleClick}>Change to dark color scheme</button>;
 * ```
 */
export default function useAppSettings() {
	return useContext(AppSettingsContext);
}
