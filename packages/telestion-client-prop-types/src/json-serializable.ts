import PropTypes from 'prop-types';

/**
 * PropType for json serializable data
 *
 * See {@link @wuespace/telestion-client-types#JsonSerializable}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/telestion-client-types#JsonSerializable}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const jsonSerializablePropType = PropTypes.oneOfType([
	PropTypes.number,
	PropTypes.string,
	PropTypes.bool,
	PropTypes.object,
	PropTypes.array
]);
