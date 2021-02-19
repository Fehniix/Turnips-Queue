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

		await this.stompClient.connect({}, frame => {
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