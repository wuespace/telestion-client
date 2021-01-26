import { ReactNode, useMemo } from 'react';
import { StateSelector } from 'zustand';
import {
	Content,
	Dialog,
	Divider,
	Heading,
	Grid,
	Text,
	Provider
} from '@adobe/react-spectrum';
import { useStatus } from './use-Status';
import { ColorScheme, ColorSchemeState, useColorScheme } from '../../../hooks';

// color scheme selector
const selector: StateSelector<ColorSchemeState, ColorScheme> = ({
	colorScheme
}) => colorScheme;

export function StatusDialog() {
	const colorScheme = useColorScheme(selector);
	const status = useStatus();

	const items = useMemo(() => {
		const children: Array<ReactNode> = [];

		status.forEach(({ description, state }) => {
			children.push(
				<Text key={`${description}-description`}>{description}</Text>
			);
			children.push(<Text key={`${description}-state`}>{state}</Text>);
		});

		return children;
	}, [status]);

	return (
		<Provider colorScheme={colorScheme !== 'system' ? colorScheme : undefined}>
			<Dialog>
				<Heading>Status</Heading>
				<Divider />
				<Content>
					<Grid
						columns="max-content auto"
						columnGap="size-200"
						rowGap="size-100"
					>
						{items}
					</Grid>
				</Content>
			</Dialog>
		</Provider>
	);
}
