import NodeEventEmitter from 'node:events';
import { ChildProcess } from './child-process.mjs';
import { getLogger } from '../logger/index.mjs';

const logger = getLogger('Event Emitter');

/**
 * This class extends the functionality of Node's {@link import('events') EventEmitter}
 * and adds some convenience functions to connect child processes and register
 * process interrupt handlers.
 */
export class EventEmitter extends NodeEventEmitter {
	/**
	 * This symbol defines the stop event that are emitted
	 * once all connected child processes should be stopped.
	 */
	static readonly STOP_EVENT = Symbol('stop');

	/**
	 * Connects the given child process to the event emitter.
	 * Once connected, the stop event automatically stops the child process and
	 * when the child process dies unexpectedly, it emits the stop event and
	 * stops all others connected child processes.
	 *
	 * @param childProcess the child process that you want to connect to the event emitter
	 * @return a function that disconnects the child process from the event emitter
	 * and returns the child process instance
	 */
	connect(childProcess: ChildProcess): () => ChildProcess {
		logger.debug('Connect child process:', childProcess.spawnargs.join(' '));

		const emitHandler = (signal: NodeJS.Signals) => {
			logger.debug('Stop child process:', childProcess.spawnargs.join(' '));
			childProcess.stop(signal);
		};
		const processHandler = (
			code: number | null,
			signal: NodeJS.Signals | null
		) => {
			logger.debug('Child process died:', childProcess.spawnargs.join(' '));
			logger.debug('Emit stop event');
			this.emit(EventEmitter.STOP_EVENT, signal ?? undefined); // 'null' is not possible
		};

		this.once(EventEmitter.STOP_EVENT, emitHandler);
		childProcess.on('exit', processHandler);

		return () => {
			logger.debug(
				'Disconnect child process:',
				childProcess.spawnargs.join(' ')
			);
			this.off(EventEmitter.STOP_EVENT, emitHandler);
			childProcess.off('exit', processHandler);
			return childProcess;
		};
	}

	/**
	 * Explicitly stops all connected child processes.
	 * @param signal an optional signal that should be sent to all processes
	 */
	stop(signal?: NodeJS.Signals): void {
		logger.debug('Manual stop requested with signal:', signal);
		this.emit(EventEmitter.STOP_EVENT, signal);
	}
}
