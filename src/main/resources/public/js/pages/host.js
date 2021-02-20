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

		$('.hostPageStep2 .btnNext').on('click', async _ => {
			const islandName 		= $('#islandNameInput').val();
			const maxVisitors 		= $('#maxVisitorsInput').val();
			const maxLength 		= $('#queueSizeInput').val();
			const turnips 			= $('#turnipsInput').val();
			const hemisphere 		= $('#hemisphereSelect').val();
			const nativeFruit 		= $('#nativeFruitSelect').val();
			const description 		= $('#islandDescriptionInput').val();
			const privateListing 	= $('#privateListingCheckbox').is(':checked');
			const dodoCode			= $('#dodoCodeInput').val();

			const result = await $.post('/createQueue', {
				islandName: islandName,
				nativeFruit: nativeFruit,
				_private: privateListing,
				turnips: turnips,
				hemisphere: hemisphere,
				maxLength: maxLength,
				maxVisitors: maxVisitors,
				dodoCode: dodoCode,
				description: description
			});

			console.log(result);
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