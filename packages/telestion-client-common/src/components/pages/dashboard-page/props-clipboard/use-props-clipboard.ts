import { useCallback, useContext } from 'react';
import { GenericProps } from '@wuespace/telestion-client-types';
import { ClipboardContext } from './props-clipboard-context';

/**
 * Returns the current clipboard context and a function to update it.
 *
 * @param name - the name of the widget
 *
 * @see {@link ClipboardContext}
 * @see {@link ClipboardContent}
 * @see {@link Widget}
 *
 * @example
 * ```tsx
 * const [props, setProps] = useState<GenericProps>();
 * const [clipboard, setClipboard] = usePropsClipboard(widgetName);
 *
 * const copy = () => setContent(props);
 * const paste = () => {
 * 	if (clipboard) setProps(clipboard);
 * };
 *
 * return (
 * 	<div>
 * 	  <p>Widget: {name}</p>
 * 		<button onClick={copy}>Copy!</button>
 * 		<button onClick={paste}>Paste!</button>
 * 	</div>
 * );
 * ```
 */
export function usePropsClipboard(
	name: string
): [GenericProps | undefined, (props: GenericProps) => void] {
	const [clipboard, setClipboard] = useContext(ClipboardContext);

	return [
		clipboard && clipboard.name === name ? clipboard.props : undefined,
		useCallback(props => setClipboard({ name, props }), [setClipboard, name])
	];
}
