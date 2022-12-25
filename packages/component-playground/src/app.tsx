import {
	Pages,
	TelestionClient,
	useEventBusManager
} from '@wuespace/telestion-client-core';
import {
	AccountControls,
	Actions,
	AppLogo,
	ColorSchemeAction,
	CommonWrapper,
	ConnectionIndicator,
	DashboardPage,
	DashboardPicker,
	FullscreenAction,
	Header as TCHeader,
	LoginDescription,
	LoginForm,
	LoginLogo,
	LoginPage,
	LoginTitle,
	NavBar,
	NotFoundPage,
	NotificationAction,
	useUserConfig
} from '@wuespace/telestion-client-common';
import { useCallback } from 'react';
import { Widget } from '@wuespace/telestion-client-types';

useUserConfig.getState().set({
	admin: {
		dashboards: [
			{
				title: 'Dashboard',
				columns: 2,
				rows: 2,
				widgets: [
					{
						height: 1,
						width: 2,
						widgetName: 'Widget',
						id: 'widget-1'
					}
				]
			}
		]
	}
});

const widgets: Widget[] = [
	{
		name: 'Widget',
		title: 'Widget',
		Widget: () => <div>Widget</div>,
		version: '0.0.0'
	}
];

export function App() {
	useEventBusManager();

	const wrapper = useCallback(
		(children: any) => (
			<CommonWrapper widgets={widgets}>{children}</CommonWrapper>
		),
		[]
	);
	return (
		<div>
			<TelestionClient wrapper={wrapper}>
				<Pages preNodes={<Header />}>
					<LoginPage>
						<LoginLogo />
						<LoginTitle />
						<LoginDescription />
						<LoginForm initialServerURL="http://localhost:9870/bridge" />
					</LoginPage>
					<DashboardPage />
					<NotFoundPage />
				</Pages>
			</TelestionClient>
		</div>
	);
}

function Header() {
	return (
		<TCHeader
			left={
				<>
					<AppLogo />
					<NavBar />
				</>
			}
			center={<DashboardPicker />}
			right={
				<>
					<ConnectionIndicator />
					<Actions>
						<NotificationAction />
						<ColorSchemeAction />
						<FullscreenAction />
					</Actions>
					<AccountControls />
				</>
			}
		/>
	);
}
