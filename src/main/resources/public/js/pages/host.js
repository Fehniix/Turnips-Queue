import Animator from "../Animator.js";

class HostPage {
	pageHandler;
	
	constructor() {
		$('.hostPage .btnCancel').on('click', event => {
			if ($(event.target).attr('updating') === 'yes')
				return;

			this.pageHandler.swapToPage('main');
		});

		$('.hostPage .btnNext').on('click', event => {
			if ($(event.target).attr('updating') === 'yes')
				return;

			const dodoCode = $('#dodoCodeInput').val();

			if (!dodoCode || !dodoCode.match(/[\d\w]{5}/)) {
				Animator.showErrorModal('The supplied Dodo Code format is incorrect. An example of Dodo Code: 1FA3Q.');
				return;
			}

			this.pageHandler.swapToPage('hostStep2', true);
		});

		$('.hostPageStep2 .btnBack').on('click', event => {
			if ($(event.target).attr('updating') === 'yes')
				return;

			this.pageHandler.swapToPage('host', true);
		});

		$('.hostPageStep2 .btnNext').on('click', async event => {
			if ($(event.target).attr('updating') === 'yes')
				return;

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
				window.localStorage.setItem(queueCreatedResponse.turnipCode, JSON.stringify({
					username: null,
					userId: null,
					admin: queueCreatedResponse.queueId
				}));

				//	Just in case the admin decides to go wandering elsewhere.
				window.localStorage.setItem('back', queueCreatedResponse.turnipCode);

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

		//	Handlers for updating the queue, rather than creating it.
		$('.hostPage .btnCancel').on('click', _ => {
			$('.hostPage .actions .btn').attr('updating', 'no');
			$('.hostPageStep2 .actions .btn').attr('updating', 'no');

			this.pageHandler.swapToPage('island', false, true);
		});

		$('.hostPage .btnNext').on('click', _ => {
			const dodoCode = $('#dodoCodeInput').val();

			if (!dodoCode || !dodoCode.match(/[\d\w]{5}/)) {
				Animator.showErrorModal('The supplied Dodo Code format is incorrect. An example of Dodo Code: 1FA3Q.');
				return;
			}

			this.pageHandler.swapToPage('hostStep2', true, true);
		});

		$('.hostPageStep2 .btnBack').on('click', _ => {
			$('.hostPage .actions .btn').attr('updating', 'no');
			$('.hostPageStep2 .actions .btn').attr('updating', 'no');

			this.pageHandler.swapToPage('island', false, true);
		});

		$('.hostPageStep2 .btnNext').on('click', async _ => {
			const islandName 		= $('#islandNameInput').val();
			const maxVisitors 		= $('#maxVisitorsInput').val();
			const maxLength 		= $('#queueSizeInput').val();
			const turnips 			= $('#turnipsInput').val();
			const hemisphere 		= $('#hemisphereSelect').val();
			const nativeFruit 		= $('#nativeFruitSelect').val();
			const description 		= $('#islandDescriptionInput').val();
			const privateListing 	= $('#privateListingCheckbox').prop('checked');
			const dodoCode			= $('#dodoCodeInput').val();

			try {
				//	Get the href's pathname without the initial "/".
				const requestedPage = window.location.pathname.replace(/^\//, '');

				//	Get Turnip Code from the window location. AKA GET parameter.
				const turnipCode = requestedPage.replace(/island\//, '');

				const user = this.getUserStatusForQueue(turnipCode);

				await $.post('/endpoint/updateQueue', {
					islandName: islandName,
					nativeFruit: nativeFruit,
					_private: privateListing,
					turnips: turnips,
					hemisphere: hemisphere,
					maxLength: maxLength,
					maxVisitors: maxVisitors,
					dodoCode: dodoCode,
					description: description,
					turnipCode: turnipCode,
					adminId: user.admin
				});

				//	Load the island/turnipCode page.
				window.location.reload();

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

	/**
	 * Preload data from DB prior to queue update.
	 */
	async preload(turnipCode) {
		$('.hostPage .actions .btn').attr('updating', 'yes');
		$('.hostPageStep2 .actions .btn').attr('updating', 'yes');

		let queueMeta;
			
		try {
			const user = this.getUserStatusForQueue(turnipCode);

			//	Retrieve QueueMeta (DB) from the getQueueMeta endpoint.
			queueMeta = await $.get('/endpoint/getQueueMetaAdmin', {
				turnipCode: turnipCode,
				adminId: user.admin
			});
		} catch (response) {
			console.log(response);
			//	The endpoint call failed. The Turnip Code is invalid.
			if (response.status == 410) {
				localStorage.removeItem('back');
				throw new Error('Turnip Code is invalid or the island was deleted.');
			}
		}

		$('#dodoCodeInput').val(queueMeta.dodoCode);
		$('#islandNameInput').val(queueMeta.islandName);
		$('#maxVisitorsInput').val(queueMeta.maxVisitors);
		$('#queueSizeInput').val(queueMeta.maxLength);
		$('#turnipsInput').val(queueMeta.turnips);
		$('#hemisphereSelect').val(queueMeta.hemisphere);
		$('#nativeFruitSelect').val(queueMeta.nativeFruit);
		$('#islandDescriptionInput').text(queueMeta.description);

		if (queueMeta._private === true)
			$('#privateListingCheckbox').prop('checked', true);
		else
			$('#privateListingCheckbox').prop('checked', false);
	}

	/**
	 * Parses saved JSON data in localStorage and returns it.
	 */
	getUserStatusForQueue(turnipCode) {
		return JSON.parse(window.localStorage.getItem(turnipCode));
	}
}

export default new HostPage();