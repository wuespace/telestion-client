import { useMemo } from 'react';
import { Grid, View } from '@adobe/react-spectrum';
import { Dashboard as DashboardType } from '@wuespace/telestion-client-types';

import { OverflowFix } from '../../../widget-helper';
import { WidgetRenderer } from './widget-renderer/widget-renderer';

/**
 * React Props of {@link OverflowFix}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link OverflowFix}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface DashboardProps {
	/**
	 * The current dashboard to render.
	 */
	dashboard: DashboardType;
}

/**
 * Renders an entire dashboard.
 *
 * The dashboard has a defined number of rows and columns
 * into which the dashboard's widgets get rendered.
 * Every widget has a width and height defined in full rows and columns.
 *
 * Internally, it uses the CSS grid system to align the widgets.
 * For more information about the CSS Grid system, take a look at
 * https://css-tricks.com/snippets/css/complete-guide-grid/
 *
 * Additionally, every widget is rendered in an overflow fix
 * which prevents the widget from breaking the page or application layout.
 *
 * @see {@link DashboardProps}
 * @see {@link https://css-tricks.com/snippets/css/complete-guide-grid/}
 * @see {@link OverflowFix}
 *
 * @example
 * ```ts
 * function MyDashboardRenderer() {
 * 	const myDashboard: Dashboard = {...};
 *
 * 	return <Dashboard dashboard={myDashboard} />;
 * }
 * ```
 */
export function Dashboard({ dashboard }: DashboardProps) {
	const areas = useMemo(
		() =>
			Array.from({ length: dashboard.rows }, () =>
				Array.from({ length: dashboard.columns }, () => '.').join(' ')
			),
		[dashboard]
	);

	const rows = useMemo(
		() => Array.from({ length: dashboard.rows }, () => 'minmax(0, 1fr)'),
		[dashboard]
	);

	const columns = useMemo(
		() => Array.from({ length: dashboard.columns }, () => 'minmax(0, 1fr)'),
		[dashboard]
	);

	return (
		<View
			flexGrow={1}
			width="100%"
			padding="size-100"
			backgroundColor="gray-50"
		>
			<Grid
				width="100%"
				height="100%"
				areas={areas}
				rows={rows}
				columns={columns}
				gap="size-100"
			>
				{dashboard.widgets.map(widget => (
					<OverflowFix
						key={widget.id}
						gridRowEnd={`span ${widget.height}`}
						gridColumnEnd={`span ${widget.width}`}
						backgroundColor="gray-100"
						borderRadius="regular"
					>
						<WidgetRenderer widgetDefinition={widget} />
					</OverflowFix>
				))}
			</Grid>
		</View>
	);
}
