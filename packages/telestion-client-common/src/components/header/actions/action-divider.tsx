import { Divider } from '@adobe/react-spectrum';

/**
 * Part of the header actions.
 *
 * This is a special action
 * where the actions around this action are divided via a vertical bar.
 *
 * The action is useful grouping registered actions into subgroups
 * for a better overview.
 *
 * This is also specified in the Adobe Spectrum Design:
 * https://spectrum.adobe.com/page/headers/#Collapsing-Action-Buttons
 *
 * @see {@link https://spectrum.adobe.com/page/headers/#Collapsing-Action-Buttons}
 * @see {@link Actions}
 *
 * @example
 * ```ts
 * function MyActions() {
 * 	return (
 * 		<Actions>
 * 			<NotificationAction />
 * 			<ActionDivider />
 * 			<ColorSchemeAction />
 * 		</Actions>
 * 	);
 * }
 * ```
 */
export function ActionDivider() {
	return <Divider orientation="vertical" size="S" />;
}
