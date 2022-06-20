import { ActionButton, View } from '@adobe/react-spectrum';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';

/**
 *
 */
export function DropdownArrow() {
	return (
		<ActionButton isQuiet>
			<View width="size-350" height="size-350">
				<ChevronDown width="100%" height="100%" />
			</View>
		</ActionButton>
	);
}
