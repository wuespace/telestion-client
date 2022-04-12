import Ajv, { ValidateFunction } from 'ajv';
import schema from './schema.json';

const ajv = new Ajv({
	allowUnionTypes: true
});

export const validate: ValidateFunction = ajv.compile(schema);
