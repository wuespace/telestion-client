import { FC, FunctionComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
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
const Group: FC<GroupProps> = ({ name, children }) => (
	<GroupContext name={name}>{children}</GroupContext>
);

Group.propTypes = {
	name: PropTypes.oneOfType([PropTypes.string, null]).isRequired,
	children: PropTypes.any
};

export { Group };
