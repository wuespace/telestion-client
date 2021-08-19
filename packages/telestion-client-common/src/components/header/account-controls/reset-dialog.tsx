import { StateSelector } from 'zustand';
import {
	Button,
	ButtonGroup,
	Content,
	Dialog,
	Divider,
	Heading,
	Provider,
	Text
} from '@adobe/react-spectrum';
import { ColorScheme, ColorSchemeState, useColorScheme } from '../../../hooks';

// color scheme selector
const selector: StateSelector<ColorSchemeState, ColorScheme> = ({
	colorScheme
}) => colorScheme;

/**
 * React Props of {@link ResetDialog}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ResetDialog}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ResetDialogProps {
	/**
	 * An event that triggers when the user presses the confirm dialog button.
	 */
	onConfirm: () => void;

	/**
	 * An event that triggers when the user presses the cancel dialog button.
	 */
	onCancel: () => void;
}

/**
 * Renders the reset configuration dialog containing the confirmation
 * whether the user really wants to reset his configuration.
 *
 * This component contains a {@link @adobe/react-spectrum#Dialog}
 * which can be controlled using a {@link @adobe/react-spectrum#DialogContainer}.
 *
 * Typically, it opens when the reset configuration button
 * in the {@link AvatarMenu} gets clicked.
 *
 * @example
 * ```ts
 * function MyAccountControls() {
 * 	// dialog open state
 * 	const [isOpen, setOpen] = useState(false);
 *
 * 	const openDialog = useCallback(() => setOpen(true), []);
 * 	const cancel = useCallback(() => setOpen(false), []);
 * 	const confirm = useCallback(() => {
 * 		setOpen(false);
 * 		// reset configuration
 * 	}, []);
 *
 * 	return (
 * 		<>
 * 			<MenuTrigger>
 * 				<AvatarButton />
 * 				<AvatarMenu onStatusClick={openDialog} />
 * 			</MenuTrigger>
 *
 * 			<DialogContainer type="modal" onDismiss={cancel}>
 * 				{isOpen && <ResetDialog onCancel={cancel} onConfirm={confirm} />}
 * 			</DialogContainer>
 * 		</>
 * 	);
 * }
 * ```
 */
export function ResetDialog({ onCancel, onConfirm }: ResetDialogProps) {
	const colorScheme = useColorScheme(selector);

	return (
		<Provider
			colorScheme={colorScheme !== 'system' ? colorScheme : undefined}
			isQuiet={false}
		>
			<Dialog>
				<Heading>Reset configuration</Heading>
				<Divider />
				<Content>
					<Text>Would you really like to reset your configuration?</Text>
				</Content>
				<ButtonGroup>
					<Button variant="secondary" onPress={onCancel}>
						Cancel
					</Button>
					<Button variant="cta" onPress={onConfirm}>
						Confirm
					</Button>
				</ButtonGroup>
			</Dialog>
		</Provider>
	);
}
