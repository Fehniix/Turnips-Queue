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

			window.subscribeToPrivateMessages = (userId, callback) => {
				this.stompClient.subscribe(`/topic/user/${userId}`, data => {
					callback(data);
				});
			};
		});
	}

	messageReceived(data) {
		if (data.body === 'update')
			$(window).trigger('update', data);
		
		if (data.body === 'queue_destroyed')
			$(window).trigger('queueDestroyed', data);
	}
}

export default new SocketHandler();