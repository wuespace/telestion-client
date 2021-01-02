import { FC, useEffect } from 'react';
import { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';

import { useGroup } from './group-context';
import { PreferenceState, usePreferences } from '../../hooks';
import { PrefRenderer, PrefSelector, PrefValue } from '../../model/preferences';

const prefSelector: StateSelector<
	PreferenceState,
	{
		setValue: PreferenceState['setValue'];
		setRenderer: PreferenceState['setRenderer'];
	}
> = state => ({ setValue: state.setValue, setRenderer: state.setRenderer });

export interface VariableProps {
	/**
	 * the name of the preference
	 */
	name: PrefSelector;

	/**
	 * the initial value of the preference
	 */
	initialValue?: PrefValue;

	/**
	 * the renderer function for preference
	 */
	children: PrefRenderer;
}

/**
 * Defines a renderer for a preference.
 *
 * If it is wrapped in the {@link Group} component,
 * the renderer will be registered for
 * the preference in that group otherwise for the preference in the global scope.
 *
 * @see {@link PreferencesStore}
 */
export const Variable: FC<VariableProps> = ({
	name,
	initialValue,
	children
}) => {
	const { setRenderer, setValue } = usePreferences(prefSelector, shallow);
	const group = useGroup();

	useEffect(() => {
		// if not in group context, use global scope
		setValue(group ? group : null, name, initialValue);
	}, [group, name, initialValue]);

	useEffect(() => {
		// if not in group context, use global scope
		setRenderer(group ? group : null, name, children);
	}, [group, name, children]);

	return null;
};
