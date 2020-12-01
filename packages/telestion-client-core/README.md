# Telestion Client core components

The core components of the Telestion Frontend

## Installation

First, add it as dependency to your project:
```shell
$ npm install @wuespace/telestion-client-core
```

Please also check that you install a supported version of `react` and `react-dom`.

After installation, check out the provided components:
```tsx
import React from 'react';
import { TelestionClient, coreWidgets } from '@wuespace/telestion-client-core';

export default function MyComponent() {
	return (
		<TelestionClient
			widgets={[...coreWigets]}
		>
			...
		</TelestionClient>
	);
}

```

For a full list of components, hooks and utility parts, check out the reference:
(coming soon™)

## Contributing

Take a look at the [Telestion Client monorepo](https://github.com/TelestionTeam/telestion-client/)
that manages this package, and many more related to Telestion Client.

### Package structure

(coming soon™)

### Building

(coming soon™)

## About

This is part of [Telestion](https://telestion.wuespace.de/), a project by [WueSpace e.V.](https://www.wuespace.de/)
