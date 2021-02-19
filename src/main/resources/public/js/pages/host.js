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
	
	/**
	 * Sets the `PageHandler` instance to use for future reference.
	 * @param {PageHandler} pageHandler 
	 */
	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}

	/**
	 * Validates the raw `input:text` value.
	 */
	validateDodoCodeInput(dodoCode) {
		if (!dodoCode || typeof dodoCode !== 'string')
			return false;
		return dodoCode.length === 5;
	}
}

export default new HostPage();