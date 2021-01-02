import { FC, FunctionComponent, ReactElement } from 'react';
import { GroupContext } from './group-context';
import { GroupSelector } from '../../model/preferences';
import { VariableProps } from './variable';

type Child = ReactElement<VariableProps, FunctionComponent<VariableProps>>;

export interface GroupProps {
	/**
	 * the name of the group of variables
	 */
	name: GroupSelector;

	/**
	 * A list of {@link Variable} components
	 */
	children: Child | Array<Child>;
}

/**
 * Defines a group of variables which are typically {@link Variable} components.
 */
export const Group: FC<GroupProps> = ({ name, children }) => (
	<GroupContext name={name}>{children}</GroupContext>
);
