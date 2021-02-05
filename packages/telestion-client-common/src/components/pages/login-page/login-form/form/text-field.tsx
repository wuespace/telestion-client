/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { TextField as SpectrumTextField } from '@adobe/react-spectrum';
import { SpectrumTextFieldProps } from '@react-types/textfield';

import { ValidationState } from './validate-inputs';

/**
 * React Props of {@link TextField}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link TextField}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export type TextFieldProps = Omit<
	SpectrumTextFieldProps,
	'onChange' | 'value' | 'defaultValue'
> & {
	/**
	 * The initial value of the text field.
	 * If it not defined the text field is initially empty.
	 */
	initialValue?: string;

	/**
	 * An event that triggers on every input change
	 * and reports the current text field content.
	 *
	 * If the current input is invalid
	 * (definable by the {@link TextFieldProps.validator} function)
	 * the reported value is `null`.
	 *
	 * @param value - the current text field content
	 */
	onChange?: (value: string | null) => void;

	/**
	 * The validator function that "tests" the current content if it is valid.
	 * @param text - the current content of the text field to test
	 * @returns the validation state of the tested content
	 */
	validator?: (text: string) => ValidationState;
};

/**
 * The text field component that renders a react spectrum text field
 * and is typically used a form.
 *
 * It can test the input with a given validator function
 * to indicate correctness of the current input.
 *
 * @see {@link TextFieldProps}
 *
 * @example
 * ```ts
 * function MyForm() {
 * 	const [username, setUsername] = useState<string | null>('');
 *
 * 	return (
 * 		<TextField
 * 			label="Username"
 * 			placeholder="Your username"
 * 			initialValue={initialUsername}
 * 			onChange={setUsername}
 * 			validator={isValidText}
 * 		/>
 * 	);
 * }
 * ```
 */
export function TextField({
	initialValue = '',
	onChange,
	validator,
	...textFieldProps
}: TextFieldProps) {
	const [value, setValue] = useState(initialValue);
	const [isValid, setIsValid] = useState<ValidationState>();

	useEffect(() => setIsValid(validator ? validator(value) : 'valid'), [
		value,
		validator
	]);

	useEffect(() => {
		if (onChange) {
			if (!isValid) {
				onChange(null);
			} else {
				onChange(value);
			}
		}
	}, [isValid, onChange, value]);

	return (
		<SpectrumTextField
			value={value}
			onChange={setValue}
			validationState={isValid}
			{...textFieldProps}
		/>
	);
}
