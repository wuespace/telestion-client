import { ErrorMessage } from '@wuespace/telestion-client-types';

/**
 * The contents of an error message.
 */
export type ErrorContent = Pick<
	ErrorMessage,
	'failureCode' | 'failureType' | 'message'
>;
