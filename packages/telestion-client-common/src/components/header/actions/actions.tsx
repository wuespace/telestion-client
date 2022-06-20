import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveGroup } from '../responsive-group/responsive-group';
import { useBreakpoints } from '../../../hooks/abstractions/use-breakpoints';

/**
 * React Props of {@link Actions}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Actions}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ActionsProps {
	/**
	 * Components or "actions" the header action component should render.
	 *
	 * Typical pre-defined actions are:
	 * - {@link ColorSchemeAction}
	 * - {@link FullscreenAction}
	 * - {@link NotificationAction}
	 * - {@link ActionDivider}
	 */
	children: ReactElement | ReactElement[];
}

/**
 * Part of the Telestion Client Common header.
 *
 * It displays customizable actions
 * which gives the user direct access to the application settings.
 *
 * Predefined and ready-to-use actions are:
 * - {@link ColorSchemeAction}
 * - {@link FullscreenAction}
 * - {@link NotificationAction}
 * - {@link ActionDivider}
 *
 * @see {@link ActionsProps}
 * @see {@link ColorSchemeAction}
 * @see {@link FullscreenAction}
 * @see {@link NotificationAction}
 * @see {@link ActionDivider}
 * @see {@link Header}
 *
 * @example
 * ```ts
 * function AppHeader() {
 * 	return (
 * 		<Header
 * 			right={
 * 				<Actions>
 * 					<ColorSchemeAction />
 * 					<NotificationAction />
 * 				</Actions>
 * 			}
 * 		/>
 * 	);
 * }
 * ```
 */
export function Actions({ children }: ActionsProps) {
	const { isBase, isSm } = useBreakpoints();
	return (
		<ResponsiveGroup condition={isBase || isSm}>{children}</ResponsiveGroup>
	);
}

Actions.propTypes = {
	children: PropTypes.node.isRequired
};
