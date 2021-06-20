import {
	CSSProperties,
	ReactNode,
	useCallback,
	useMemo,
	useState
} from 'react';
import { Section } from '@wuespace/telestion-client-types';

import { useBooleanState } from '../../../hooks';
import {
	ContextMenuContext,
	ContextMenuContextState
} from './context-menu-context';

/**
 * Default style for the context menu container.
 */
const defaultStyle: CSSProperties = {
	position: 'absolute',
	zIndex: 10000,
	top: '0px',
	left: '0px'
};

/**
 * React Props of {@link ContextMenuProvider}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ContextMenuProvider}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ContextMenuProviderProps {
	/**
	 * A function that provides state and style to a component
	 * which renders the menu structure and handles the user inputs.
	 *
	 * @param sections - the sections that the menu component should display
	 * @param style - the style of the menu container
	 * (contains the absolute styling)
	 * @param isOpen - is `true` when the menu should be displayed
	 * @param close - a function to call when the menu should close
	 */
	menu: (
		sections: Section[],
		style: CSSProperties,
		isOpen: boolean,
		close: () => void
	) => ReactNode;

	/**
	 * The children components which have access to the context menu context
	 * via the {@link ContextMenuWrapper} component.
	 */
	children: ReactNode;
}

/**
 * The provider is the container element for the application context menu.
 * It provides the context and states to subsequent context menu wrappers
 * lower in the tree and handles the context menu logic.
 *
 * It is by default provided via the {@link CommonWrapper} element.
 * If you prefer to setup your application manually,
 * please wrap your components in this provider function
 * to enable access to the context menu via the {@link ContextMenuWrapper}.
 *
 * This component requires a menu that should render the context menu.
 *
 * @see {@link ContextMenuProviderProps}
 * @see {@link ContextMenuWrapper}
 * @see {@link CommonWrapper}
 *
 * @example
 * ```tsx
 * ContextMenuProviderProps['menu'] = (
 * 	sections,
 * 	style,
 * 	isOpen,
 * 	close
 * ) => <Menu sections={sections} style={style} isOpen={isOpen} onClose={close} />;
 *
 * function App() {
 *	return (
 *		<ContextMenuProvider menu={menu}>
 *			{...componentsContainingWrappers}
 *		</ContextMenuProvider>
 *	);
 * }
 * ```
 */
export function ContextMenuProvider({
	children,
	menu
}: ContextMenuProviderProps) {
	const [style, setStyle] = useState<CSSProperties>(defaultStyle);
	const [isOpen, open, close] = useBooleanState();
	const [sections, setSections] = useState<Section[]>([]);

	const call = useCallback<ContextMenuContextState['call']>(
		(toRender, position) => {
			setSections(toRender);
			setStyle({
				...defaultStyle,
				top: `${position[1]}px`,
				left: `${position[0]}px`
			});
			open();
		},
		[open]
	);

	const state = useMemo<ContextMenuContextState>(
		() => ({
			sections: [],
			call
		}),
		[call]
	);

	return (
		<ContextMenuContext.Provider value={state}>
			{children}
			{menu(sections, style, isOpen, close)}
		</ContextMenuContext.Provider>
	);
}
