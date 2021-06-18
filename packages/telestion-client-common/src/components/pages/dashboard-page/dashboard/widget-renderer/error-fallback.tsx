import { FallbackProps } from 'react-error-boundary';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { WidgetErrorMessage } from './widget-error-message';

/**
 * Special component that renders when an error occurs inside a widget.
 * The component generates a widget error message and allows the user to reload the widget.
 *
 * It has a predefined structure based on the react-error-boundary package.
 *
 * @see {@link WidgetErrorMessage}
 * @see {@link react-error-boundary#ErrorBoundary}
 *
 * @example
 * ```ts
 * function MyErrorBoundary() {
 * 	return (
 * 		<ErrorBoundary FallbackComponent={ErrorFallback}>
 * 			<ICanFail />
 * 		</ErrorBoundary>
 * 	);
 * }
 * ```
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<WidgetErrorMessage
			image={<NotFound />}
			message="Internal widget error"
			actions={[
				{
					label: 'Reload widget',
					variant: 'primary',
					action: resetErrorBoundary
				}
			]}
		>
			<p>
				Please try to reload the widget. If the problem persists, contact the
				developers. Error details:
			</p>
			<p>{error.message}</p>
		</WidgetErrorMessage>
	);
}
