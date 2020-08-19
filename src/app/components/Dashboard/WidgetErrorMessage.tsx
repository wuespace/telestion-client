import React, { ReactNode } from 'react';
import {
	Content,
	Heading,
	IllustratedMessage,
	View,
	Button
} from '@adobe/react-spectrum';
import { SpectrumButtonProps } from '@react-types/button';

interface Action {
	label: string;
	variant: SpectrumButtonProps['variant'];
	action: () => void;
}

interface Props {
	image: ReactNode;
	message: string;
	children: ReactNode;
	actions?: Array<Action>;
}

export default function WidgetErrorMessage({
	image,
	message,
	children,
	actions
}: Props) {
	return (
		<View
			width="100%"
			height="100%"
			padding="size-100"
			backgroundColor="gray-200"
		>
			<IllustratedMessage>
				{image}
				<Heading>{message}</Heading>
				<Content>{children}</Content>
				{actions && (
					<Content>
						{actions.map(action => (
							<Button isQuiet={true} variant={action.variant} onPress={action.action}>
								{action.label}
							</Button>
						))}
					</Content>
				)}
			</IllustratedMessage>
		</View>
	);
}
