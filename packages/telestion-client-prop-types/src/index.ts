import PropTypes from 'prop-types';

export const ebOptionsPropTypes = PropTypes.shape({
	pingInterval: PropTypes.number,
	reconnectAttempts: PropTypes.number,
	reconnectExponent: PropTypes.number,
	delayMin: PropTypes.number,
	delayMax: PropTypes.number,
	randomizationFactor: PropTypes.number
});
