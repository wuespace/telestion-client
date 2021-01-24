import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionButton } from '@adobe/react-spectrum';

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
		<ActionButton
			isDisabled={!documentRef.current.fullscreenEnabled}
			onPress={toggleFullscreen}
		>
			{isFullscreen ? <FullScreenExit /> : <FullScreen />}
		</ActionButton>
	);
}
