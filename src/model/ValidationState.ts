import { ValidationState as SpectrumValidationState } from '@react-types/shared';

/**
 * 'valid' -> input is valid
 *
 * 'invalid' -> input is invalid
 *
 * undefined -> no input is set yet
 */
type ValidationState = SpectrumValidationState | undefined;

export default ValidationState;
