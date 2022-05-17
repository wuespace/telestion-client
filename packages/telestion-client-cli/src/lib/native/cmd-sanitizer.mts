function identity<T>(arg: T): T {
	return arg;
}

/**
 * Sanitizes an argument for a CMD command.
 * @param arg - the unsafe argument
 */
export function sanitizeArgument(arg: string): string {
	return `"${arg}"`;
}

/**
 * Converts the executable and the arguments to a string
 * that is executable by the CMD command.
 *
 * @param executablePath - path to the executable
 * (can also be a filename that is available in the path)
 * @param args - arguments that the executable receives on execution
 * @param disableSanitizer - explicitly turn off the argument sanitizer
 * (I sure hope you know what you're doing...)
 */
export function getCmdShellString(
	executablePath: string,
	args: string[] = [],
	disableSanitizer = false
): string {
	return [executablePath, ...args]
		.map(disableSanitizer ? identity : sanitizeArgument)
		.join(' ');
}
