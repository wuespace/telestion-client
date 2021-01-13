import { ReactElement, ReactNode, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StateSelector } from 'zustand';

import { PreferencesState, usePreferences } from '../hooks';

// preferences selector
const selector: StateSelector<
	PreferencesState,
	PreferencesState['setValue']
> = state => state.setValue;

/**
 * React Props of {@link TelestionClient}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link TelestionClient}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface TelestionClientProps {
	/**
	 * The title of the application.
	 *
	 * The title can be used with the {@link useTitle} hook
	 * to get a consistent title of the application.
	 */
	title?: string;

	/**
	 * A function that will "wrap" the children into
	 * additional contexts, setups, HOCs, ...
	 *
	 * @param children - the children components
	 * of the {@link TelestionClient} component
	 * @returns a valid react element
	 */
	wrapper?: (children: ReactNode) => ReactElement;

	/**
	 * Additional children given to the Telestion Client.
	 * It renders them in his context.
	 *
	 * @see {@link https://reactjs.org/docs/glossary.html#propschildren}
	 */
	children?: ReactNode;
}

/**
 * The "root" component of a Telestion Client.
 *
 * Every part of a Telestion Client application should be a child
 * of this component.
 *
 * @see {@link TelestionClientProps}
 *
 * @example
 * A very simple Telestion Client
 * ```ts
 * import ReactDOM from 'react-dom';
 *
 * ReactDOM.render(
 * 	<TelestionClient />,
 * 	document.getElementById('root')
 * );
 * ```
 */
export function TelestionClient({
	title = 'Telestion Client',
	wrapper,
	children
}: TelestionClientProps) {
	const update = usePreferences(selector);

	useEffect(() => {
		update('null', 'title', title);
	}, [title, update]);

	return <>{wrapper ? wrapper(children) : children}</>;
}

TelestionClient.propTypes = {
	title: PropTypes.string,
	wrapper: PropTypes.func,
	children: PropTypes.node
};
