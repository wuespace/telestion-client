import { FC, FunctionComponent, ReactElement } from 'react';
import { GroupProps } from './group';
import { VariableProps } from './variable';

type Child =
	| ReactElement<GroupProps, FunctionComponent<GroupProps>>
	| ReactElement<VariableProps, FunctionComponent<VariableProps>>;

export interface PreferencesProps {
	children: Child | Array<Child>;
}

/**
 * Wrapper component for {@link Group} and {@link Variable}
 * which defining renderer for application preferences.
 */
export const Preferences: FC<PreferencesProps> = ({ children }) => (
	<>{children}</>
);
