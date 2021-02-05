import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@adobe/react-spectrum';

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
 * which gives the user direct access the application settings.
 *
 * Predefined and ready-to-use actions are:
 * - {@link ColorSchemeAction}
 * - {@link FullscreenAction}
 * - {@link NotificationAction}
 * - {@link ActionDivider}
 *
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
	return (
		<Flex direction="row" gap="size-50">
			{children}
		</Flex>
	);
}

Actions.propTypes = {
	children: PropTypes.node.isRequired
};
