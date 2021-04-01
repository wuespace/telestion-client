import Ajv from 'ajv';
import schema from './schema.json';

const ajv = new Ajv({
	allowUnionTypes: true
});

export const validate = ajv.compile(schema);
