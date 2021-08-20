import { ReactElement, ReactNode } from 'react';
import { StateSelector } from 'zustand';
import {
	Button,
	ButtonGroup,
	Content,
	Dialog,
	DialogContainer,
	Divider,
	Footer,
	Heading,
	Text
} from '@adobe/react-spectrum';

import { useDialog } from '../../hooks/stores/use-dialog';
import { DialogState } from '../../hooks/stores/use-dialog.model';

// dialog selector
const selector: StateSelector<DialogState, DialogState['dialogs']> = state =>
	state.dialogs;

/**
 * Wraps the given element into a React Spectrum `<Text>` if it's a string
 * otherwise it returns the given element unmodified.
 * @param element - the element to optionally wrap into a `<Text>`
 * @returns returns the "text-i-fied" version of the element
 *
 * @example
 * ```ts
 * return (
 * 	<Dialog>
 * 		<Heading>{config.title}</Heading>
 * 		{config.header && <Content>{textify(config.header)}</Content>}
 * 		<ButtonGroup>
 * 			<Button variant="secondary">Cancel</Button>
 * 			<Button variant="cta">Confirm</Button>
 * 		</ButtonGroup>
 * 	</Dialog>
 * );
 * ```
 */
function textify(element: string | ReactNode): ReactNode {
	return typeof element === 'string' ? <Text>{element}</Text> : element;
}

/**
 * React Props of {@link ModalContext}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ModalContext}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ModalContextProps {
	/**
	 * The children components which have access to the registered widget
	 * via the {@link useLogo} hook.
	 */
	children: ReactElement | Array<ReactElement>;
}

/**
 * Renders the registered dialogs.
 * @see {@link useDialog}
 *
 * @example
 * ```ts
 * function MyWrapper({ children }: Props) {
 * 	return (
 * 		<ModalContext>
 * 			{children}
 * 		</ModalContext>
 * 	);
 * }
 * ```
 */
export function ModalContext({ children }: ModalContextProps) {
	const dialogs = useDialog(selector);

	return (
		<>
			{children}
			{dialogs.map(({ id, config, isOpen, onCancel, onConfirm }) => (
				<DialogContainer key={id} type="modal" onDismiss={onCancel}>
					{isOpen && (
						<Dialog>
							<Heading>{config.title}</Heading>
							{config.header && <Content>{textify(config.header)}</Content>}
							<Divider />
							<Content>{textify(config.content)}</Content>
							{config.footer && <Footer>{textify(config.footer)}</Footer>}
							<ButtonGroup>
								<Button variant="secondary" onPress={onCancel}>
									Cancel
								</Button>
								<Button variant="cta" onPress={onConfirm}>
									Confirm
								</Button>
							</ButtonGroup>
						</Dialog>
					)}
				</DialogContainer>
			))}
		</>
	);
}
