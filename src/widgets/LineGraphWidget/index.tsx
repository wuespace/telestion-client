import React from 'react';
import { View, Image } from '@adobe/react-spectrum';

import src from './placeholder.png';

export default function MapWidget() {
	return (
		<View
			padding="size-100"
			overflow="hidden"
		>
			<Image src={src} alt="Linegraph" width="100%" height="100%" />
		</View>
	);
}
