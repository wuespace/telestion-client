import { ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Button, Heading, Text } from '@adobe/react-spectrum';

/**
 * Error Boundary to use in storybook stories
 *
 * @param children - the children that get rendered
 *
 * @example
 * ```ts
 * <StorybookErrorBoundary>
 *     <ComponentThatWillThrow />
 * </StorybookErrorBoundary>
 * ```
 */
export function StorybookErrorBoundary({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
	);
}

/**
 * A fallback for an Error Boundary
 *
 * @param error - the error
 * @param resetErrorBoundary - a function to reset the error and re-render the component
 *
 * @example
 * ```ts
 * <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
 * ```
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<>
			<Heading level={2}>
				(Storybook-internal): Component threw an error
			</Heading>
			<Text>
				Component threw an <code>Error</code>:
			</Text>
			<pre>{error.message}</pre>
			<Button variant="cta" onPress={resetErrorBoundary}>
				Re-Render!
			</Button>
		</>
	);
}
