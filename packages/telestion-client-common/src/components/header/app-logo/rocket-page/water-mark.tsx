import Logo from '../../../../media/logo.svg';
import './water-mark.css';

/**
 * Renders the WüSpace e. V. water mark in lower right corner.
 *
 * @see {@link RocketPage}
 *
 * @example
 * ```tsx
 * function RocketPage() {
 * 	return (
 * 		<div className="container">
 * 			<WaterMark />
 * 		</div>
 * 	);
 * }
 * ```
 */
export function WaterMark() {
	return (
		<div className="water-mark">
			<div>
				<p>Part of Telestion</p>
				<p>A project by WüSpace e. V.</p>
			</div>
			<div>
				<img src={Logo} alt="WüSpace e. V. Logo" />
			</div>
		</div>
	);
}
