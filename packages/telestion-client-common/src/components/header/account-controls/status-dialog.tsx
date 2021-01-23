import { ReactNode, useMemo } from 'react';
import {
	Content,
	Dialog,
	Divider,
	Heading,
	Grid,
	Text
} from '@adobe/react-spectrum';
import { useStatus } from './use-Status';

export function StatusDialog() {
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
		<Dialog>
			<Heading>Status</Heading>
			<Divider />
			<Content>
				<Grid columns="max-content auto" columnGap="size-200" rowGap="size-100">
					{items}
				</Grid>
			</Content>
		</Dialog>
	);
}
