import { createContext, ReactNode, useContext } from 'react';
import PropTypes from 'prop-types';
import { GroupSelector } from '../../model/preferences';

const groupContext = createContext<GroupSelector | null>(null);

export interface GroupContextProps {
	name: GroupSelector;

	children: ReactNode;
}

export const GroupContext = ({ name, children }: GroupContextProps) => (
	<groupContext.Provider value={name}>{children}</groupContext.Provider>
);

GroupContext.propTypes = {
	name: PropTypes.string,
	children: PropTypes.node
};

export function useGroup(): GroupSelector {
	return useContext(groupContext) ?? 'null';
}
