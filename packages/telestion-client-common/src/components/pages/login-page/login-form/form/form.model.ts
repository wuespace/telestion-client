/**
 * Defines an object with user information
 * entered in the {@link Form} component.
 */
export interface Submission {
	/**
	 * The backend server URL.
	 */
	serverUrl: string;

	/**
	 * The username to log in with.
	 */
	username: string;

	/**
	 * The password to authenticate with.
	 */
	password: string;
}

/**
 * React Props of {@link Form}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Form}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface FormProps {
	/**
	 * Indicates that the page is currently loading and user input is not allowed.
	 */
	isLoading: boolean;

	/**
	 * An event that gets called if the user submits
	 * his entered login information.
	 *
	 * @param submission - the entered user information
	 */
	onSubmit: (submission: Submission) => void;

	/**
	 * The initial value of the server url text field
	 * in the {@link Form} component.
	 */
	initialServerURL?: string;

	/**
	 * The initial value of the username text file
	 * in the {@link Form} component.
	 */
	initialUsername?: string;
}
