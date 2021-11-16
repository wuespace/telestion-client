import { ReactNode } from 'react';
import PropTypes from 'prop-types';

/**
 * React Props of {@link Preferences}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Preferences}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface PreferencesProps {
	/**
	 * Usually components of the type {@link Group} and {@link Variable}
	 * to build an application preferences structure.
	 */
	children: ReactNode;
}

/**
 * Wrapper component for {@link Group} and {@link Variable}
 * which defining application preferences and their renderers.
 *
 * @see {@link Group}
 * @see {@link Variable}
 * @see {@link usePreferences}
 * @see {@link PreferencesProps}
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
export function Preferences({ children }: PreferencesProps) {
	// Fix Typescript bad types for JSX by wrapping components in Fragments to hide dumb types
	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{children}</>;
}

Preferences.propTypes = {
	children: PropTypes.node
};
