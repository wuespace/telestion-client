import { createContext, ReactNode, useContext } from 'react';
import PropTypes from 'prop-types';
import { GroupSelector } from '@wuespace/telestion-client-types';

// React context for the Variable component
const groupContext = createContext<GroupSelector | null>(null);

/**
 * React Props of {@link GroupContext}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link GroupContext}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface GroupContextProps {
	/**
	 * The name of the group the context should have.
	 */
	name: GroupSelector;

	/**
	 * All children which can access the stored group selector
	 * via {@link useGroup}.
	 */
	children: ReactNode;
}

/**
 * Wraps its children into a group context
 * accessible via the {@link useGroup} hook.
 *
 * @see {@link useGroup}
 * @see {@link usePreferences}
 * @see {@link GroupContextProps}
 *
 * @example
 * ```ts
 * interface Props {
 *   name: GroupSelector;
 *   children: ReactNode;
 * }
 *
 * function MyGroupWrapper({ name, children }: Props) {
 * 	return (
 * 		<GroupContext name={name}>
 * 			{children}
 * 		</GroupContext>
 * 	);
 * }
 * ```
 */
export function GroupContext({ name, children }: GroupContextProps) {
	return <groupContext.Provider value={name}>{children}</groupContext.Provider>;
}

GroupContext.propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

/**
 * Accesses the group name stored in the group context
 * the component is wrapped into.
 * If the context is not available `'null'` is returned instead
 * to signalise a global variable context.
 *
 * @see {@link GroupContext}
 * @see {@link usePreferences}
 *
 * @example
 * ```ts
 * function GroupContextTester() {
 * 	const groupName = useGroup();
 *	return <p>Current Group Context: {groupName}</p>;
 * }
 * ```
 */
export function useGroup(): GroupSelector {
	return useContext(groupContext) ?? 'null';
}
