import PropTypes from 'prop-types';
import { genericPropsPropType } from './widget';

/**
 * PropType for a widget placeholder in a dashboard container
 *
 * See {@link @wuespace/telestion-client-types#WidgetDefinition}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#WidgetDefinition}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const widgetDefinitionPropType = PropTypes.shape({
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	widgetName: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	initialProps: genericPropsPropType
});

/**
 * PropType fora dashboard which renders given widgets in defined positions
 *
 * See {@link @wuespace/telestion-client-types#Dashboard}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#Dashboard}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const dashboardPropType = PropTypes.shape({
	title: PropTypes.string.isRequired,
	columns: PropTypes.number.isRequired,
	rows: PropTypes.number.isRequired,
	widgets: PropTypes.arrayOf(widgetDefinitionPropType).isRequired
});

/**
 * PropType for a user configuration or
 * some dashboard definitions associated to a user
 *
 * See {@link @wuespace/telestion-client-types#UserConfig}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#UserConfig}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const userConfigPropType = PropTypes.shape({
	username: PropTypes.string.isRequired,
	dashboards: PropTypes.arrayOf(dashboardPropType).isRequired
});
