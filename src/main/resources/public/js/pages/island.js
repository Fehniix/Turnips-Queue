class IslandPage {
	queue;
	pageHandler;
	
	constructor() {
		$('.islandPage .btnBack').on('click', _ => {
			this.pageHandler.swapToPage('main');
		});
	}

	/**
	 * Preloads the island page
	 */
	async preload() {
		//	Get the href's pathname without the initial "/".
		const requestedPage = window.location.pathname.replace(/^\//, '');

		//	Get Turnip Code from the window location. AKA GET parameter.
		const turnipCode = requestedPage.replace(/island\//, '');
			
		try {
			//	Retrieve Queue info from the getQueue endpoint.
			const queueInstance = await $.get('/endpoint/getQueue', {
				turnipCode: turnipCode
			});

			const queueMeta = await $.get('/endpoint/getQueueMeta', {
				turnipCode: turnipCode
			});
			
			$('.islandPage .title span').text(queueMeta.)
		} catch (response) {
			console.log(response);
			//	The endpoint call failed. The Turnip Code is invalid.
			if (response.status == 410) {
				throw new Error();
			}
		}

		if (this.userIsAdmin()) {
			console.log('yeah!')
		} else {
			console.log('meh.')
		}
		
		
	}

	/**
	 * Returns true if the user is validated to be an admin by the server.
	 */
	async userIsAdmin() {
		const turnipCode 	= window.location.pathname.match(/island\/([\d\w]+)/)[1];
		const admin 		= window.localStorage.getItem('admin');

		if (!admin)
			return false;

		return await $.post('/endpoint/userIsAdmin', {
			turnipCode: turnipCode,
			admin: admin
		});
	}

	/**
	 * Sets the `PageHandler` instance to use for future reference.
	 * @param {PageHandler} pageHandler 
	 */
	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}
}

export default new IslandPage();