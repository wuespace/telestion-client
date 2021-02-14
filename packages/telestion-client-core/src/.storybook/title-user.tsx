import { useTitle } from '../hooks';

export function TitleUser() {
	const title = useTitle();

	return <p>Title: {title}</p>;
}
