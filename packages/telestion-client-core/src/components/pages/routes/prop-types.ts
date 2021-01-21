import PropTypes from 'prop-types';

export const AuthUnAuthRoutePropTypes = {
	redirectPath: PropTypes.string.isRequired,
	exact: PropTypes.bool,
	location: PropTypes.object,
	path: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string)
	]),
	sensitive: PropTypes.bool,
	strict: PropTypes.bool
};
