import { useCallback, useEffect, useRef, useState } from 'react';
import { TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';

import FullScreen from '@spectrum-icons/workflow/FullScreen';
import FullScreenExit from '@spectrum-icons/workflow/FullScreenExit';

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
			>
				{isFullscreen ? <FullScreenExit /> : <FullScreen />}
			</ActionButton>
			<Tooltip>
				{isFullscreen ? 'Leave fullscreen mode' : 'Go into fullscreen mode'}
			</Tooltip>
		</TooltipTrigger>
	);
}
