import { View, ActionButton } from '@adobe/react-spectrum';
import defaultAvatar from '../../../media/default-avatar.png';

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
