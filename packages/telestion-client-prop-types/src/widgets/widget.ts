import PropTypes from 'prop-types';
import { jsonSerializablePropType } from '../json-serializable';

/**
 * PropType for a base prop-type of a widget component
 *
 * See {@link @wuespace/telestion-client-types#BasePropType}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#BasePropType}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const basePropTypePropType = jsonSerializablePropType;

/**
 * PropType for the most generic properties of a widget component
 *
 * See {@link @wuespace/telestion-client-types#GenericProps}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#GenericProps}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const genericPropsPropType = PropTypes.object;

/**
 * PropType for the props that are always available to Widget component
 *
 * See {@link @wuespace/telestion-client-types#GlobalRendererProps}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#GlobalRendererProps}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const globalRendererPropsPropType = PropTypes.shape({
	title: PropTypes.string.isRequired
});

/**
 * PropType for an "entire" widget definition
 *
 * See {@link @wuespace/telestion-client-types#Widget}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#Widget}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const widgetPropType = PropTypes.shape({
	name: PropTypes.string.isRequired,
	Widget: PropTypes.node.isRequired,
	ConfigControls: PropTypes.node
});
