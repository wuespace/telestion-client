import { ReactNode } from 'react';
import { State } from 'zustand';

/**
 * A configuration object to customize a dialog
 * created via the {@link DialogState.show} function.
 */
export interface DialogConfig {
	/**
	 * The title of the dialog displayed in the upper left corner.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	title: ReactNode;

	/**
	 * An optional header of the dialog displayed in the upper right corner.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	header?: string | ReactNode;

	/**
	 * The content of the dialog rendered below the title and header
	 * in the center of the dialog.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	content: string | ReactNode;

	/**
	 * An optional footer of the dialog in the lower left corner.
	 * @see {@link https://react-spectrum.adobe.com/react-spectrum/Dialog.html#content}
	 */
	footer?: ReactNode;
}

/**
 * A dialog which is registered in the Telestion Common dialog state.
 *
 * Every dialog has an id which is unique inside the project.
 */
export interface Dialog {
	/**
	 * The unique id of the dialog
	 * given via the {@link DialogState.show} function.
	 */
	id: string;

	/**
	 * The configuration of the dialog
	 * given via the {@link DialogState.show} function.
	 */
	config: DialogConfig;

	/**
	 * When `true`, the dialog is currently open.
	 */
	isOpen: boolean;

	/**
	 * A handler to confirm the opened dialog.
	 */
	onConfirm: () => void;

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
	dialogs: Array<Dialog>;

	/**
	 * Registers and opens a new dialog configured with the specified options.
	 * @param id - the id of the modal, should be unique inside the project
	 * @param config - the specified options to customize the dialog
	 * @returns a Promise which resolves, when the user confirmed
	 * and rejects, when the user canceled the dialog
	 */
	show(id: string, config: DialogConfig): Promise<void>;
}
