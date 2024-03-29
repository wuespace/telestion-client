import { Diagnostic } from '@parcel/diagnostic';

export interface BuildStartEvent {
	type: 'buildStart';
}

export interface BuildProgressEvent {
	type: 'buildProgress';
	phase: 'resolving' | 'transforming' | 'bundling' | 'packaging' | 'optimizing';
}

export interface BuildSuccessEvent {
	type: 'buildSuccess';
	buildTime: number;
	numberOfBundles: number;
}

export interface BuildFailureEvent {
	type: 'buildFailure';
	diagnostics: Array<Diagnostic>;
}

/**
 * Build events received by the `@wuespace/parcel-reporter-tc-cli`.
 */
export type BuildEvent =
	| BuildStartEvent
	| BuildProgressEvent
	| BuildSuccessEvent
	| BuildFailureEvent;
