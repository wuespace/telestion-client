import React, { useState, useEffect } from 'react';
import { Provider, defaultTheme, Button } from '@adobe/react-spectrum';

export default function App() {
	return (
		<Provider theme={defaultTheme}>
			<Button variant="cta" onPress={() => alert('Hey there')}>
				Hello React Spectrum!
			</Button>
		</Provider>
	);
}
