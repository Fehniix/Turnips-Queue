import Animator from "../Animator.js";

class HostPage {
	pageHandler;

	constructor() {
		$('.hostPage .btnCancel').on('click', _ => {
			this.pageHandler.swapToPage('main');
		});

		$('.hostPage .btnNext').on('click', _ => {
			const dodoCode = $('#dodoCodeInput').val();

			if (!dodoCode || !dodoCode.match(/[\d\w]{5}/)) {
				Animator.showErrorModal('The supplied Dodo Code format is incorrect. An example of Dodo Code: 1FA3Q.');
				return;
			}

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

			try {

				const queueCreatedResponse = await $.post('/endpoint/createQueue', {
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

				//	Designate the current user as the host/admin of the queue.
				window.localStorage.setItem('admin', queueCreatedResponse.queueId);

				//	Load the island/turnipCode page.
				window.location.replace(`island/${queueCreatedResponse.turnipCode}`);

			} catch (response) {
				console.log(response);
				if (response.status == 400) {
					Animator.showErrorModal('All fields have to be filled.');
					return;
				}
			}
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