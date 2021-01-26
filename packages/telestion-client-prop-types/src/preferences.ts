import PropTypes from 'prop-types';
import { jsonSerializablePropType } from './json-serializable';

/**
 * PropType for the value of a preference
 *
 * See {@link @wuespace/telestion-client-types#PrefValue}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#PrefValue}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const prefValuePropType = jsonSerializablePropType;

/**
 * PropType for the renderer of a preference
 *
 * See {@link @wuespace/telestion-client-types#PrefRenderer}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#PrefVPrefRendereralue}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const prefRendererPropType = PropTypes.func;

/**
 * PropType for the "name" of a group or preference
 *
 * See {@link @wuespace/telestion-client-types#Selector}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#Selector}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const selectorPropType = PropTypes.string;

/**
 * PropType for a selector to select a preference out of a preference group
 *
 * See {@link @wuespace/telestion-client-types#PrefSelector}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#PrefSelector}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const prefSelectorPropType = selectorPropType;

/**
 * PropType for a selector to select a group out of a preference store
 *
 * See {@link @wuespace/telestion-client-types#GroupSelector}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#GroupSelector}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const groupSelectorPropType = PropTypes.oneOfType([
	PropTypes.oneOf(['null']),
	selectorPropType
]);

/**
 * PropType for a preference with a value and renderer
 *
 * See {@link @wuespace/telestion-client-types#Preference}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#Preference}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const preferencePropType = PropTypes.shape({
	value: prefValuePropType,
	renderer: prefRendererPropType
});

/**
 * PropType for a group of preferences
 *
 * See {@link @wuespace/telestion-client-types#PreferencesGroup}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#PreferencesGroup}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const preferencesGroupPropType = PropTypes.objectOf(preferencePropType);

/**
 * PropType for an entire store of grouped preferences
 *
 * See {@link @wuespace/telestion-client-types#PreferencesStore}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#PreferencesStore}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const preferencesStorePropType = PropTypes.objectOf(
	preferencesGroupPropType
);
