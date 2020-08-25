import ColorScheme from './ColorScheme';

export default interface AppSettings {
	colorScheme: ColorScheme;
}

export type AppSettingsAction = (state: AppSettings) => AppSettings;
export type AppSettingsReducer = (
	state: AppSettings,
	action: AppSettingsAction
) => AppSettings;

export function changeColorScheme(colorScheme: ColorScheme): AppSettingsAction {
	return state => {
		return {
			...state,
			colorScheme
		};
	};
}

export const appSettingsReducer: AppSettingsReducer = (state, action) =>
	action(state);
