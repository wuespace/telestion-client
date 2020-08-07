/*
MIT License

Copyright (c) 2020 fliegwerk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Dispatch, SetStateAction, useState } from 'react';

/**
 * Use a state which gets saved in the localStorage
 * @param key the key for storing it in the localStorage
 * @param defaultValue the default value if no value was previously set
 */
export default function useStoredState<T>(
	key: string,
	defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
	const storedValue = window.localStorage.getItem(key);
	// Use previously stored value or, if nonexistent, the default value:
	const initialValue = storedValue ?? JSON.stringify(defaultValue);

	const [value, setValue] = useState<T>(JSON.parse(initialValue));

	return [
		value,
		(newValue, ...args) => {
			// Store new values in localStorage as well:
			localStorage.setItem(key, JSON.stringify(newValue));
			return setValue(newValue, ...args);
		}
	];
}
