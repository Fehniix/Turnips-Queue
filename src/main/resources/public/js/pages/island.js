class IslandPage {
	pageHandler;
	
	constructor() {
		$('.islandPage .btnBack').on('click', _ => {
			this.pageHandler.swapToPage('main');
		});
	}

	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}
}

export default new IslandPage();