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
			this.pageHandler.swapToPage('islands', true);
		});
	}
	
	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}
}

export default new MainPage();