import { DialogContainer } from '@adobe/react-spectrum';
import { ReactElement } from 'react';
import { StateSelector } from 'zustand';

import { useDialog, DialogState } from '../../hooks';
import { Dialog } from '../dialogs/dialog';

// dialog selector
const selector: StateSelector<DialogState, DialogState['dialogs']> = state =>
	state.dialogs;

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
						<Dialog config={config} onConfirm={onConfirm} onCancel={onCancel} />
					)}
				</DialogContainer>
			))}
		</>
	);
}
