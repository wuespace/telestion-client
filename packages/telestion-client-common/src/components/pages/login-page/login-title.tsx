import { Heading } from '@adobe/react-spectrum';
import { useTitle } from '@wuespace/telestion-client-core';

export function LoginTitle() {
	const title = useTitle();
	return <Heading level={2}>{title}</Heading>;
}
