import { Button } from '@adobe/react-spectrum';
import './return-button.css';

/**
 * React Props of {@link ReturnButton}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ReturnButton}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ReturnButtonProps {
	/**
	 * Gets called when the user presses the return button.
	 */
	onClose: () => void;
}

/**
 * Renders the return button in the lower left corner.
 *
 * @see {@link ReturnButtonProps}
 * @see {@link RocketPage}
 *
 * @example
 * ```tsx
 * function RocketPage() {
 * 	return (
 * 		<div className="container">
 * 			<Rocket />
 * 			<ReturnButton />
 * 		</div>
 * 	);
 * }
 * ```
 */
export function ReturnButton({ onClose }: ReturnButtonProps) {
	return (
		<div className="return-button-container">
			<Button variant="secondary" onPress={onClose}>
				Return
			</Button>
		</div>
	);
}
