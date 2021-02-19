class MainPage {
	pageHandler;

	constructor() {
		$('#noteHost').on('click', _ => {
			this.pageHandler.swapToPage('host', true);
		});

		$('#noteJoin').on('click', _ => {
			this.pageHandler.swapToPage('island', true);
		});

		$('#noteIslands').on('click', _ => {
			this.pageHandler.swapToPage('islands', true);
		});
	}
	
	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}
}

export default new MainPage();