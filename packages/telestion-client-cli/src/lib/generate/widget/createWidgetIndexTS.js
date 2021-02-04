const fs = require('fs');
const path = require('path');

/**
 * @param {string} widgetFolder
 * @param {string} safeName
 */
function createWidgetIndexTS(widgetFolder, safeName) {
	fs.writeFileSync(
		path.join(widgetFolder, 'index.ts'),
		`import { Widget } from "@wuespace/telestion-client-types";
import { Widget as WidgetRenderer } from "./widget";

export const widget: Widget = {
\tname: '${safeName}',
\tWidget: WidgetRenderer
};
`
	);
}

module.exports = createWidgetIndexTS;
