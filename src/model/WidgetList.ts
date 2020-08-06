export default interface WidgetList {
	// TODO: Specify props for Widget nodes
	[key: string]: () => JSX.Element;
}
