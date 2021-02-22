class MainPage {
	pageHandler;

	constructor() {
		$('#noteHost').on('click', _ => {
			this.pageHandler.swapToPage('host', true);
		});

		$('#noteJoin').on('click', _ => {
			$('#noteJoin').addClass('active');
		});

		$('*').on('click', event => {
			if ($(event.target).closest('#noteJoin').length > 0)
				return;
			$('#noteJoin').removeClass('active');
		});

		$('#noteJoin .btnLetsGo').on('click', _ => {
			const turnipCode = $('#turnipCodeInput').val();

			if (!turnipCode)
				return;

			window.location.replace(`island/${turnipCode}`);
		});

		$('#noteIslands').on('click', _ => {
			window.location.replace(`islands`);
		});

		$('.mainPage .backToHosted .btn').on('click', _ => {
			const turnipCode = window.localStorage.getItem('back');

			if (!turnipCode)
				return;

			window.location.replace(`island/${turnipCode}`);
		});

		this.pageSwapped();
	}
	
	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}

	pageSwapped() {
		//	Check if the user is currently hosting the island. If so, show the "back to the island" button.
		const turnipCode = window.localStorage.getItem('back');

		if (!turnipCode)
			return;

		$('.mainPage .backToHosted').show();
	}
}

export default new MainPage();