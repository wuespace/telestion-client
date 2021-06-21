const fs = require('fs');
const path = require('path');

/**
 * @param {string} widgetFolder
 * @param {string} safeName
 * @param {string} prettyName
 */
function createWidgetIndexTS(widgetFolder, safeName, prettyName) {
	fs.writeFileSync(
		path.join(widgetFolder, 'index.ts'),
		`import { Widget } from "@wuespace/telestion-client-types";
import { Widget as WidgetRenderer } from "./widget";

export const widget: Widget = {
\tname: '${safeName}',
\ttitle: '${prettyName}',
\tversion: '0.0.0',
\tWidget: WidgetRenderer
};
`
	);
}

module.exports = createWidgetIndexTS;
