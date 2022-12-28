import { useCallback, useState } from 'react';
import {
	Button,
	ButtonGroup,
	Content,
	Dialog as RSDialog,
	Divider,
	Footer,
	Heading
} from '@adobe/react-spectrum';
import { DialogConfig } from '../../hooks';
import { Entry } from './entry';

/**
 * React Props of {@link Dialog}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Dialog}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface DialogProps<T> {
	/**
	 * The configuration of the dialog
	 * given via the {@link DialogState.show} function.
	 */
	config: DialogConfig<T>;

	/**
	 * A handler to confirm the opened dialog.
	 * @param final - the final state which the resolved promise return
	 */
	onConfirm: (final: T) => void;

	/**
	 * A handler to cancel the opened dialog.
	 */
	onCancel: () => void;
}

/**
 * Renders the custom dialog for the dialog context.
 *
 * @see {@link DialogContext}
 * @see {@link DialogProps}
 *
 * @example
 * ```ts
 * const dialog: Dialog = {...};
 * const { config, isOpen, onCancel, onConfirm } = dialog;
 *
 * return (
 * 	<DialogContainer type="modal" onDismiss={onCancel}>
 * 		{isOpen && (
 * 			<Dialog config={config} onConfirm={onConfirm} onCancel={onCancel} />
 * 		)}
 * 	</DialogContainer>
 * );
 * ```
 */
export function Dialog<T>({ config, onConfirm, onCancel }: DialogProps<T>) {
	const [state, setState] = useState(config.initialState);

	const setPartial = useCallback<(partial: Partial<T>) => void>(
		partial => setState(prevState => ({ ...prevState, ...partial })),
		[]
	);

	return (
		<RSDialog data-testid="telestionClientDialog">
			<Heading data-testid="telestionClientDialog-title">
				<Entry state={state} setPartial={setPartial}>
					{config.title}
				</Entry>
			</Heading>
			{config.header && (
				<Content data-testid="telestionClientDialog-header">
					<Entry state={state} setPartial={setPartial} textify>
						{config.header}
					</Entry>
				</Content>
			)}
			<Divider />
			<Content data-testid="telestionClientDialog-content">
				<Entry state={state} setPartial={setPartial} textify>
					{config.content}
				</Entry>
			</Content>
			{config.footer && (
				<Footer data-testid="telestionClientDialog-footer">
					<Entry state={state} setPartial={setPartial} textify>
						{config.footer}
					</Entry>
				</Footer>
			)}
			<ButtonGroup data-testid="telestionClientDialog-buttons">
				<Button
					variant="secondary"
					onPress={onCancel}
					data-testid="telestionClientDialog-button--cancel"
				>
					Cancel
				</Button>
				<Button
					variant="cta"
					onPress={() => onConfirm(state)}
					data-testid="telestionClientDialog-button--confirm"
				>
					Confirm
				</Button>
			</ButtonGroup>
		</RSDialog>
	);
}
