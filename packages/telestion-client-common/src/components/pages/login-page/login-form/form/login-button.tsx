import { Button, ProgressCircle } from '@adobe/react-spectrum';

export interface LoginButtonProps {
	isDisabled: boolean;

	isLoading: boolean;

	onPress: () => void;
}

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
