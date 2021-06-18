import { GenericProps } from './widget';

/**
 * Defines a widget placeholder in a dashboard container.
 *
 * This is done via the
 * {@link https://css-tricks.com/snippets/css/complete-guide-grid/ | CSS Grid system}.
 *
 * @see {@link Widget}
 * @see {@link Dashboard}
 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
 *
 * @example
 * A very simple widget definition for a dashboard
 * ```ts
 * const myWidgetDef: WidgetDefinition = {
 * 	width: 2,
 * 	height: 4,
 * 	widgetName: 'myWidget',
 * 	initialProps: {
 * 		value: 'The Box'
 * 	}
 * }
 * ```
 */
export interface WidgetDefinition {
	/**
	 * A unique identifier which represents this specific widget.
	 */
	id: string;

	/**
	 * the width of the widget in columns
	 *
	 * This is done via the CSS Grid system.
	 *
	 * @see {@link WidgetDefinition.height}
	 * @see {@link Dashboard.columns}
	 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
	 */
	width: number;

	/**
	 * the number of columns the widget has space in the container
	 *
	 * This is done via the CSS Grid system.
	 *
	 * @see {@link WidgetDefinition.width}
	 * @see {@link Dashboard.rows}
	 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
	 */
	height: number;

	/**
	 * the number of row the widget has space in the container
	 *
	 * @see {@link Widget.name}
	 */
	widgetName: string;

	/**
	 * the initial props for the Widget component
	 *
	 * if the initial props are not defined they are `undefined`
	 *
	 * @see {@link BaseRendererProps}
	 */
	initialProps?: GenericProps; // subject to change
}

/**
 * Defines a dashboard which renders given widgets in defined positions.
 *
 * The dashboard is a structural container
 * which sets the boundaries for the widgets to fit into.
 * This is done via the
 * {@link https://css-tricks.com/snippets/css/complete-guide-grid/ | CSS Grid system}.
 *
 * @see {@link WidgetDefinition}
 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
 *
 * @example
 * A very simple dashboard
 * ```ts
 * const myDashboard: Dashboard = {
 * 	title: 'My Dashboard',
 * 	columns: 4,
 * 	rows: 4,
 * 	widgets: [
 * 		{
 * 			width: 2,
 * 			height: 2,
 * 			widgetName: 'myWidget'
 * 		}
 * 	]
 * };
 * ```
 */
export interface Dashboard {
	/**
	 * the title of the dashboard
	 *
	 * It will be visible in the application and selectable by the user.
	 */
	title: string;

	/**
	 * the number of columns in the dashboard container
	 *
	 * It is important for the spacing of the widget in the dashboard container.
	 * See {@link https://css-tricks.com/snippets/css/complete-guide-grid/ | CSS Grid system}
	 * for more information.
	 *
	 * @see {@link WidgetDefinition}
	 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
	 */
	columns: number;

	/**
	 * the number of rows in the dashboard container
	 *
	 * It is important for the spacing of the widget in the dashboard container.
	 * See {@link https://css-tricks.com/snippets/css/complete-guide-grid/ | CSS Grid system}
	 * for more information.
	 *
	 * @see {@link WidgetDefinition}
	 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
	 */
	rows: number;

	/**
	 * widgets associated to the dashboard container
	 *
	 * These widgets will be arranged in the container
	 * based on the columns and rows of the dashboard
	 * and the width and height of the widgets.
	 * See {@link https://css-tricks.com/snippets/css/complete-guide-grid/ | CSS Grid system}
	 * for more information.
	 *
	 * @see {@link WidgetDefinition}
	 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
	 */
	widgets: WidgetDefinition[];
}

/**
 * A type definition for a username in a user configuration.
 *
 * @see {@link UserConfig}
 */
export type Username = string;

/**
 * User information mapped to a username and stored in a user configuration.
 *
 * @see {@link UserConfig}
 * @see {@link Username}
 */
export interface UserInformation {
	/**
	 * The dashboards associated to the user.
	 *
	 * @see {@link Dashboard}
	 */
	dashboards: Array<Dashboard>;
}

/**
 * Describes an entire user configuration.
 * It is a map between the username and its stored information.
 * When the user is logged in, typically the dashboard page will render
 * these definitions for the logged in username.
 *
 * @see {@link Dashboard}
 *
 * @example
 * A very simple user dashboard association
 * ```ts
 * const userConfig: UserConfig = {
 * 	'Alice': {
 * 		dashboards: [
 * 			{
 * 				title: 'My awesome dashboard',
 * 				columns: 4,
 * 				rows: 4,
 * 				widgets: [
 * 					{
 * 						width: 2,
 * 						height: 2,
 * 						widgetName: 'myWidget'
 * 						initialProps: {
 * 							value: 'TheBox'
 * 						}
 * 					}
 * 				]
 * 			}
 * 		]
 * 	}
 * }
 * ```
 */
export type UserConfig = Record<Username, UserInformation>;
