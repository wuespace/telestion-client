import { ReactNode } from 'react';

/**
 * a type that only allows JSON serializable data
 *
 * @see {@link JSON.parse}
 * @see {@link JSON.stringify}
 */
type JsonSerializable =
	| number
	| string
	| boolean
	| { [key: string]: JsonSerializable }
	| Array<JsonSerializable>;

/**
 * Defines the basic prop-type of Widget component.
 *
 * @see {@link JsonSerializable}
 */
export type BasePropType = JsonSerializable;

/**
 * Specifies the most generic properties that a Widget component can have.
 *
 * @see {@link BasePropType}
 * @see {@link BaseRendererProps}
 *
 * @example
 * Initialization of basic, advanced and invalid properties
 * ```ts
 * const myProps: GenericProps = {
 * 	basic: 'Where is the box?',
 * 	advanced: {
 * 		part1: 'Test it!',
 * 		part2: false,
 * 		part3: 3.14
 * 	},
 * 	invalid: () => console.log('Ohh...') // not allowed
 * };
 * ```
 */
export interface GenericProps {
	[key: string]: BasePropType;
}

/**
 * Specifies the most generic type
 * a Widget component and a ConfigControls component can have.
 *
 * @typeParam P - additional props for the Widget renderer component
 * (see example below)
 *
 * @see {@link ReactNode}
 * @see {@link Widget}
 *
 * @example
 * Common usage
 * ```ts
 * import { ReactNode } from 'react';
 *
 * interface WidgetProps extends GenericProps {
 * 	type: 'basic' | 'advanced';
 * }
 *
 * interface RendererProps extends BaseRendererProps<WidgetProps> {}
 *
 * function Widget({ title, type }: RendererProps): ReactNode {
 * 	return (
 * 		<div>
 * 			<p>Title: {title}</p>
 * 			<p>Type: {type}</p>
 * 		</div>
 * 	);
 * }
 *
 * export const myWidget: Widget<WidgetProps> = {
 * 	name: 'My Widget',
 * 	Widget: Widget
 * };
 * ```
 */
export type GenericComponent<
	P extends Record<string, unknown> = Record<string, unknown>
> = (props: P) => ReactNode;

/**
 * Defines the props that are always available to Widget component
 * and are not changeable via the ConfigControls component.
 *
 * @see {@link BaseRendererProps}
 * @see {@link Widget}
 */
export interface GlobalRendererProps extends GenericProps {
	/**
	 * the title of the Widget instance on the dashboard
	 *
	 * @see {@link WidgetDefinition.title}
	 *
	 * @example
	 * A very simple widget
	 * ```ts
	 * import { ReactNode } from 'react';
	 *
	 * function Widget({ title, type }: BaseRendererProps): ReactNode {
	 *   return <p>Title: {title}</p>;
	 * }
	 *
	 * export const verySimpleWidget: Widget<WidgetProps> = {
	 *   name: 'Very simple Widget',
	 *   Widget: Widget
	 * };
	 * ```
	 */
	title: string;
}

/**
 * These are the most basic renderer props
 * that a Widget renderer component can have.
 * It is extensible via a generic type
 * to add more props to the Widget renderer component.
 *
 * @typeParam P - additional props for the Widget renderer component
 *
 * @see {@link GenericProps}
 * @see {@link GlobalRendererProps}
 * @see {@link Widget}
 *
 * @example
 * A very simple widget
 * ```ts
 * import { ReactNode } from 'react';
 *
 * function Widget({ title, type }: BaseRendererProps): ReactNode {
 * 	return <p>Title: {title}</p>;
 * }
 *
 * export const verySimpleWidget: Widget<WidgetProps> = {
 * 	name: 'Very simple Widget',
 * 	Widget: Widget
 * };
 * ```
 *
 * @example
 * Extended widget
 * ```ts
 * import { ReactNode } from 'react';
 *
 * interface WidgetProps extends GenericProps {
 * 	type: 'basic' | 'advanced';
 * }
 *
 * interface RendererProps extends BaseRendererProps<WidgetProps> {}
 *
 * function Widget({ title, type }: RendererProps): ReactNode {
 * 	return (
 * 		<div>
 * 			<p>Title: {title}</p>
 * 			<p>Type: {type}</p>
 * 		</div>
 * 	);
 * }
 *
 * export const myWidget: Widget<WidgetProps> = {
 * 	name: 'My Widget',
 * 	Widget: Widget
 * };
 * ```
 */
