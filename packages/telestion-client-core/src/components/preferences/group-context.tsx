import { createContext, FC, useContext } from 'react';
import { GroupSelector } from '../../model/preferences';

const groupContext = createContext<GroupSelector | null>(null);

export interface GroupContextProps {
	name: GroupSelector;
}

export const GroupContext: FC<GroupContextProps> = ({ name, children }) => (
	<groupContext.Provider value={name}>{children}</groupContext.Provider>
);

export function useGroup(): GroupSelector {
	return useContext(groupContext);
}
