import { ReactNode, useMemo } from 'react';
import { StateSelector } from 'zustand';
import {
	Content,
	Dialog,
	Divider,
	Heading,
	Grid,
	Text,
	Provider
} from '@adobe/react-spectrum';
import { useStatus } from './use-status';
import { ColorScheme, ColorSchemeState, useColorScheme } from '../../../hooks';

// color scheme selector
const selector: StateSelector<ColorSchemeState, ColorScheme> = ({
	colorScheme
}) => colorScheme;

/**
 * Renders a status dialog containing the current application state
 * (for example, the event bus connection status and the logged in username).
 *
 * The entries are defined in the {@link useStatus} hook.
 *
 * This component contains a {@link @adobe/react-spectrum#Dialog}
 * which can be controlled using a {@link @adobe/react-spectrum#DialogContainer}.
 *
 * Typically, it opens when the status button in the {@link AvatarMenu} gets clicked.
 *
 * @see {@link useStatus}
 *
 * @example
 * ```ts
 * function MyAccountControls() {
 * 	// dialog open state
 * 	const [isOpen, setOpen] = useState(false);
 *
 * 	const openDialog = useCallback(() => setOpen(true), []);
 * 	const closeDialog = useCallback(() => setOpen(false), []);
 *
 * 	return (
 * 		<>
 * 			<MenuTrigger>
 * 				<AvatarButton />
 * 				<AvatarMenu onStatusClick={openDialog} />
 * 			</MenuTrigger>
 *
 * 			<DialogContainer type="modal" isDismissable onDismiss={closeDialog}>
 * 				{isOpen && <StatusDialog />}
 * 			</DialogContainer>
 * 		</>
 * 	);
 * }
 * ```
 */
export function StatusDialog() {
	const colorScheme = useColorScheme(selector);
	const status = useStatus();

	const items = useMemo(() => {
		const children: Array<ReactNode> = [];

		status.forEach(({ description, state }) => {
			children.push(
				<Text key={`${description}-description`}>{description}</Text>
			);
			children.push(<Text key={`${description}-state`}>{state}</Text>);
		});

		return children;
	}, [status]);

	return (
		<Provider colorScheme={colorScheme !== 'system' ? colorScheme : undefined}>
			<Dialog>
				<Heading>Status</Heading>
				<Divider />
				<Content>
					<Grid
						columns="max-content auto"
						columnGap="size-200"
						rowGap="size-100"
					>
						{items}
					</Grid>
				</Content>
			</Dialog>
		</Provider>
	);
}
