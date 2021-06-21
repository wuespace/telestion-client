import { Key, ReactNode } from 'react';
import { Item, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';

/**
 * React Props of {@link TooltipItem}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link TooltipItem}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface TooltipItemProps {
	key: Key;

	'aria-label': string;

	tooltip: ReactNode;

	children: ReactNode;
}

/**
 * Wraps a tooltip around a react-spectrum item.
 *
 * @see {@link TooltipItemProps}
 *
 * @example
 * ```tsx
 * return (
 * 	<ActionGroup>
 * 		<TooltipItem
 * 			key="copy"
 * 			aria-label="Copy properties to clipboard"
 * 			tooltip="Copy"
 * 		>
 * 			<Copy />
 * 		</TooltipItem>
 * 		<TooltipItem
 * 			key="paste"
 * 			aria-label="Paste properties from clipboard"
 * 			tooltip="Paste"
 * 		>
 * 			<Paste />
 * 		</TooltipItem>
 * 	</ActionGroup>
 * );
 * ```
 */
export function TooltipItem({
	key,
	'aria-label': label,
	tooltip,
	children
}: TooltipItemProps) {
	return (
		<TooltipTrigger>
			<Item key={key} aria-label={label}>
				{children}
			</Item>
			<Tooltip>{tooltip}</Tooltip>
		</TooltipTrigger>
	);
}
