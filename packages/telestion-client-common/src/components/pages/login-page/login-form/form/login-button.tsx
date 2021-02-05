import { Button, ProgressCircle } from '@adobe/react-spectrum';

/**
 * React Props of {@link LoginButton}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link LoginButton}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface LoginButtonProps {
	/**
	 * Disables the button so the user can no longer press it
	 * and trigger an event.
	 */
	isDisabled: boolean;

	/**
	 * Indicates that the page is currently loading and user input is allowed.
	 * The button is disabled and renders a loading indicator.
	 */
	isLoading: boolean;

	/**
	 * An event that gets triggered if the user presses the button
	 * if it is enabled and **not** loading.
	 */
	onPress: () => void;
}

/**
 * The login button component that renders a react spectrum button
 * typically below the login form and accepts a user press.
 *
 * If it is disabled, the user no longer can trigger
 * the {@link LoginButtonProps.onPress} event.
 *
 * If it is loading, the user no longer can trigger
 * the {@link LoginButtonProps.onPress} event
 * but instead of disabling the button
 * it renders a indeterminate loading indicator.
 *
 * @see {@link LoginButtonProps}
 *
 * @example
 * ```ts
 * function MyForm() {
 * 	const [isLoading, setIsLoading] = useState(false);
 *
 * 	const handlePress = () => {
 * 		setIsLoading(true);
 * 		alert('Someone pressed the login button!');
 * 		setTimeout(() => setIsLoading(false), 1000);
 * 	};
 *
 * 	return (
 * 		<LoginButton
 * 			isDisabled={false}
 * 			isLoading={isLoading}
 * 			onPress={handlePress}
 * 		/>;
 * 	);
 * }
 * ```
 */
export function LoginButton({
	isDisabled,
	isLoading,
	onPress
}: LoginButtonProps) {
	return (
		<Button
			variant="cta"
			onPress={onPress}
			isDisabled={isDisabled || isLoading}
		>
			{isLoading ? (
				<ProgressCircle aria-label="Logging in…" isIndeterminate />
			) : (
				'Login'
			)}
		</Button>
	);
}
