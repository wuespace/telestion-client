import { useEffect, useState } from 'react';

export default function useChannel(
	channel: string,
	onUpdate: (data: unknown) => void
): () => void {
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		onUpdate({
			counter,
			channel
		});
	}, [channel, counter, onUpdate]);

	useEffect(() => {
		const id = setInterval(() => {
			setCounter(prevState => prevState + 1);
		}, 2000);

		return () => {
			clearInterval(id);
		};
	}, [channel, onUpdate]);

	// hat funktioniert
	return () => {};
}
