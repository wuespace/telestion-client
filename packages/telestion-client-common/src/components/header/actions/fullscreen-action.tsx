import { useCallback, useEffect, useRef, useState } from 'react';
import { TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';

import FullScreen from '@spectrum-icons/workflow/FullScreen';
import FullScreenExit from '@spectrum-icons/workflow/FullScreenExit';

/**
 * Part of the header actions.
 *
 * This action lets the user control whether the application gets shown in fullscreen.
 *
 * The user can switch between default window mode and fullscreen mode
 * where the application or browser content is rendered over the entire screen.
 *
 * @see {@link Actions}
 *
 * @example
 * ```ts
 * function MyActions() {
 * 	return (
 * 		<Actions>
 * 			<FullscreenAction />
 * 		</Actions>
 * 	);
 * }
 * ```
 */
export function FullscreenAction() {
	const [isFullscreen, setFullscreenState] = useState(false);
	const documentRef = useRef(document);

	useEffect(() => {
		documentRef.current.onfullscreenchange = () => {
			setFullscreenState(!!documentRef.current.fullscreenElement);
		};
	}, []);

	const toggleFullscreen = useCallback(() => {
		if (isFullscreen) {
			void documentRef.current
				.exitFullscreen()
				.then(() => setFullscreenState(false));
		} else {
			void documentRef.current.documentElement
				.requestFullscreen()
				.then(() => setFullscreenState(true));
		}
	}, [isFullscreen]);

	return (
		<TooltipTrigger>
			<ActionButton
				isDisabled={!documentRef.current.fullscreenEnabled}
				onPress={toggleFullscreen}
				isQuiet
				data-testid="telestionClientFullscreenAction"
			>
				{isFullscreen ? <FullScreenExit /> : <FullScreen />}
			</ActionButton>
			<Tooltip>
				{isFullscreen ? 'Leave fullscreen mode' : 'Go into fullscreen mode'}
			</Tooltip>
		</TooltipTrigger>
	);
}
