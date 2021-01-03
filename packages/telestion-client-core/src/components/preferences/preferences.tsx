import { FC, FunctionComponent, ReactElement } from 'react';
import PropTypes from 'prop-types';
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
const Preferences: FC<PreferencesProps> = ({ children }) => <>{children}</>;

Preferences.propTypes = {
	children: PropTypes.any
};

export { Preferences };
