class IslandsPage {
	pageHandler;

	constructor() {
		$('.islandsPage .backWrapper .backBtn').on('click', _ => {
			this.pageHandler.swapToPage('main');
		});

		$('.filterOption').on('click', async event => {
			const option = $(event.target);
			const category = option.closest('.filterOptions').attr('category');

			if (!option.attr('selected')) {
				$(`.filterOptions[category="${category}"] .filterOption[selected]`).removeAttr('selected');
				option.attr('selected', 'selected');
			}

			await this.preload();
		});
	}

	setPageHandler(pageHandler) {
		this.pageHandler = pageHandler;
	}

	async preload() {
		const filters = this.getFilters();
		
		let islands = [];

		try {
			islands = await $.get('/endpoint/filterQueues', {
				turnipsOrder: filters.turnips,
				hemisphere: filters.hemisphere
			});
		} catch (ex) {
			console.log(ex);
		}

		$('.islandsPage .islands').html('');

		const islandTemplate = $('.islandsPage .islandTemplate > .island');

		if (islands.length === 0) {
			const emptyResultsIsland = islandTemplate.clone();

			emptyResultsIsland.find('.islandName span').text('No Islands');
			emptyResultsIsland.find('.islandInfo .price').text('666');
			emptyResultsIsland.find('.description p').text('No islands were found with the filters you selected. :( Try with different ones!');
			emptyResultsIsland.find('.islandInfo .queueStatus span').text('999');
			emptyResultsIsland.css('transform', `rotate(${(Math.random() * 8) - 4}deg)`);

			$('.islandsPage .islands').append(emptyResultsIsland);

			return;
		}

		islands.forEach(island => {
			if (!island.queueInstance)
				return;

			const islandElement = islandTemplate.clone();

			islandElement.attr('turnipCode', island.meta.turnipCode);
			islandElement.find('.islandName span').text(island.meta.islandName);
			islandElement.find('.islandInfo .price').text(island.meta.turnips);
			islandElement.find('.description p').text(island.meta.description);
			const status = `Waiting: ${island.queueInstance.treasury.length + island.queueInstance.queuedUsers.length} / ${island.queueInstance.maxQueueLength}`;
			islandElement.find('.queueStatus span').text(status);
			islandElement.css('transform', `rotate(${(Math.random() * 6) - 3}deg)`);

			$('.islandsPage .islands').append(islandElement);
		});

		$('.islandsPage .island').on('click', event => {
			const turnipCode = $(event.target).closest('.island').attr('turnipCode');

			window.location.replace(`island/${turnipCode}`);
		});
	}

	getFilters() {
		const filters = {
			turnipsOrder: undefined,
			hemisphere: undefined
		};
		
		filters.turnips = $('.filterOptions[category="turnips"] > .filterOption[selected]').attr('option');
		filters.hemisphere = $('.filterOptions[category="hemisphere"] > .filterOption[selected]').attr('option');

		return filters;
	}
}

export default new IslandsPage();