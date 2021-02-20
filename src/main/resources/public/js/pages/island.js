import Animator from "../Animator.js";

class IslandPage {
	queue;
	pageHandler;
	
	constructor() {
		$('.islandPage .btnBack').on('click', _ => {
			this.pageHandler.swapToPage('main');
		});

		window.setInterval(() => {
			$('.islandPage .visitors ul li').each((index, element) => {
				const unixTimestamp 		= parseInt($(element).find('.timeSinceJoin').attr('data')) * 1000;
				
				if (isNaN(unixTimestamp))
					return;

				const secondsDifference 	= Math.round((moment().utcOffset(0) - moment(unixTimestamp).utc()) / 1000);
				const formattedDifference	= moment()
												.startOf('day')
												.seconds(secondsDifference)
												.format('mm');

				$(element).find('.timeSinceJoin').text(`(${formattedDifference} minutes)`);
			});
		}, 1000);

		$('#btnJoinQueue').on('click', _ => {
			Animator.showModal('modalJoin');
		});

		$('#modalJoin .btnCancel, #modalLeave .btnCancel').on('click', _ => {
			Animator.hideModal();
		});

		$('#modalJoin .btnJoin').on('click', async _ => {
			const username = $('#inGameNameInput').val();

			//	Get the href's pathname without the initial "/".
			const requestedPage = window.location.pathname.replace(/^\//, '');

			//	Get Turnip Code from the window location. AKA GET parameter.
			const turnipCode = requestedPage.replace(/island\//, '');

			if (!username)
				return;

			const joinResult = await $.post('/endpoint/userJoin', {
				turnipCode: turnipCode,
				username: username,
				userId: window.localStorage.getItem('userId')
			});

			if (joinResult.length < 16) {
				Animator.hideModal();
				Animator.showErrorModal('An error occurred while joining the queue. Retry again later.');
				return;
			}

			console.log(joinResult);

			window.localStorage.setItem('userId', joinResult);
			window.localStorage.setItem('username', username);
			
			Animator.hideModal();
		});

		$('#modalLeave .btnLeave').on('click', async _ => {
			const username = $('#inGameNameInput').val();

			//	Get the href's pathname without the initial "/".
			const requestedPage = window.location.pathname.replace(/^\//, '');

			//	Get Turnip Code from the window location. AKA GET parameter.
			const turnipCode = requestedPage.replace(/island\//, '');

			if (!username)
				return;

			const joinResult = await $.post('/endpoint/userJoin', {
				turnipCode: turnipCode,
				username: username
			});

			console.log(joinResult);
			
			Animator.hideModal();
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

			//	Retrieve QueueMeta (DB) from the getQueueMeta endpoint.
			const queueMeta = await $.get('/endpoint/getQueueMeta', {
				turnipCode: turnipCode
			});

			console.log(queueInstance, queueMeta);
			
			$('.islandPage .islandName').text(queueMeta.islandName);
			$('.islandPage .fruitImage.icon').attr('fruit', queueMeta.nativeFruit);
			$('.islandPage .price').text(queueMeta.turnips);
			$('.islandPage .hemisphere').text(queueMeta.hemisphere.capitalize());
			$('.islandPage .description').text(queueMeta.description);
			$('.islandPage .visitorQueue .currentVisitors').text(`${queueInstance.treasury.length} / ${queueInstance.maxVisitorsLength}`);
			$('.islandPage .visitorsDescription .maxVisitors').text(queueInstance.maxVisitorsLength);
			$('.islandPage .visitorsDescription .maxLength').text(queueInstance.maxQueueLength);
			$('.islandPage .visitorsDescription .queuedUsers').text(queueInstance.queuedUsers.length);

			const visitorTemplate = $('.islandPage .visitors ul li').first();

			//	Remove current templated visitors.
			$('.islandPage .visitors ul').html('');

			queueInstance.treasury.forEach((visitor, index) => {
				const visitorElement = visitorTemplate.clone();

				visitorElement.find('.position').text((index + 1) + ':');
				visitorElement.find('.username').text(visitor.username);
				visitorElement.find('.timeSinceJoin').attr('data', visitor.timeSinceJoin);

				$('.islandPage .visitors ul').append(visitorElement);
			});
		} catch (response) {
			console.log(response);
			//	The endpoint call failed. The Turnip Code is invalid.
			if (response.status == 410) {
				throw new Error('Turnip Code is invalid.');
			}
		}

		if (await this.userIsAdmin()) {
			$('.islandPage .currentPosition, .islandPage .separator2').hide();
			$('.islandPage .nonAdminActions').hide();
			$('.islandPage .adminControls').show();
			$('.islandPage .adminActions').show();
		} else if (await this.userJoinedQueue()) {
			$('.islandPage #btnJoinQueue').hide();
			$('.islandPage #btnLeaveQueue').show();
		} else {
			//	User has not joined the queue and is not the queue host.
			$('.islandPage .currentPosition, .islandPage .separator2').hide();
		}
		
		console.log(await this.userJoinedQueue());
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
	 * Returns true if the session user has joined the user. Matches against localStorage data.
	 */
	async userJoinedQueue() {
		const position = await this.getUserPosition();

		return position !== -1 && typeof position === 'number';
	}

	/**
	 * Returns the position in queue of the localStorage user.
	 */
	async getUserPosition() {
		const turnipCode 	= window.location.pathname.match(/island\/([\d\w]+)/)[1];
		const userId		= window.localStorage.getItem('userId');
		const username		= window.localStorage.getItem('username');

		if (!userId || !username)
			return false;

		return await $.post('/endpoint/userPositionInQueue', {
			turnipCode: turnipCode,
			userId: userId,
			username: username
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