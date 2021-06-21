/* eslint-disable @typescript-eslint/ban-ts-comment,react/jsx-props-no-spreading,max-lines-per-function */
import { useRef } from 'react';
import { animated, config, to, useSpring } from '@react-spring/web';
import { useDrag } from 'react-use-gesture';

import { distance, scale } from './math';
import './rocket.css';

const minDistance = 0;
const resetTimeout = 1000;

const defaultPos = {
	pos: [0, 0],
	immediate: false,
	config: config.default
};

const defaultAngle = {
	angle: 0,
	config: config.wobbly
};

/**
 * Renders the react-spring rocket.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 * 	return (
 * 		<div className="rocket-pane">
 * 			<Rocket />
 * 		</div>
 * 	);
 * }
 * ```
 */
export function Rocket() {
	const timeoutRef = useRef<any>(null);

	const [{ pos }, posSpring] = useSpring(() => defaultPos);
	const [{ angle }, angleSpring] = useSpring(() => defaultAngle);

	const bind = useDrag(
		({
			xy,
			previous,
			down,
			movement: movePos,
			velocity: cursorSpeed,
			direction
		}) => {
			const reset = () => {
				angleSpring.start(defaultAngle);
				posSpring.start(defaultPos);
			};

			const velocity = scale(direction, cursorSpeed);
			const promise = posSpring.start({
				pos: movePos,
				immediate: down,
				config: { velocity, decay: true }
			})[0];

			if (distance(xy, previous) > minDistance || !down) {
				angleSpring.start({ angle: Math.atan2(direction[0], -direction[1]) });
			}

			void promise.then(() => {
				if (!down) {
					timeoutRef.current = setTimeout(reset, resetTimeout);
				} else {
					clearTimeout(timeoutRef.current);
				}
			});
		},
		{ initial: () => pos.get() }
	);

	return (
		<animated.div
			{...bind()}
			className="rocket"
			style={{
				transform: to(
					[pos, angle],
					// @ts-ignore
					([x, y], a) =>
						`translate3d(${x}px,${y}px,0) rotate(${a as number}rad)`
				)
			}}
		/>
	);
}
