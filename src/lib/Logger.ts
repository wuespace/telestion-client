import randomColor from 'randomcolor';

export interface Options {
	remoteUrl?: string;
}

class Style {
	constructor(private color: string, private background: string) {}

	get css() {
		return `color: ${this.color}; background-color: ${this.background}; font-weight: bold;`;
	}
}

type LogFunction = (type: string, style: Style, ...args: any[]) => void;

class LogFunctions {
	constructor(private logFunction: LogFunction) {}

	debug(...args: any[]) {
		this.logFunction('DEBUG', new Style('lightgray', 'black'), ...args);
	}

	success(...args: any[]) {
		this.logFunction('SUCCESS', new Style('white', 'green'), ...args);
	}

	error(...args: any[]) {
		this.logFunction('ERROR', new Style('white', 'red'), ...args);
	}

	warn(...args: any[]) {
		this.logFunction('WARN', new Style('white', 'orange'), ...args);
	}

	info(...args: any[]) {
		this.logFunction('INFO', new Style('white', 'black'), ...args);
	}
}

const componentBackgroundColor = 'lightgray';

export default class Logger {
	private availableLoggers: { [key: string]: LogFunctions } = {};

	constructor(private options?: Options) {}

	getSubsystemLogger(systemName: string) {
		// build new subsystem logger if no one is available
		if (!this.availableLoggers[systemName]) {
			this.availableLoggers[systemName] = new LogFunctions(
				(type, style, ...args) => {
					const componentStyle = new Style(
						randomColor({ luminosity: 'dark', seed: systemName }),
						componentBackgroundColor
					);

					console.log(
						`%c ${type} %c ${systemName} `,
						style.css,
						componentStyle.css,
						...args
					);
				}
			);
		}

		return this.availableLoggers[systemName];
	}
}
