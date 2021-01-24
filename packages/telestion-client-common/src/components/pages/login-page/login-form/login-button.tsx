import { Button, ProgressCircle } from '@adobe/react-spectrum';

export interface LoginButtonProps {
	isLoading: boolean;

	onPress: () => void;
}

export function LoginButton({ isLoading, onPress }: LoginButtonProps) {
	return (
		<Button variant="cta" onPress={onPress} isDisabled={isLoading}>
			{isLoading ? (
				<ProgressCircle aria-label="Logging in…" isIndeterminate />
			) : (
				'Login'
			)}
		</Button>
	);
}
