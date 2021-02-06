import { View, ActionButton } from '@adobe/react-spectrum';
import defaultAvatar from '../../../media/default-avatar.png';

/**
 * Renders an action button with a placeholder avatar image inside.
 *
 * Typically used with the {@link AvatarMenu} in a
 * {@link @adobe/react-spectrum#MenuTrigger}
 * to control the menu with the avatar button.
 *
 * @see {@link AvatarMenu}
 *
 * @example
 * ```ts
 * function MyAccountControls() {
 * 	return (
 * 		<MenuTrigger>
 * 			<AvatarButton />
 * 			<AvatarMenu />
 * 		</MenuTrigger>
 * 	);
 * }
 * ```
 */
export function AvatarButton() {
	return (
		<ActionButton>
			<View width="size-350" height="size-350">
				<img
					src={defaultAvatar}
					alt="Avatar Symbol"
					style={{ borderRadius: '50%', width: '100%', height: '100%' }}
				/>
			</View>
		</ActionButton>
	);
}
