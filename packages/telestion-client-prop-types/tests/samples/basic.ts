/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TestCase } from '../lib/test-prop-type';

export const undefinedCase: TestCase = ['undefined', undefined];
export const nullCase: TestCase = ['null', null];
export const numberCase: TestCase = ['number', 42];
export const boolCase: TestCase = ['boolean', true];
export const stringCase: TestCase = ['string', 'The Box'];
export const objectCase: TestCase = ['object', {}];
export const arrayCase: TestCase = ['array', []];
export const functionCase: TestCase = ['function', () => {}];

export const basicTypeCases = [
	undefinedCase,
	nullCase,
	numberCase,
	boolCase,
	stringCase,
	objectCase,
	arrayCase,
	functionCase
];
