import React from 'react';

export interface MyComponentProps {
	text: string;
}

export function MyComponent({ text }: MyComponentProps) {
	return <p>{text}</p>;
}
