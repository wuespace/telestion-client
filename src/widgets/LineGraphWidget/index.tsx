import React from 'react';
import { View } from '@adobe/react-spectrum';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';
import useDarkColorScheme from '../../hooks/useDarkColorScheme';

export default function MapWidget() {
	const isDark = useDarkColorScheme();

	// TODO: use some pseudo-real data
	const data = [
		{ x: 0, y: 0 },
		{ x: 3, y: 3 },
		{ x: 6, y: 2 }
	];

	return (
		<View width="100%" height="100%" padding="size-100">
			<ResponsiveContainer>
				<LineChart
					data={data}
					margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
				>
					<Line dot={false} isAnimationActive={false} dataKey={'y'} />
					<CartesianGrid
						stroke={isDark ? '#6e6e6e' : '#b3b3b3'}
						strokeDasharray="5 5"
					/>
					<XAxis dataKey={'x'} stroke={isDark ? '#e3e3e3' : '#4b4b4b'} />
					<YAxis dataKey={'y'} stroke={isDark ? '#e3e3e3' : '#4b4b4b'} />
					<Tooltip isUpdateAnimationActive={true} active={true} />
				</LineChart>
			</ResponsiveContainer>
		</View>
	);
}
