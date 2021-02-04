const fs = require('fs');

/**
 * Insert in the line before the insertion mark
 */
const INSERT_ABOVE = Symbol('Insert in the line before the insertion mark');
/**
 * Insert in the line below the insertion mark
 */
const INSERT_BELOW = Symbol('Insert in the line below the insertion mark');
/**
 * Replace the line with the insertion mark
 */
const REPLACE = Symbol('Replace the line with the insertion mark');

/**
 * @typedef {Object} Replacer
 * @property {string} needle - the string for which the file gets searched in the replacer.
 * @property {string} text - the text that gets inserted above/below/instead of the `needle`, depending on the `position`
 * @property {INSERT_ABOVE | INSERT_BELOW | REPLACE} position - the position where `text` gets inserted relative to the
 * `needle`'s line.
 */

/**
 * Modifies a file by replacing or inserting text above/below specific sections of code, identified as "needle".
 *
 * Processes first occurrence of each replacer, only!
 * @param {string} filePath
 * @param {Replacer[]} replacers
 */
function modifyFile(filePath, replacers) {
	const lines = fs
		.readFileSync(filePath, 'utf8')
		.toString()
		.split('\r\n')
		.join('\n')
		.split('\n');

	for (let replacer of replacers) {
		const insertionMarkLineIndex = lines.findIndex(line =>
			line.includes(replacer.needle)
		);

		const newLines = [
			lines[insertionMarkLineIndex].replace(
				replacer.needle,
				replacer.text
			)
		];

		if (replacer.position === INSERT_ABOVE) {
			newLines.push(lines[insertionMarkLineIndex]);
		} else if (replacer.position === INSERT_BELOW) {
			newLines.unshift(lines[insertionMarkLineIndex]);
		} else if (replacer.position !== REPLACE) {
			throw new Error(
				'Internal Error: No valid position specified in replacer passed to modifyFile. ' +
					'This is an internal error, and as a user, you should never get to see this. Somehow, somethings seems ' +
					'to have mal-functioned. If you could report this (including the output) to the Telestion Team, ' +
					'we would appreciate that a lot. Sorry, and thank you very much in advance.'
			);
		}

		lines.splice(insertionMarkLineIndex, 1, ...newLines);
	}
	fs.writeFileSync(filePath, lines.join('\n'));
}

module.exports = { modifyFile, INSERT_ABOVE, INSERT_BELOW, REPLACE };