export type BaseRendererProps<P extends GenericProps = GenericProps> = P &
	GlobalRendererProps;

/**
 * These are props for the ConfigControls widget.
 * that a Widget renderer component can have.
 * It is extensible via a generic type
 * to add more props that are also used at the Widget renderer component.
 *
 * @typeParam P - additional props for the Widget renderer component
 *
 * @see {@link GenericProps}
 * @see {@link BaseRendererProps}
 * @see {@link Widget}
 *
 * @example
 * Very simple ConfigControls
 * ```ts
 * import { ReactNode } from 'react';
 *
 * interface WidgetProps extends GenericProps {
 * 	value: string;
 * }
 *
 * interface RendererProps extends BaseRendererProps<WidgetProps> {}
 *
 * interface ConfigControlsProps extends BaseConfigControlsProps<WidgetProps> {}
 *
 * function Widget({ value }: RendererProps): ReactNode {
 * 	return <p>Value: {value}</p>;
 * }
 *
 * function ConfigControls({  }
 * ```
 */
export interface BaseConfigControlsProps<P extends GenericProps = GenericProps>
	extends Record<string, unknown> {
	/**
	 * the current props values of the widget
	 * which can be changed with
	 * {@link BaseConfigControlsProps.onUpdate | onUpdate}
	 */
	currentProps: P;

	/**
	 * Updates the values of the props of the widget.
	 * @param newProps - new props that are merged or replaced
	 * with the current props to build the new props for the widget to use
	 *
	 * @example
	 * Update the props in a ConfigControls component
	 * ```ts
	 * function ConfigControls({
	 *   currentProps, onUpdate
	 * }: ConfigControlsProps): ReactNode {
	 *   // local state to not "flood" global store with changes (performance)
	 *   const [value, setValue] = useState(currentProps.value);
	 *
	 *   return (
	 *     <div>
	 *       <input type="text" value={value} onChange={event => setValue(event.target.value)} />
	 *       <button onClick={() => onUpdate({ value })} />
	 *     </div>
	 *   );
	 * }
	 * ```
	 */
	onUpdate: (newProps: Partial<P>) => void;
}

/**
 * An "entire" widget definition ready to export and use.
 * It contains a name for reference, a Widget component that will be rendered
 * and an optional ConfigControls component to change Widget component props.
 *
 * @typeParam P - additional props for the Widget renderer component
 *
 * @see {@link Widget.name}
 * @see {@link Widget.Widget}
 * @see {@link Widget.ConfigControls}
 *
 * @example
 * A very simple widget
 * ```ts
 * import { Widget } from './widget';
 * import { ConfigControls } from './config-controls';
 *
 * export const myWidget: Widget = {
 * 	name: 'My Awesome Widget',
 * 	Widget: Widget,
 * 	ConfigControls: ConfigControls
 * }
 * ```
 */
export interface Widget<P extends GenericProps = GenericProps> {
	/**
	 * the name of the widget
	 *
	 * It is a selector to reference the widget
	 * and will be shown in the application.
	 */
	name: string;
	/**
	 * the Widget component implementation as React Component
	 *
	 * @see {@link BaseRendererProps}
	 * @see {@link GlobalRendererProps}
	 * @see {@link GenericComponent}
	 */
	Widget: GenericComponent<BaseRendererProps<P>>;
	/**
	 * the ConfigControls component implementation as React Component
	 *
	 * @see {@link BaseConfigControlsProps}
	 * @see {@link GenericComponent}
	 */
	ConfigControls?: GenericComponent<BaseConfigControlsProps<P>>;
}
