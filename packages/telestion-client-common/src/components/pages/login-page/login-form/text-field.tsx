/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { TextField as SpectrumTextField } from '@adobe/react-spectrum';
import { SpectrumTextFieldProps } from '@react-types/textfield';
import { ValidationState } from '../../../../lib/validate-inputs';

export type TextFieldProps = Omit<
	SpectrumTextFieldProps,
	'onChange' | 'value' | 'defaultValue'
> & {
	initialValue?: string;

	onChange?: (value: string | null) => void;

	validator?: (text: string) => ValidationState;
};

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
