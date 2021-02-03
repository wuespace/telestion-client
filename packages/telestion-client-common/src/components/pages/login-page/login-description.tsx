import { Text } from '@adobe/react-spectrum';
import { ReactElement } from 'react';

export interface LoginDescriptionProps {
	description?: string;

	children?: ReactElement | Array<ReactElement>;
}

export function LoginDescription({
	description,
	children
}: LoginDescriptionProps) {
	if (children) return children;

	return (
		<Text>
			{description ||
				'Please enter the credentials assigned to you by the Ground Station team'}
		</Text>
	);
}
