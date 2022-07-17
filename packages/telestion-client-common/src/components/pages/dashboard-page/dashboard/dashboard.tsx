import { Grid, View } from '@adobe/react-spectrum';
import { Dashboard as DashboardType } from '@wuespace/telestion-client-types';
import { useWindowSize } from '@wuespace/telestion-client-core';

import { OverflowFix } from '../../../widget-helper';
import { WidgetSelector } from './widget-renderer/widget-selector';
import {
	useBreakpoints,
	useOrientation,
	Orientation,
	Breakpoints
} from '../../../../hooks/abstractions';

/**
 * Helper function that calculates the columns for a grid component.
 *
 * @param breakpoints - the breakpoints of the application
 * @param orientation  - the orientation of the application
 *
 * @example
 * ```ts
 *
 * ```
 */
function calculateColumns(
	breakpoints: Breakpoints,
	orientation?: Orientation
): string[] {
	if (orientation === 'landscape') {
		if (breakpoints.isXXl)
			return [
				'minmax(0, 1fr)',
				'minmax(0, 1fr)',
				'minmax(0, 1fr)',
				'minmax(0, 1fr)'
			];
		if (breakpoints.isLg || breakpoints.isXl)
			return ['minmax(0, 1fr)', 'minmax(0, 1fr)', 'minmax(0, 1fr)'];
		return ['minmax(0, 1fr)', 'minmax(0, 1fr)'];
	}
	if (breakpoints.isBase || breakpoints.isSm) return ['minmax(0, 1fr)'];
	return ['minmax(0, 1fr)', 'minmax(0, 1fr)'];
}

/**
 * Helper function that calculates the row value for a grid component
 *
 * @param breakpoints - the breakpoints of the application
 * @param orientation  - the orientation of the application
 * @param windowSize - the size of the application window
 *
 * @example
 * ```ts
 *
 * ```
 */
function calculateRowSize(
	breakpoints: Breakpoints,
	orientation?: Orientation,
	windowSize?: DOMRect
): string {
	if (orientation === 'landscape') {
		if (windowSize) {
			if (windowSize.height < 400) {
				return '100%';
			}
		}
	}
	if (breakpoints.isXXl) return 'minmax(calc(99% / 3), 34%)';
	return 'minmax(49%, 50%)';
}

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
	const windowSize = useWindowSize();
	const breakpoints = useBreakpoints();
	const orientation = useOrientation();
	const columns = calculateColumns(breakpoints, orientation);
	const rowSize = calculateRowSize(breakpoints, orientation, windowSize);

	return (
		<View
			flexGrow={1}
			width="100%"
			maxHeight="100%"
			padding="size-100"
			backgroundColor="gray-300"
		>
			<View width="100%" height="100%" overflow="auto">
				<Grid
					width="100%"
					height="100%"
					autoFlow="row dense"
					autoRows={rowSize}
					columns={columns}
					gap="size-50"
				>
					{dashboard.widgets.map(widget => (
						<OverflowFix
							key={widget.id}
							gridRowEnd={`span ${widget.height}`}
							gridColumnEnd={`span ${
								breakpoints.isBase || breakpoints.isSm
									? dashboard.columns
									: widget.width
							}`}
							backgroundColor="gray-100"
							borderRadius="regular"
						>
							<WidgetSelector definition={widget} />
						</OverflowFix>
					))}
				</Grid>
			</View>
		</View>
	);
}
