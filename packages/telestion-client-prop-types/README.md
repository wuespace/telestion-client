# Telestion Client PropTypes

PropTypes for Telestion Client types.

## Installation

First, add it as dependency to your project:

```shell
npm install @wuespace/@wuespace/telestion-client-prop-types
```

Please also check that you have installed a supported version of
`react` to use this package.

After the installation, check out the provided PropTypes:

```tsx
import { dashboardPropType } from '@wuespace/telestion-client-prop-types';
import { Dashboard } from '@wuespace/telestion-client-types';

interface Props {
	dashboard: Dashboard;
}

function MyComponent({ dashboard }: Props) {
	return <p>Dashboard: {dashboard.title}</p>;
}

MyComponent.propTypes = {
	dashboard: dashboardPropType.isRequired
};
```

Every exported type from `@wuespace/telestion-client-types`
has an appropriate PropType member exported in this package.

For all full list of types used in Telestion Client, check out the reference: \
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-types/

For the equivalent PropTypes, check out the reference here: \
https://telestionteam.github.io/telestion-client/@wuespace/telestion-client-prop-types/

## Contributing

Take a look at the
[Telestion Client monorepo](https://github.com/TelestionTeam/telestion-client/)
that manages this package, and many more related to Telestion Client.

### Package structure

(coming soon™)

### Building

(coming soon™)

## About

This is part of [Telestion](https://telestion.wuespace.de/),
a project by [WüSpace e.V.](https://www.wuespace.de/)
