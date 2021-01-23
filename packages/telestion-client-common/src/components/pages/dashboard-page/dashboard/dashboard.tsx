import { Dashboard as DashboardType } from '@wuespace/telestion-client-types';
import { Grid, View } from '@adobe/react-spectrum';
import { useMemo } from 'react';
import { OverflowFix } from './overflow-fix';
import { WidgetRenderer } from '../widget-renderer/widget-renderer';

export interface DashboardProps {
	dashboard: DashboardType;
}

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
			<Grid areas={areas} rows={rows} columns={columns} gap="size-100">
				{dashboard.widgets.map(widget => (
					<OverflowFix
						key={`${widget.title}-w${widget.width}-h${widget.height}`}
						gridRowEnd={`span ${widget.width}`}
						gridColumnEnd={`span ${widget.height}`}
						backgroundColor="gray-100"
						borderRadius="regular"
					>
						<WidgetRenderer widget={widget} />
					</OverflowFix>
				))}
			</Grid>
		</View>
	);
}
