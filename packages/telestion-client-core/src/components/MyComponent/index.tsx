import React from 'react';

export interface MyComponentProps {
	text: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ text }) => (
	<p>{text}</p>
);
