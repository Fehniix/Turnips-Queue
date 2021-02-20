class SocketHandler {
	socketClient;
	stompClient;

	constructor() {
		
	}

	/**
	 * Socket client initialization.
	 */
	async initialize() {
		this.socketClient = new SockJS('/ws-fallback');
		this.stompClient = Stomp.over(this.socketClient);
		this.stompClient.debug = null;

		await this.stompClient.connect({}, frame => {
			console.log('Connected to the WS server endpoint.');
			this.stompClient.subscribe('/topic/queue', data => {
				this.messageReceived(data);
			});
		});
	}

	messageReceived(data) {
		console.log(data);
	}
}

export default new SocketHandler();