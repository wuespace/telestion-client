import { RefObject, useEffect, useRef, useState } from 'react';
import { useBooleanState } from '../../../hooks';

/**
 * The ref type from React-Spectrum refs.
 */
type DOMRefValue = import('@react-types/shared').DOMRefValue;

const clicksNeeded = 4;
const resetDelay = 1500; /* ms */

/**
 * The returned state from the {@link useAppLogoState} hook.
 */
export interface State {
	/**
	 * The ref that should be attached to the component which is clickable.
	 */
	ref: RefObject<DOMRefValue>;

	/**
	 * When `true` render the fixed overlay.
	 */
	isOpen: boolean;

	/**
	 * Closes the overlay.
	 */
	close: () => void;
}

/**
 * Builds and returns the app logo state.
 *
 * @see {@link State}
 *
 * @example
 * ```tsx
 * function AppLogo() {
 * 	const { ref } = useAppLogoState();
 * 	const appLogo = useLogo();
 *
 * 	return (
 * 		<View width="size-400" height="size-400" ref={ref}>
 * 			<Image src={appLogo} alt="Application Logo" objectFit="contain" />
 * 		</View>
 * 	);
 * }
 * ```
 */
export function useAppLogoState(): State {
	const ref = useRef<DOMRefValue>(null);
	const timeoutRef = useRef<any>();
	const [timesClicked, setTimesClicked] = useState(0);
	const [isOpen, open, close] = useBooleanState();

	// activate on enough clicks
	useEffect(() => {
		if (timesClicked >= clicksNeeded) open();
	}, [timesClicked, open]);

	// register event handlers on ref
	useEffect(() => {
		if (!ref.current) return () => {};
		const node = ref.current.UNSAFE_getDOMNode();

		const handle: () => void = () => {
			setTimesClicked(prevState => prevState + 1);
			// rebuild reset timeout
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setTimesClicked(0), resetDelay);
		};

		node.addEventListener('click', handle);
		return () => {
			node.removeEventListener('click', handle);
			// cleanup timeout on unmount
			clearTimeout(timeoutRef.current);
		};
	}, []);

	return { ref, isOpen, close };
}
