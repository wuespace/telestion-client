import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { GroupSelector } from '@wuespace/telestion-client-types';

import { GroupContext } from './group-context';

/**
 * React Props of {@link Group}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Group}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface GroupProps {
	/**
	 * The name of the group of variables.
	 */
	name: GroupSelector;

	/**
	 * Usually components of the type {@link Variable}
	 * to build an application preferences structure.
	 */
	children: ReactNode;
}

/**
 * Defines a group of variables which are typically {@link Variable} components.
 * It gives {@link Variable} a group context.
 *
 * @see {@link Variable}
 * @see {@link Preferences}
 * @see {@link usePreferences}
 * @see {@link GroupProps}
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
export function Group({ name, children }: GroupProps) {
	return <GroupContext name={name}>{children}</GroupContext>;
}

Group.propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.node
};
