class HostPage {
	pageHandler;

	constructor() {
		$('.hostPage .btnCancel').on('click', _ => {
			this.pageHandler.swapToPage('main');
		});

		$('.hostPage .btnNext').on('click', _ => {
			this.pageHandler.swapToPage('hostStep2', true);
		});

		$('.hostPageStep2 .btnBack').on('click', _ => {
			this.pageHandler.swapToPage('host', true);
		});
	}
	
	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}
}

export default new HostPage();