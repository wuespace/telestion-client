import { ReactElement, ReactNode } from 'react';
import {
	View,
	IllustratedMessage,
	Heading,
	Content,
	Button
} from '@adobe/react-spectrum';
import { SpectrumButtonProps } from '@react-types/button';

export interface Action {
	label: string;
	variant: SpectrumButtonProps['variant'];
	action: () => void;
}

export interface WidgetErrorMessageProps {
	image: ReactElement;
	message: string;
	actions?: Array<Action>;
	children: ReactNode;
}

export function WidgetErrorMessage({
	image,
	message,
	actions,
	children
}: WidgetErrorMessageProps) {
	return (
		<View
			width="100%"
			height="100%"
			padding="size-100"
			backgroundColor="gray-100"
			borderRadius="regular"
		>
			<IllustratedMessage>
				{image}
				<Heading>{message}</Heading>
				<Content>{children}</Content>
				{actions && (
					<Content>
						{actions.map(action => (
							<Button
								key={`${action.label}-${action.variant}`}
								isQuiet
								variant={action.variant}
								onPress={action.action}
							>
								{action.label}
							</Button>
						))}
					</Content>
				)}
			</IllustratedMessage>
		</View>
	);
}
