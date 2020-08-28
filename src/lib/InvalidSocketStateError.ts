export default class InvalidSocketStateError extends Error {
	constructor(expectedState: string, actualState: string) {
		super(
			`Invalid socket state: Expected state: ${expectedState}, actual state: ${actualState}`
		);
		Object.setPrototypeOf(this, InvalidSocketStateError.prototype);
	}
}
