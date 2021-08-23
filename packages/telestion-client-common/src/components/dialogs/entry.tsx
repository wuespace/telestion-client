import { isValidElement, ReactNode } from 'react';
import { Text } from '@adobe/react-spectrum';
import { CallableComponent } from '../../hooks';

/**
 * React Props of {@link Entry}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link Entry}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface EntryProps<T> {
	/**
	 * The current value of the dialog state.
	 */
	state: T;

	/**
	 * A function to update the dialog state partially.
	 * @param partial - the new partial state
	 */
	setPartial: (partial: Partial<T>) => void;

	/**
	 * When `true` and the {@link EntryProps.children} is a `string`,
	 * it wraps the contents into a react-spectrum {@link @adobe/react-spectrum#Text}.
	 */
	textify?: boolean;

	/**
	 * The dialog config entry from the dialog renderer.
	 */
	children: string | ReactNode | CallableComponent<T>;
}

/**
 * Converts a dialog entry to a valid react component
 * with optional state handling and text wrap.
 *
 * @see {@link Dialog}
 * @see {@link EntryProps}
 *
 * @example
 * ```ts
 * return (
 * 	<Dialog>
 * 		<Heading>
 * 			<Entry state={state} setPartial={setPartial}>
 * 				{config.title}
 * 			</Entry>
 * 		</Heading>
 * 		{config.header && (
 * 			<Content>
 * 				<Entry state={state} setPartial={setPartial} textify>
 * 					{config.header}
 * 				</Entry>
 * 			</Content>
 * 		)}
 * 		<Divider />
 * 	</Dialog>
 * );
 * ```
 */
export function Entry<T>({
	state,
	setPartial,
	textify = false,
	children
}: EntryProps<T>) {
	// the child needs to be wrapped
	if (textify && typeof children === 'string') {
		return <Text>{children}</Text>;
	}

	// the child needs state
	if (typeof children === 'function' && !isValidElement(children)) {
		return children(state, setPartial);
	}

	// the child is something else
	return children;
}
