/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Text } from '@adobe/react-spectrum';
import { GenericProps, Widget } from '@wuespace/telestion-client-types';

import { OverflowFix } from '../../../../widget-helper';
import { usePropsClipboard } from '../../props-clipboard';
import {
	ConfigContainer,
	ConfigHeader,
	ConfigFooter,
	CopyPasteActions
} from './config';

/**
 * Return type of the {@link useState} hook
 * specified for the {@link GenericProps} state.
 */
export type PropsState = [GenericProps, Dispatch<SetStateAction<GenericProps>>];

/**
 * React Props of {@link ConfigRenderer}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ConfigRenderer}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ConfigRendererProps {
	/**
	 * The actual widget which contains the components and settings.
	 */
	widget: Widget;

	/**
	 * The unique identifier of the widget in the dashboard configuration.
	 */
	id: string;

	/**
	 * The entire props state from {@link useState}.
	 */
	propsState: PropsState;

	/**
	 * Close the configuration mode.
	 */
	onClose: () => void;
}

/**
 * Renders the widget configuration and wrapper with header and footer.
 * It implements the copy and paste for widget properties.
 *
 * @see {@link ConfigRendererProps}
 * @see {@link WidgetRenderer}
 * @see {@link Widget}
 *
 * @example
 * ```tsx
 * // build up state
 * const [inConfig, open, close] = useBooleanState();
 * const propsState = useStoredState(`${id}-${version}`, initialProps || {});
 *
 * return inConfig ? (
 * 	<ConfigRenderer
 * 		widget={widget}
 * 		id={id}
 * 		propsState={propsState}
 * 		onClose={close}
 * 	/>
 * ) : (
 * 	<Content {...propsState[0]} />
 * )
 * ```
 */
export function ConfigRenderer({
	widget,
	id,
	propsState,
	onClose
}: ConfigRendererProps) {
	const { name, title, ConfigControls } = widget;
	const [global, setGlobal] = propsState;
	const [clipboard, setClipboard] = usePropsClipboard(name);
	const [local, setLocal] = useState(global);

	const copy = () => setClipboard(local);

	const paste = useCallback(() => {
		if (clipboard) setLocal(clipboard);
	}, [clipboard]);

	const abort = useCallback(() => {
		setLocal(global);
		onClose();
	}, [global, onClose]);

	const confirm = () => {
		setGlobal(local);
		onClose();
	};

	const update = useCallback((newProps: Partial<GenericProps>) => {
		setLocal(prevState => ({ ...prevState, ...newProps }));
	}, []);

	return (
		<ConfigContainer>
			<ConfigHeader title={title || name} id={id}>
				<CopyPasteActions
					isPasteDisabled={!!clipboard}
					onCopy={copy}
					onPaste={paste}
				/>
			</ConfigHeader>
			<OverflowFix flexShrink={1} flexGrow={1}>
				{ConfigControls ? (
					// @ts-ignore
					<ConfigControls currentProps={local} onUpdate={update} />
				) : (
					<Text>
						Sorry, the widget does not provide any configuration options.
					</Text>
				)}
			</OverflowFix>
			<ConfigFooter onAbort={abort} onConfirm={confirm} />
		</ConfigContainer>
	);
}
