import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StateSelector } from 'zustand';
import shallow from 'zustand/shallow';
import {
	PrefRenderer,
	PrefSelector,
	PrefValue
} from '@wuespace/telestion-client-types';

import { useGroup } from './group-context';
import { PreferencesState, usePreferences } from '../../hooks';

// preference selector
const selector: StateSelector<
	PreferencesState,
	{
		setValue: PreferencesState['setValue'];
		setRenderer: PreferencesState['setRenderer'];
	}
> = state => ({ setValue: state.setValue, setRenderer: state.setRenderer });

/**
 * React Props of {@link Variable}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Variable}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface VariableProps {
	/**
	 * The name of the preference.
	 */
	name: PrefSelector;

	/**
	 * The initial value of the preference.
	 */
	initialValue?: PrefValue;

	/**
	 * The renderer function for the preference.
	 */
	children: PrefRenderer;
}

/**
 * Component to define a preference for the application
 * and a renderer for this preference.
 *
 * If it is wrapped in the {@link Group} component,
 * the renderer will be registered for
 * the preference in that group
 * otherwise for the preference in the global scope.
 *
 * @see {@link Group}
 * @see {@link Preferences}
 * @see {@link usePreferences}
 * @see {@link VariableProps}
 *
 * @example
 * ```ts
 * function MyPreferences() {
 * 	return (
 * 		<Preferences>
 * 			<Variable name="myPref">
 * 				{(value, setValue) => (
 * 					<input value={value} onChange={event => setValue(event.target.value)} />
 * 				)}
 * 			</Variable>
 * 			<Group name="SomeGroup">
 * 				<Variable name="groupedPref">
 * 					{(value, setValue) => (
 * 						<input value={value} onChange={event => setValue(event.target.value)} />
 * 					)}
 * 				</Variable>
 * 			</Group>
 * 		</Preferences>
 * 	);
 * }
 * ```
 */
export function Variable({ name, initialValue, children }: VariableProps) {
	const { setRenderer, setValue } = usePreferences(selector, shallow);
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

	// this component intentionally returns nothing
	return null;
}

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
