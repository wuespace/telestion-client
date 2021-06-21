import { View, ButtonGroup, Button, Divider } from '@adobe/react-spectrum';

/**
 * React Props of {@link ConfigFooter}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ConfigFooter}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ConfigFooterProps {
	/**
	 * Gets called, when the user presses the abort button.
	 */
	onAbort: () => void;

	/**
	 * Gets called, when the user presses the confirm button.
	 */
	onConfirm: () => void;
}

/**
 * Renders the widget configuration footer.
 *
 * It contains the confirm and cancel/abort actions
 * the user can take to exit the widget configuration mode.
 *
 * @see {@link ConfigFooterProps}
 * @see {@link ConfigContainer}
 * @see {@link WidgetRenderer}
 *
 * @example
 * ```tsx
 * function WidgetRenderer() {
 * 	return inConfig ? (
 * 		<ConfigContainer>
 * 			{...elements}
 * 			<ConfigFooter />
 * 		</ConfigContainer>
 * 	) : (
 * 		<Content {...props}>
 * 	);
 * }
 * ```
 */
export function ConfigFooter({ onAbort, onConfirm }: ConfigFooterProps) {
	return (
		<>
			<Divider size="S" />
			<View flexShrink={0} width="100%" padding="size-200">
				<ButtonGroup align="end" width="100%">
					<Button variant="secondary" onPress={onAbort}>
						Cancel
					</Button>
					<Button variant="cta" onPress={onConfirm} autoFocus>
						Confirm
					</Button>
				</ButtonGroup>
			</View>
		</>
	);
}
