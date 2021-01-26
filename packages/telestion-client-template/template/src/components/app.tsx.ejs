import { useEffect } from "react";
import { Widget } from "@wuespace/telestion-client-types";
import { TelestionClient, Pages, useEventBusManager } from "@wuespace/telestion-client-core";
import {
	CommonWrapper,
	LoginPage,
	DashboardPage,
	NotFoundPage,
	useUserConfig
} from "@wuespace/telestion-client-common";

import { userConfig } from "../model/sample-user-config";
import { Header } from "./header";
import { projectWidgets } from "../widgets";

const widgets: Array<Widget> = [...projectWidgets];

export function App() {
	useEventBusManager();

	const set = useUserConfig(state => state.set);

	useEffect(() => {
		// apply user config once
		set(userConfig);
	}, [set]);

	return (
		<TelestionClient
			title="Telestion Groundstation"
			wrapper={children => (
				<CommonWrapper widgets={widgets}>
					<>{children}</>
				</CommonWrapper>
			)}
		>
			<Pages preNodes={<Header/>}>
				<LoginPage/>
				<DashboardPage/>
				<NotFoundPage/>
			</Pages>
		</TelestionClient>
	);
}
