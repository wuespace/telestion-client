import React from 'react';
import { View, Grid } from '@adobe/react-spectrum';

import DashboardType from '../../../model/Dashboard';
import WidgetWrapper from './WidgetWrapper';

interface Props {
	dashboard: DashboardType;
}

export default function Dashboard({ dashboard }: Props) {
	return (
		<View flexGrow={1} width="100%" padding="size-100">
			<Grid
				width="100%"
				height="100%"
				areas={['. . . .', '. . . .', '. . . .', '. . . .']}
				columns={['1fr', '1fr', '1fr', '1fr']}
				rows={['1fr', '1fr', '1fr', '1fr']}
				gap="size-100"
			>
				{dashboard.items.map(item => {
					return (
						<View
							gridRowEnd={`span ${item.rows}`}
							gridColumnEnd={`span ${item.cols}`}
							width="100%"
							height="100%"
						>
							<WidgetWrapper widget={item.widget} />
						</View>
					);
				})}
			</Grid>
		</View>
	);
}
