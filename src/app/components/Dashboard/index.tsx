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
				columns={['minmax(0, 1fr)', 'minmax(0, 1fr)', 'minmax(0, 1fr)', 'minmax(0, 1fr)']}
				rows={['minmax(0, 1fr)', 'minmax(0, 1fr)', 'minmax(0, 1fr)', 'minmax(0, 1fr)']}
				gap="size-100"
			>
				{dashboard.items.map((item, index) => {
					return (
						<View
							key={index}
							gridRowEnd={`span ${item.rows}`}
							gridColumnEnd={`span ${item.cols}`}
							width="100%"
							height="100%"
							position="relative"
						>
							<View
								position="absolute"
								top={0}
								right={0}
								bottom={0}
								left={0}
								overflow="auto"
							>
								<WidgetWrapper widget={item.widget} props={item.props} />
							</View>
						</View>
					);
				})}
			</Grid>
		</View>
	);
}
