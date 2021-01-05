import { useEffect } from 'react';
import PropTypes from 'prop-types';
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
export const Variable = ({ name, initialValue, children }: VariableProps) => {
	const { setRenderer, setValue } = usePreferences(prefSelector, shallow);
	const group = useGroup();

	useEffect(() => {
		if (initialValue) {
			// if not in group context, use global scope
			setValue(group, name, initialValue);
		}
	}, [group, name, initialValue, setValue]);

	useEffect(() => {
		// if not in group context, use global scope
		setRenderer(group, name, children);
	}, [group, name, children, setRenderer]);

	return null;
};

Variable.propTypes = {
	name: PropTypes.string.isRequired,
	initialValue: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
		PropTypes.bool,
		PropTypes.object,
		PropTypes.array
	]),
	children: PropTypes.func.isRequired
};
