import { Key, useCallback } from 'react';
import {
	ActionGroup,
	Item,
	TooltipTrigger,
	Tooltip
} from '@adobe/react-spectrum';
import Copy from '@spectrum-icons/workflow/Copy';
import Paste from '@spectrum-icons/workflow/Paste';

/**
 * React Props of {@link CopyPasteActions}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link CopyPasteActions}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface CopyPasteActionsProps {
	/**
	 * When `true`, the paste operation is disabled.
	 */
	isPasteDisabled: boolean;

	/**
	 * Gets called, when the user presses the copy action button.
	 */
	onCopy: () => void;

	/**
	 * Gets called, when the user presses the paste action button.
	 */
	onPaste: () => void;
}

/**
 * Renders the copy and paste action in the widget configuration header.
 * The paste option is disabled if the clipboard content is currently empty.
 *
 * @see {@link CopyPasteActionsProps}
 * @see {@link ConfigHeader}
 * @see {@link ConfigRenderer}
 *
 * @example
 * ```tsx
 * <View flexShrink={0} width="100%" paddingX="size-200" paddingY="size-100">
 * 	<Flex
 * 		direction="row"
 * 		width="100%"
 * 		justifyContent="space-between"
 * 		alignItems="center"
 * 	>
 * 		<Heading
 * 			flexGrow={0}
 * 			level={3}
 * 			margin="size-200"
 * 			marginBottom="size-100"
 * 		>
 * 			{title}
 * 		</Heading>
 *
 * 		<CopyPasteActions onCopy={onCopy} onPaste={onPaste} />
 * 	</Flex>
 * </View>
 * ```
 */
export function CopyPasteActions({
	isPasteDisabled,
	onCopy,
	onPaste
}: CopyPasteActionsProps) {
	const handle = useCallback(
		(key: Key) => (key === 'paste' ? onPaste() : onCopy()),
		[onCopy, onPaste]
	);

	return (
		<ActionGroup
			isQuiet
			density="compact"
			onAction={handle}
			disabledKeys={isPasteDisabled ? ['paste'] : []}
		>
			<TooltipTrigger>
				<Item key="copy" aria-label="Copy properties to clipboard">
					<Copy />
				</Item>
				<Tooltip>Copy</Tooltip>
			</TooltipTrigger>
			<TooltipTrigger>
				<Item key="paste" aria-label="Paste properties from clipboard">
					<Paste />
				</Item>
				<Tooltip>Paste</Tooltip>
			</TooltipTrigger>
		</ActionGroup>
	);
}
