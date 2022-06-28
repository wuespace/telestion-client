import { ActionButton, View } from '@adobe/react-spectrum';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';

/**
 * Action Button with a down arrow icon that can be used to trigger
 * a {@link MenuTrigger}.
 *
 * @example
 * ```ts
 * export function DropdownActions({children}) {
 *     return (
 *     		<MenuTrigger>
 * 				<DropdownArrow />
 * 				<DropdownMenu>{children}</DropdownMenu>
 * 			</MenuTrigger>
 *     );
 * }
 * ```
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
