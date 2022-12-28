import { ReactElement, ReactNode } from 'react';
import {
	View,
	IllustratedMessage,
	Heading,
	Content,
	Button,
	SpectrumButtonProps
} from '@adobe/react-spectrum';

/**
 * An action that a user can take in a {@link WidgetErrorMessage}.
 */
export interface Action {
	/**
	 * The label of the action button.
	 */
	label: string;

	/**
	 * The variant of the action button.
	 */
	variant: SpectrumButtonProps['variant'];

	/**
	 * The event that gets triggered when a user presses the action button
	 * associated with this action.
	 */
	action: () => void;
}

/**
 * React Props of {@link WidgetErrorMessage}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link WidgetErrorMessage}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface WidgetErrorMessageProps {
	/**
	 * The image that renders in the illustrated message.
	 */
	image: ReactElement;

	/**
	 * The heading in the illustrated message.
	 */
	message: string;

	/**
	 * Additional actions the user can take.
	 *
	 * @see {@link Action}
	 */
	actions?: Array<Action>;

	/**
	 * The illustrated message's content.
	 */
	children: ReactNode;
}

/**
 * Renders a customizable illustrated message from React Spectrum
 * specialized for widget errors.
 *
 * The image, message, and content can be modified.
 *
 * The user can then choose from one of the actions passed via the `actions` property.
 *
 * @see {@link WidgetErrorMessageProps}
 *
 * @example
 * ```ts
 * function MyWidgetError() {
 * 	return (
 * 		<WidgetErrorMessage>
 * 			image={<NotFound />}
 * 			message="Internal widget error"
 * 			actions={[
 * 				{
 * 					label: 'Reload widget',
 * 					variant: 'primary',
 * 					action: resetErrorBoundary
 * 				}
 * 			]}
 * 		>
 * 			<p>
 * 				Please try to reload the widget. If the problem persists, contact the
 * 				developers. Error details:
 * 			</p>
 * 			<p>{error.message}</p>
 * 		</WidgetErrorMessage>
 * 	);
 * }
 * ```
 */
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
			data-testid="telestionClientWidgetErrorMessage"
		>
			<IllustratedMessage>
				{image}
				<Heading data-testid="telestionClientWidgetErrorMessage-heading">
					{message}
				</Heading>
				<Content data-testid="telestionClientWidgetErrorMessage-content">
					{children}
				</Content>
				{actions && (
					<Content data-testid="telestionClientWidgetErrorMessage-actions">
						{actions.map(action => (
							<Button
								key={`${action.label}-${action.variant}`}
								variant={action.variant}
								onPress={action.action}
								data-testid="telestionClientWidgetErrorMessage-action"
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
