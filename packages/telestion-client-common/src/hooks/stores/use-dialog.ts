import create, { UseBoundStore } from 'zustand';
import { Dialog, DialogConfig, DialogState } from './use-dialog.model';

/**
 * Returns the dialog state and action to interact with.
 * A selector can be defined to pick out parts of the store.
 * If correctly set up, the function only triggers a rerender
 * if the selected values have changed.
 *
 * For more information about state management in Zustand,
 * take a look at their {@link https://github.com/pmndrs/zustand | GitHub page}.
 *
 * @param selector - optional selector function
 * which picks the specified elements out of the store
 * @param equalityFn - optional equality function
 * to check for state updates on the picked elements
 * @returns the picked elements in the selector function
 *
 * @see {@link DialogState}
 * @see {@link https://github.com/pmndrs/zustand}
 * @see {@link UseBoundStore}
 * @see {@link zustand#shallow}
 *
 * @example
 * ```ts
 * import { StateSelector } from 'zustand';
 * import {
 * 	useDialog,
 * 	DialogState
 * } from '@wuespace/telestion-client-common';
 *
 * // selector does not depend on scope, so it's better to define it outside
 * // to not re-declare it on every render
 * const selector: StateSelector<DialogState, DialogState['show']> =
 * 	state => state.show;
 *
 * function MyComponent() {
 * 	const show = useUserConfig(selector);
 *
 * 	const openDialog = () => {
 * 		show('my-dialog', { title: 'My Dialog', content: 'Hello World' })
 * 			.then(() => alert("Confirmed"))
 * 			.catch(() => alert("Canceled"));
 * 	};
 *
 * 	return <button onClick={openDialog}>Show Dialog</button>;
 * }
 * ```
 */
export const useDialog: UseBoundStore<DialogState> = create<DialogState>(
	(set, get) => ({
		dialogs: [],
		show<T>(id: string, config: DialogConfig<T>) {
			const dialogs = get().dialogs.filter(dialog => dialog.id !== id);

			return new Promise<T>((resolve, reject) => {
				const close: () => void = () =>
					set({
						dialogs: get().dialogs.map(dialog =>
							dialog.id === id ? { ...dialog, isOpen: false } : dialog
						)
					});

				const newDialog: Dialog<T> = {
					id,
					config,
					isOpen: true,
					onConfirm: final => {
						close();
						resolve(final);
					},
					onCancel: () => {
						close();
						reject();
					}
				};
				set({ dialogs: [...dialogs, newDialog] });
			});
		}
	})
);

/**
 * Shows a new dialog configured with the specified options.
 * @param id - the id of the modal, should be unique inside the project
 * @param config - the specified options to customize the dialog
 * @returns a Promise which resolves, when the user confirmed
 * and rejects, when the user canceled the dialog
 *
 * @typeParam T - The type of state to provide to the different components
 *
 * @example
 * ```ts
 * import { showDialog } from '@wuespace/telestion-client-common';
 *
 * function MyComponent() {
 * 	const openDialog = () => {
 * 		showDialog('my-dialog', { title: 'My Dialog', content: 'Hello World' })
 * 			.then(() => alert("Confirmed"))
 * 			.catch(() => alert("Canceled"));
 * 	};
 *
 * 	return <button onClick={openDialog}>Show Dialog</button>;
 * }
 * ```
 */
export function showDialog<T = undefined>(
	id: string,
	config: DialogConfig<T>
): Promise<T> {
	return useDialog.getState().show(id, config);
}
