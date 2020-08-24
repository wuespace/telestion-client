import React, { ReactNode } from 'react';
import useDependencyTimeout from '../hooks/useDependencyTimeout';
import { Flex, Heading, ProgressCircle } from '@adobe/react-spectrum';

interface Props {
	children: () => ReactNode;
	dependencies: any[];
	timeout?: number;
}

/**
 * Renders a loading indicator if some of the dependencies are not defined.
 * @param children a function to children to display if all dependencies are defined
 * @param dependencies dependencies to check for undefined
 * @param timeout optional timeout to throw an error
 * @throws if some dependencies are undefined until timeout and timeout is set
 *
 * @example Render a loading indicator if position is undefined otherwise the position
 * const [position, setPosition] = useState<Position>();
 * return (
 * 	 <LoadingIndicator dependencies={[position]}>
 * 	   {() => (
 * 	     <p>{position}</p>
 * 	   )}
 * 	 </LoadingIndicator>
 * );
 */
export default function LoadingIndicator({
	children,
	dependencies,
	timeout
}: Props) {
	const someAreUndefined = useDependencyTimeout(
		timeout ? timeout : 0,
		dependencies
	);

	if (someAreUndefined) {
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

	return <>{children()}</>;
}
