namespace AnotherPlace {
	//
	// page-functional-component
	//
	let pageAbstractRouting: TelestionClient.Page.AbstractRouting;
	let pageAbstractRedirect: TelestionClient.Page.AbstractRedirect;
	let pageAdditionalRedirect: TelestionClient.Page.AdditionalRedirect;
	let pageDefaultRouting: TelestionClient.Page.DefaultRouting;
	let pageUnAuthRouting: TelestionClient.Page.UnAuthRouting;
	let pageAuthRouting: TelestionClient.Page.AuthRouting;
	let pageRouting: TelestionClient.Page.Routing;

	//
	// widget
	//
	let widgetBasePropType: TelestionClient.Widget.BasePropType;
	let widgetGenericProps: TelestionClient.Widget.GenericProps;
	let widgetGenericComponent: TelestionClient.Widget.GenericComponent;
	let widgetGlobalRendererProps: TelestionClient.Widget.GlobalRendererProps;
	let widgetBaseRendererProps: TelestionClient.Widget.BaseRendererProps;
	let widgetConfigControlsProps: TelestionClient.Widget.BaseConfigControlsProps;
	let widgetWidget: TelestionClient.Widget.Widget;

	interface WidgetProps extends TelestionClient.Widget.GenericProps {
		value: string;
	}

	let widgetBaseRendererPropsExtended: TelestionClient.Widget.BaseRendererProps<WidgetProps>;
	let widgetConfigControlsPropsExtended: TelestionClient.Widget.BaseConfigControlsProps<WidgetProps>;
	let widgetWidgetExtended: TelestionClient.Widget.Widget<WidgetProps>;

	//
	// user config
	//
	let userDashboardsWidgetDefinition: TelestionClient.UserConfig.WidgetDefinition;
	let userDashboardsDashboard: TelestionClient.UserConfig.Dashboard;
	let userDashboardUserConfig: TelestionClient.UserConfig.UserConfig;

	//
	// auth
	//
	let authSignInResult: TelestionClient.Auth.SignInResult;
	let authSignOutResult: TelestionClient.Auth.SignOutResult;
	let authAuthResult: TelestionClient.Auth.AuthResult;
	let authAuth: TelestionClient.Auth.Auth;
}
