import { Flex, Heading, ProgressCircle } from '@adobe/react-spectrum';
import { useDependencyTimeout } from '../../hooks';
import { Undefinable } from '../../lib';

/**
 * React Props of {@link LoadingIndicator}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @typeParam T - the tuple which represents the dependencies to check
 *
 * @see {@link LoadingIndicator}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface LoadingIndicatorProps<T extends readonly any[]> {
	/**
	 * A function to children to display them if all dependencies are defined.
	 * The defined dependencies are given as argument
	 * to the function for later use.
	 *
	 * @example
	 * ```ts
	 * <LoadingIndicator dependencies={['defined']}>
	 * 	{([value]) => <p>Current value: {value}</p>}
	 * </LoadingIndicator>
	 * ```
	 */
	children: /**
	 * @param dependencies - the defined dependencies passed through from
	 * {@link LoadingIndicatorProps.dependencies}
	 */ (...dependencies: [...T]) => JSX.Element | string | number | null;

	/**
	 * The dependencies to check if some of them are undefined.
	 */
	dependencies: [...Undefinable<T>];

	/**
	 * The timeout in milliseconds until the function throws,
	 * if it is 0 it waits indefinitely.
	 */
	timeout?: number;
}

/**
 * Renders a loading indicator if some of the dependencies are not defined.
 * @typeParam T - the tuple which represents the dependencies to check
 *
 * @throws Error - if some dependencies are undefined until timeout
 * and timeout is set
 *
 * @see {@link LoadingIndicatorProps}
 *
 * @example
 * Renders a loading indicator if position is undefined
 * otherwise the child which displays the current position.
 * ```ts
 * const [position, setPosition] = useState<Position>();
 * const [height, setHeight] = useState<number>();
 *
 * return (
 * 	<LoadingIndicator dependencies={[position, height]}>
 * 		{(currentPos, currentHeight) => (
 * 			<p>{currentPos} - {currentHeight}</p>
 * 		)}
 * 	</LoadingIndicator>
 * );
 * ```
 */
export function LoadingIndicator<T extends readonly any[]>({
	children,
	dependencies,
	timeout = 0
}: LoadingIndicatorProps<T>) {
	if (useDependencyTimeout(timeout, dependencies)) {
		return children(...dependencies);
	}

	return (
		<Flex
			width="100%"
			height="100%"
			direction="column"
			justifyContent="center"
			alignItems="center"
		>
			<ProgressCircle aria-label="Loading…" isIndeterminate />
			<Heading level={2}>Loading…</Heading>
		</Flex>
	);
}
