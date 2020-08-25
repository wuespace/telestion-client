import { useContext } from 'react';
import AppSettingsContext from '../lib/AppSettingsContext';

export default function useAppSettings() {
	return useContext(AppSettingsContext);
}
