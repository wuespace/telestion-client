declare module 'sockjs-client' {
	// source: https://www.w3.org/TR/websockets/#the-websocket-interface
	declare class SockJS extends WebSocket {
		constructor(
			url: string,
			protocols?: string | string[] | null,
			options?: Partial<import('@wuespace/telestion-client-types').Options>
		): SockJS;
	}
	export default SockJS;
}
