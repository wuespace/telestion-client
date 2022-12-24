import { ReactNode } from 'react';
import { State } from 'zustand';

/**
 * A function that provides the current state and a function to change it.
 * It returns a valid React node.
 *
 * @param state - the current state
 * @param setState - a function to partially update the state
 * @returns a valid react node
 *
 * @typeParam T - The type of state to provide to the different components
 */
export type CallableComponent<T> = (
	state: T,
	setState: (partial: Partial<T>) => void
) => ReactNode;

/**
 * A configuration object to customize a dialog
 * created via the {@link DialogState.show} function.
 *
 * @typeParam T - The type of state to provide to the different components
 */
export interface DialogConfig<T> {
	/**
	 * The title of the dialog displayed in the upper-left corner.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	title: ReactNode | CallableComponent<T>;

	/**
	 * An optional header of the dialog displayed in the upper right corner.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	header?: string | ReactNode | CallableComponent<T>;

	/**
	 * The content of the dialog rendered below the title and header
	 * in the center of the dialog.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	content: string | ReactNode | CallableComponent<T>;

	/**
	 * An optional footer of the dialog in the lower left corner.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	footer?: ReactNode | CallableComponent<T>;

	/**
	 * The initial value
	 */
	initialState: T;
}

/**
 * A dialog which is registered in the Telestion Common dialog state.
 *
 * Every dialog has an id which is unique inside the project.
 *
 * @typeParam T - The type of state to provide to the different components
 */
export interface Dialog<T> {
	/**
	 * The unique id of the dialog
	 * given via the {@link DialogState.show} function.
	 */
	id: string;

	/**
	 * The configuration of the dialog
	 * given via the {@link DialogState.show} function.
	 */
	config: DialogConfig<T>;

	/**
	 * When `true`, the dialog is currently open.
	 */
	isOpen: boolean;

	/**
	 * A handler to confirm the opened dialog.
	 * @param final - the final state which the resolved promise returns
	 */
	onConfirm: (final: T) => void;

	/**
	 * A handler to cancel the opened dialog.
	 */
	onCancel: () => void;
}

/**
 * The dialog store and actions of Telestion Client Common.
 *
 * Stores and handles show dialog calls from projects and common itself.
 *
 * @see {@link DialogState.show}
 */
export interface DialogState extends State {
	/**
	 * Stores the currently registered dialogs.
	 * @see {@link Modal}
	 */
	dialogs: Array<Dialog<any>>;

	/**
	 * Registers and opens a new dialog configured with the specified options.
	 * @param id - the id of the modal, should be unique inside the project
	 * @param config - the specified options to customize the dialog
	 * @returns a Promise which resolves with the current state,
	 * when the user confirms and rejects, when the user canceled the dialog
	 *
	 * @typeParam T - The type of state to provide to the different components
	 */
	show<T = undefined>(id: string, config: DialogConfig<T>): Promise<T>;
}
