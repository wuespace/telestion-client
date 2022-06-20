import { useState, useEffect } from 'react';
import { Grid, View } from '@adobe/react-spectrum';
import { Dashboard as DashboardType } from '@wuespace/telestion-client-types';
import { useWindowSize } from '@wuespace/telestion-client-core';

import { OverflowFix } from '../../../widget-helper';
import { WidgetSelector } from './widget-renderer/widget-selector';
import {
	useBreakpoints,
	useSpectrumSize,
	useOrientation
} from '../../../../hooks/abstractions';
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
	const spectrumSize = useSpectrumSize();
	const { isBase, isSm, isLg, isXl, isXXl } = useBreakpoints();
	const orientation = useOrientation();

	const [columns, setColumns] = useState(['minmax(0, 1fr)']);
	const [rowSize, setRowSize] = useState('50%');

	const calculateColumns = () => {
		if (orientation === 'landscape') {
			if (isXXl)
				return [
					'minmax(0, 1fr)',
					'minmax(0, 1fr)',
					'minmax(0, 1fr)',
					'minmax(0, 1fr)'
				];
			if (isLg || isXl)
				return ['minmax(0, 1fr)', 'minmax(0, 1fr)', 'minmax(0, 1fr)'];
			return ['minmax(0, 1fr)', 'minmax(0, 1fr)'];
		}
		if (isBase || isSm) return ['minmax(0, 1fr)'];
		return ['minmax(0, 1fr)', 'minmax(0, 1fr)'];
	};

	const calculateRowSize = () => {
		if (orientation === 'landscape') {
			if (windowSize) {
				if (windowSize.height < 400) {
					return '100%';
				}
			}
		}
		if (isXXl) return 'minmax(calc(99% / 3), 34%)';
		return 'minmax(49%, 50%)';
	};

	useEffect(() => {
		setColumns(calculateColumns);
	}, [orientation, spectrumSize]);

	useEffect(() => {
		setRowSize(calculateRowSize);
	}, [windowSize]);

	return (
		<View
			flexGrow={1}
			width="100%"
			maxHeight="100%"
			padding="size-100"
			backgroundColor="gray-50"
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
								isBase || isSm ? dashboard.columns : widget.width
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

/*
BACKUP
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
 */
