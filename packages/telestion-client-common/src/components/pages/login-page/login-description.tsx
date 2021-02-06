import { ReactElement } from 'react';
import { Text } from '@adobe/react-spectrum';

/**
 * React Props of {@link LoginDescription}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link LoginDescription}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface LoginDescriptionProps {
	/**
	 * The alternative description to use instead of the default one.
	 */
	description?: string;

	/**
	 * Components that completely replace the description
	 * and are rendered instead.
	 */
	children?: ReactElement | Array<ReactElement>;
}

/**
 * The login description component that renders the current login description
 * in the login page.
 *
 * It defaults to:
 *
 * _Please enter the credentials assigned to you by the Ground Station team_
 *
 * and can be overridden by the prop {@link LoginDescriptionProps.description}
 * or can be completely replaced by another component via defined children.
 *
 * **Attention**
 *
 * If children are specified, the overridden description is completely ignored
 * and the children are rendered instead!
 *
 * This component belongs to the {@link LoginPage}
 *
 * @see {@link LoginDescriptionProps}
 * @see {@link LoginPage}
 *
 * @example
 * ```ts
 * function MyLoginPage() {
 * 	return (
 * 		<LoginPage>
 * 			<LoginLogo />
 * 			<LoginTitle />
 * 			<LoginDescription />
 * 			<LoginForm initialServerURL="http://localhost:9870/bridge" />
 * 		</LoginPage>
 * 	);
 * }
 *
 * MyLoginPage.routing = TCLoginPage.routing;
 * ```
 */
export function LoginDescription({
	description,
	children
}: LoginDescriptionProps) {
	if (children) return <>{children}</>;

	return (
		<Text>
			{description ||
				'Please enter the credentials assigned to you by the Ground Station team'}
		</Text>
	);
}
