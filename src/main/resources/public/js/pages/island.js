import Animator from "../animator.js";

class IslandPage {
	queue;
	pageHandler;
	pageRouter;
	
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

		$('#btnLeaveQueue').on('click', _ => {
			Animator.showModal('modalLeave');
		});

		$('#modalJoin .btnCancel, #modalLeave .btnCancel').on('click', _ => {
			Animator.hideModal();
		});

		$('#modalJoin .btnJoin').on('click', async _ => {
			//	Get the href's pathname without the initial "/".
			const requestedPage = window.location.pathname.replace(/^\//, '');
			//	Get Turnip Code from the window location. AKA GET parameter.
			const turnipCode 	= requestedPage.replace(/island\//, '');
			const queue 		= this.getUserStatusForQueue(turnipCode);

			if (queue) {
				await Animator.hideModal();
				Animator.showErrorModal('You joined the queue already. Don\'t click buttons you can\'t click.');
				return;
			}

			const username = $('#inGameNameInput').val();

			if (!username)
				return;

			//	Contains either an error string or a UUID representing the userId
			const joinResult = await $.post('/endpoint/userJoin', {
				turnipCode: turnipCode,
				username: username
			});

			if (joinResult.length < 16) {
				await Animator.hideModal();
				console.log(joinResult);
				Animator.showErrorModal('An error occurred while joining the queue. Retry again later.');
				return;
			}

			this.saveUserStatusForQueue(username, joinResult, turnipCode);

			console.log('Join Result: ', joinResult);
			
			Animator.hideModal();

			await this.preload();

			$('.islandPage .separator2, .islandPage .currentPosition').show();
		});

		$('#modalLeave .btnLeave').on('click', async _ => {
			//	Get the href's pathname without the initial "/".
			const requestedPage = window.location.pathname.replace(/^\//, '');

			//	Get Turnip Code from the window location. AKA GET parameter.
			const turnipCode = requestedPage.replace(/island\//, '');

			const user = this.getUserStatusForQueue(turnipCode);

			if (!user) {
				Animator.hideModal();
				return;
			}

			if (!user.username || !user.userId) {
				Animator.hideModal();
				return;
			}

			const leaveResult = await $.post('/endpoint/userLeave', {
				turnipCode: turnipCode,
				username: user.username,
				userId: user.userId
			});

			if (leaveResult === 'left' || leaveResult === 'left_treasury') {
				window.localStorage.removeItem(turnipCode);

				await this.preload();
			}
			
			Animator.hideModal();
		});

		$('#btnLockQueue').on('click', async _ => {
			//	Get the href's pathname without the initial "/".
			const requestedPage = window.location.pathname.replace(/^\//, '');

			//	Get Turnip Code from the window location. AKA GET parameter.
			const turnipCode = requestedPage.replace(/island\//, '');
			const user = this.getUserStatusForQueue(turnipCode);

			if (!user)
				return;

			if (!user.admin)
				return;

			const locked = $('#btnLockQueue').attr('locked') === 'yes';

			try {
				await $.post('/endpoint/setLockedQueue', {
					turnipCode: turnipCode,
					adminId: user.admin,
					locked: !locked
				});
			} catch (ex) {
				console.log('User is anauthorized.', ex);
			}

			await this.preload();
		});

		$('#btnDestroyQueue').on('click', async _ => {
			//	Get the href's pathname without the initial "/".
			const requestedPage = window.location.pathname.replace(/^\//, '');

			//	Get Turnip Code from the window location. AKA GET parameter.
			const turnipCode = requestedPage.replace(/island\//, '');
			const user = this.getUserStatusForQueue(turnipCode);

			if (!user)
				return;

			if (!user.admin)
				return;

			try {
				await $.post('/endpoint/destroyQueue', {
					turnipCode: turnipCode,
					adminId: user.admin
				});
			} catch (ex) {
				console.log('User is anauthorized.', ex);
			}

			window.localStorage.removeItem(turnipCode);

			window.location.reload();
		});

		$('#btnEditQueue').on('click', _ => {
			//	Get the href's pathname without the initial "/".
			const requestedPage = window.location.pathname.replace(/^\//, '');

			//	Get Turnip Code from the window location. AKA GET parameter.
			const turnipCode = requestedPage.replace(/island\//, '');

			try {
				this.pageRouter.getPageRef('host').preload(turnipCode);
			} catch (ex) {
				console.log(ex);
				return;
			}

			this.pageHandler.swapToPage('host', false, true);
		});

		$(window).on('update', async _ => {
			console.log('received update, preloading.');

			await this.preload();
		});

		$(window).on('queueDestroyed', async _ => {
			await Animator.showNoticeModal('Whoops...', 'The queue was destroyed by the host. We are sorry for the inconvenience.');

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

		let queueInstance, queueMeta;
			
		try {
			//	Retrieve Queue info from the getQueue endpoint.
			queueInstance = await $.get('/endpoint/getQueue', {
				turnipCode: turnipCode
			});

			//	Retrieve QueueMeta (DB) from the getQueueMeta endpoint.
			queueMeta = await $.get('/endpoint/getQueueMeta', {
				turnipCode: turnipCode
			});

			if (!queueMeta)
				throw {status: 410};

			window.test = async function(n) {
				await $.post('/endpoint/createTestUsers', {turnipCode: turnipCode, numberOfUsers: n});
			}

			console.log(queueInstance, queueMeta);
			
			$('.islandPage .islandName').text(queueMeta.islandName);
			$('.islandPage .fruitImage.icon').attr('fruit', queueMeta.nativeFruit);
			$('.islandPage .price').text(queueMeta.turnips);
			$('.islandPage .hemisphere').text(queueMeta.hemisphere.capitalize());
			$('.islandPage .description').text(queueMeta.description);
			$('.islandPage .visitorQueue .currentVisitors').text(`${queueInstance.treasury.length} / ${queueInstance.maxVisitorsLength}`);
			$('.islandPage .visitorsDescription .maxVisitors').text(queueInstance.maxVisitorsLength);
			$('.islandPage .visitorsDescription .maxLength').text(queueInstance.maxQueueLength);
			$('.islandPage .visitorsDescription .queuedUsers').text(queueInstance.queuedUsers.length + queueInstance.treasury.length);
			$('.islandPage .separatorDodoCode').hide();
			$('.islandPage .dodoCodeSection').hide();
			
			if (queueInstance.locked) {
				$('.islandPage .locked').show();
				$('#btnLockQueue').attr('locked', 'yes');
				$('#btnLockQueue').text('Unlock Queue');
			}
			else {
				$('.islandPage .locked').hide();
				$('#btnLockQueue').attr('locked', 'no');
				$('#btnLockQueue').text('Lock Queue');
			}

			const visitorTemplate = $('#visitorTemplate');

			//	Remove current templated visitors.
			$('.islandPage .visitors ul').html('');

			queueInstance.treasury.forEach((visitor, index) => {
				const visitorElement = visitorTemplate.clone();

				visitorElement.removeAttr('id');
				visitorElement.find('.position').text((index + 1) + ':');
				visitorElement.find('.username').text(visitor.username);
				visitorElement.find('.timeSinceJoin').attr('data', visitor.timeSinceJoin);
				visitorElement.find('.kick').attr('position', (index + 1));

				$('.islandPage .visitors ul').append(visitorElement);
			});
		} catch (response) {
			console.log(response);
			//	The endpoint call failed. The Turnip Code is invalid.
			if (response.status == 410) {
				localStorage.removeItem('back');
				$('.backToHosted').hide();
				throw new Error('Turnip Code is invalid or the island was deleted.');
			}
		}

		if (await this.userIsAdmin()) {
			$('.islandPage .currentPosition').hide();
			$('.islandPage .nonAdminActions').hide();
			$('.islandPage .adminControls').show();
			$('.islandPage .adminActions').show();
			$('.islandPage .visitors .kick').css('display', 'inline');
		} else if (await this.userJoinedQueue()) {
			$('.islandPage #btnJoinQueue').hide();
			$('.islandPage #btnLeaveQueue').show();
			$('.islandPage .separator2, .islandPage .currentPosition').show();

			$('.islandPage .currentPosition .position').text('#' + await this.getUserPosition());
			$('.islandPage .currentPosition .maxSize').text(queueInstance.maxQueueLength);
			if (await this.userInTreasury()) {
				$('#dodoCode').text(await this.getDodoCode());
				$('.islandPage .separatorDodoCode').show();
				$('.islandPage .dodoCodeSection').show();

				const user = this.getUserStatusForQueue(turnipCode);

				window.subscribeToPrivateMessages(user.userId, async data => {
					window.localStorage.removeItem(turnipCode);
					this.preload();
					await Animator.showNoticeModal('Whoops...', 'The host has removed you from the queue.');
				});
			} else {

			}
		} else {
			//	User has not joined the queue and is not the queue host.
			$('.islandPage .currentPosition, .islandPage .separator2').hide();
			
			if (queueInstance.treasury.length + queueInstance.queuedUsers.length >= queueInstance.maxQueueLength)
				$('.islandPage #btnJoinQueue').attr('disabled', 'true');

			$('.islandPage #btnJoinQueue').show();
			$('.islandPage #btnLeaveQueue').hide();
		}
		
		$('.islandPage .visitors .kick').on('click', event => {
			const position = $(event.target).attr('position');
			const user = this.getUserStatusForQueue(turnipCode);

			if (!user)
				return;

			if (!user.admin)
				return;

			try {
				const result = $.post('/endpoint/kickUser', {
					turnipCode: turnipCode,
					adminId: user.admin,
					position: position
				});

				this.preload();
			} catch (ex) {
				console.log(ex);
			}
		});
	}

	/**
	 * Encodes user data in JSON localStorage key identified by the Turnip Code
	 */
	saveUserStatusForQueue(username, userId, turnipCode) {
		window.localStorage.setItem(turnipCode, JSON.stringify({
			username: username,
			userId: userId,
			admin: null
		}));
	}

	/**
	 * Parses saved JSON data in localStorage and returns it.
	 */
	getUserStatusForQueue(turnipCode) {
		return JSON.parse(window.localStorage.getItem(turnipCode));
	}

	/**
	 * Returns true if the user is validated to be an admin by the server.
	 */
	async userIsAdmin() {
		const turnipCode 	= window.location.pathname.match(/island\/([\d\w]+)/)[1];
		const queue 		= JSON.parse(window.localStorage.getItem(turnipCode));

		if (!queue)
			return false;

		if (!queue.admin)
			return false;

		return await $.post('/endpoint/userIsAdmin', {
			turnipCode: turnipCode,
			admin: queue.admin
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
		const queue			= this.getUserStatusForQueue(turnipCode);
		
		if (!queue)
			return false;

		const userId		= queue.userId;
		const username		= queue.username;

		if (!userId || !username)
			return false;

		return await $.post('/endpoint/userPositionInQueue', {
			turnipCode: turnipCode,
			userId: userId,
			username: username
		});
	}

	async userInTreasury() {
		const turnipCode 	= window.location.pathname.match(/island\/([\d\w]+)/)[1];
		const queue			= this.getUserStatusForQueue(turnipCode);
		
		if (!queue)
			return false;

		const userId		= queue.userId;
		const username		= queue.username;

		if (!userId || !username)
			return false;

		return await $.post('/endpoint/userCanReceiveDodoCode', {
			turnipCode: turnipCode,
			userId: userId,
			username: username
		});
	}

	async getDodoCode() {
		const turnipCode 	= window.location.pathname.match(/island\/([\d\w]+)/)[1];
		const queue			= this.getUserStatusForQueue(turnipCode);

		if (!queue)
			return false;

		const userId		= queue.userId;
		const username		= queue.username;

		if (!userId || !username)
			return false;

		try {
			const dodoCode = await $.get('/endpoint/getDodoCode', {
				turnipCode: turnipCode,
				userId: userId,
				username: username
			});
			return dodoCode;
		} catch (ex) {
			console.log(ex);
			return undefined;
		}
	}

	/**
	 * Sets the `PageHandler` instance to use for future reference.
	 * @param {PageHandler} pageHandler 
	 */
	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}

	setPageRouter(pageRouter) {
		this.pageRouter = pageRouter;
	}
}

export default new IslandPage();