/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import { View } from '@adobe/react-spectrum';
import { ViewProps } from '@react-types/view';

export interface OverflowFixProps extends ViewProps {
	children: ReactNode;
}

export function OverflowFix({ children, ...viewProps }: OverflowFixProps) {
	return (
		<View width="100%" height="100%" position="relative" {...viewProps}>
			<View
				position="absolute"
				top={0}
				right={0}
				bottom={0}
				left={0}
				overflow="auto"
			>
				{children}
			</View>
		</View>
	);
}
