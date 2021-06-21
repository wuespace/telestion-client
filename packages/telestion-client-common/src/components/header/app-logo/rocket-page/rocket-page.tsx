/* eslint-disable react/jsx-props-no-spreading */
import { animated, to, useSpring } from '@react-spring/web';
import { useMove } from 'react-use-gesture';

import { Rocket } from './rocket';
import { ReturnButton } from './return-button';
import { WaterMark } from './water-mark';
import './rocket-page.css';

const scalingFactor = 40;
const calcX = (px: number) => (window.innerWidth / 2 - px) / scalingFactor;
const calcY = (py: number) => (window.innerHeight / 2 - py) / scalingFactor;

const defaultDeltaPos = { pos: [0, 0] };

/**
 * React Props of {@link RocketPage}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link RocketPage}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface RocketPageProps {
	/**
	 * Gets called when the user presses the return button.
	 */
	onClose: () => void;
}

/**
 * Renders the fullscreen rocket page.
 *
 * @see {@link RocketPageProps}
 *
 * @example
 * ```tsx
 * function FixedOverlay({ isOpen, onClose }: Props) {
 * 	return isOpen ? (
 * 		<div className="fixed-overlay">
 * 			<RocketPage onClose={onClose} />
 * 		</div>
 * 	) : null;
 * }
 * ```
 */
export function RocketPage({ onClose }: RocketPageProps) {
	const [{ pos }, api] = useSpring(() => defaultDeltaPos);

	const bind = useMove(({ xy: [px, py] }) =>
		api({ pos: [calcX(px), calcY(py)] })
	);

	return (
		<div className="container" {...bind()}>
			<animated.div
				className="background"
				style={{
					scale: 1.1,
					transform: to([pos], ([x, y]) => `translate(${x}px,${y}px)`)
				}}
			/>
			<div className="rocket-pane">
				<Rocket />
			</div>
			<ReturnButton onClose={onClose} />
			<WaterMark />
		</div>
	);
}
