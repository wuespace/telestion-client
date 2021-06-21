import { RocketPage } from './rocket-page/rocket-page';
import './fixed-overlay.css';

/**
 * React Props of {@link FixedOverlay}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link FixedOverlay}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface FixedOverlayProps {
	isOpen: boolean;

	onClose: () => void;
}

/**
 * Renders a fixed overlay over the entire application
 * containing the rocket page.
 *
 * @see {@link FixedOverlayProps}
 * @see {@link RocketPage}
 *
 * @example
 * ```tsx
 * function MyComponent() {
 * 	const [isOpen, open, close] = useBooleanState();
 *
 * 	return (
 * 		<Wrapper>
 * 			<NormalContent />
 * 			<FixedOverlay isOpen={isOpen} onClose={close} />
 * 		</Wrapper>
 * 	);
 * }
 * ```
 */
export function FixedOverlay({ isOpen, onClose }: FixedOverlayProps) {
	return isOpen ? (
		<div className="fixed-overlay">
			<RocketPage onClose={onClose} />
		</div>
	) : null;
}
