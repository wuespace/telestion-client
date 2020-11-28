import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";

import { MyComponent } from "./index";

export default {
	title: 'MyComponent',
	component: MyComponent
}

const Template: Story<ComponentProps<typeof MyComponent>> = (args) => (
	<MyComponent />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
