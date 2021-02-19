class IslandsPage {
	pageHandler;

	constructor() {
		$('.islandsPage .backWrapper .backBtn').on('click', _ => {
			this.pageHandler.swapToPage('main');
		});
	}

	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}
}

export default new IslandsPage();