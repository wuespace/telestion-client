const fs = require('fs');
const path = require('path');

/**
 * @param {string} widgetFolder
 * @param {string} safeName
 */
function createWidgetTSX(widgetFolder, safeName) {
	fs.writeFileSync(
		path.join(widgetFolder, 'widget.tsx'),
		`import { Heading } from '@adobe/react-spectrum';

export function Widget() {
\treturn <Heading level={2}>${safeName} widget</Heading>;
}
`
	);
}

module.exports = createWidgetTSX;
