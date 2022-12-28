/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { getLogger } from '@wuespace/telestion-client-core';
import { GenericProps, Widget } from '@wuespace/telestion-client-types';

import { usePropsClipboard } from '../../props-clipboard';
import {
	ConfigContainer,
	ConfigHeader,
	ConfigFooter,
	CopyPasteActions
} from './config';

const logger = getLogger('Props Clipboard');

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
 * It implements the copy and paste functionality for widget properties.
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

	const copy = () => {
		logger.info(`Copy to clipboard from widget ${id}`);
		setClipboard(local);
	};

	const paste = useCallback(() => {
		if (clipboard) {
			logger.info(`Paste clipboard content to widget ${id}`);
			setLocal(clipboard);
		}
	}, [clipboard, id]);

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
					isPasteDisabled={!clipboard}
					onCopy={copy}
					onPaste={paste}
				/>
			</ConfigHeader>
			<Flex flex={1} minHeight={0} direction="column">
				<View
					flex={1}
					overflow="auto"
					data-testid="telestionClientConfigRenderer-content"
				>
					{ConfigControls ? (
						// @ts-ignore
						<ConfigControls currentProps={local} onUpdate={update} />
					) : (
						<View
							padding="size-200"
							data-testid="telestionClientConfigRenderer-noConfigControls"
						>
							<em>
								Sorry, the widget does not provide any configuration options.
							</em>
						</View>
					)}
				</View>
			</Flex>
			<ConfigFooter onAbort={abort} onConfirm={confirm} />
		</ConfigContainer>
	);
}
