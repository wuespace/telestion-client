import React from 'react';
import { Image } from '@adobe/react-spectrum';

import src from './placeholder.png';

export default function MapWidget() {
	return <Image src={src} alt="Map" width="100%" height="100%" />;
}
