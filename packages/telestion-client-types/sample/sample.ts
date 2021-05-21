namespace AnotherPlace {
	//
	// page-functional-component
	//
	let pageAbstractRouting: TelestionClientTypes.Page.AbstractRouting;
	let pageAbstractRedirect: TelestionClientTypes.Page.AbstractRedirect;
	let pageAdditionalRedirect: TelestionClientTypes.Page.AdditionalRedirect;
	let pageDefaultRouting: TelestionClientTypes.Page.DefaultRouting;
	let pageUnAuthRouting: TelestionClientTypes.Page.UnAuthRouting;
	let pageAuthRouting: TelestionClientTypes.Page.AuthRouting;
	let pageRouting: TelestionClientTypes.Page.Routing;

	//
	// widget
	//
	let widgetBasePropType: TelestionClientTypes.Widget.BasePropType;
	let widgetGenericProps: TelestionClientTypes.Widget.GenericProps;
	let widgetGenericComponent: TelestionClientTypes.Widget.GenericComponent;
	let widgetGlobalRendererProps: TelestionClientTypes.Widget.GlobalRendererProps;
	let widgetBaseRendererProps: TelestionClientTypes.Widget.BaseRendererProps;
	let widgetConfigControlsProps: TelestionClientTypes.Widget.BaseConfigControlsProps;
	let widgetWidget: TelestionClientTypes.Widget.Widget;

	interface WidgetProps extends TelestionClientTypes.Widget.GenericProps {
		value: string;
	}

	let widgetBaseRendererPropsExtended: TelestionClientTypes.Widget.BaseRendererProps<WidgetProps>;
	let widgetConfigControlsPropsExtended: TelestionClientTypes.Widget.BaseConfigControlsProps<WidgetProps>;
	let widgetWidgetExtended: TelestionClientTypes.Widget.Widget<WidgetProps>;

	//
	// user config
	//
	let userConfigWidgetDefinition: TelestionClientTypes.UserConfig.WidgetDefinition;
	let userConfigDashboard: TelestionClientTypes.UserConfig.Dashboard;
	let userConfigUsername: TelestionClientTypes.UserConfig.Username;
	let userConfigUserInformation: TelestionClientTypes.UserConfig.UserInformation;
	let userConfigUserConfig: TelestionClientTypes.UserConfig.UserConfig;

	//
	// auth
	//
	let authSignInResult: TelestionClientTypes.Auth.SignInResult;
	let authSignOutResult: TelestionClientTypes.Auth.SignOutResult;
	let authAuthResult: TelestionClientTypes.Auth.AuthResult;
	let authAuth: TelestionClientTypes.Auth.Auth;

	//
	// json serializable
	//
	let jsonSerializable: TelestionClientTypes.JsonSerializable;

	//
	// preferences
	//
	let preferencesPrefValue: TelestionClientTypes.Preferences.PrefValue;
	let preferencesPrefRenderer: TelestionClientTypes.Preferences.PrefRenderer;
	let preferencesSelector: TelestionClientTypes.Preferences.Selector;
	let preferencesPrefSelector: TelestionClientTypes.Preferences.PrefSelector;
	let preferencesGroupSelector: TelestionClientTypes.Preferences.GroupSelector;
	let preferencesPreference: TelestionClientTypes.Preferences.Preference;
	let preferencesPreferencesGroup: TelestionClientTypes.Preferences.PreferencesGroup;
	let preferencesPreferencesStore: TelestionClientTypes.Preferences.PreferencesStore;

	//
	// notification
	//
	let notificationNotificationType: TelestionClientTypes.Notification.NotificationType;
	let notificationNotification: TelestionClientTypes.Notification.Notification;

	//
	// vertx-event-bus
	//
	let vertxEventBusOptions: TelestionClientTypes.VertxEventBus.Options;
	let vertxEventBusAddressableMessage: TelestionClientTypes.VertxEventBus.AddressableMessage;
	let vertxEventBusBaseMessage: TelestionClientTypes.VertxEventBus.BaseMessage;
	let vertxEventBusCallback: TelestionClientTypes.VertxEventBus.Callback;
	let vertxEventBusContentMessage: TelestionClientTypes.VertxEventBus.ContentMessage;
	let vertxEventBusErrorMessage: TelestionClientTypes.VertxEventBus.ErrorMessage;
	let vertxEventBusHeaders: TelestionClientTypes.VertxEventBus.Headers;
	let vertxEventBusMessage: TelestionClientTypes.VertxEventBus.Message;
	let vertxEventBusPingMessage: TelestionClientTypes.VertxEventBus.PingMessage;
	let vertxEventBusPublishMessage: TelestionClientTypes.VertxEventBus.PublishMessage;
	let vertxEventBusReceiveMessage: TelestionClientTypes.VertxEventBus.ReceiveMessage;
	let vertxEventBusRegisterMessage: TelestionClientTypes.VertxEventBus.RegisterMessage;
	let vertxEventBusSendMessage: TelestionClientTypes.VertxEventBus.SendMessage;
	let vertxEventBusUnregisterMessage: TelestionClientTypes.VertxEventBus.UnregisterMessage;
	let vertxEventBusChannelAddress: TelestionClientTypes.VertxEventBus.ChannelAddress;

	//
	// spectrum-color
	//
	let staticSpectrumColor: TelestionClientTypes.SpectrumColor.StaticSpectrumColor;
	let spectrumColor: TelestionClientTypes.SpectrumColor.SpectrumColor;
}
