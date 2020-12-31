import { FC } from 'react';
import { TelestionClient } from './telestion-client';

export const TestComponent: FC = () => {
	return (
		<TelestionClient
			title="My Application"
			wrapper={children => <div>{children}</div>}
			eventBusOptions={({ pingInterval: 2000 })}
		/>
	);
};
