import Animator from "./animator.js";
import PageHandler from "./pageHandler.js";

class PageRouter {
	constructor() {
		//	Keep a reference to each page module.
		this.pageRefs = {
			main: undefined,
			host: undefined,
			island: undefined,
			islands: undefined
		}
	}

	/**
	 * Loads each individual page dynamically and stores a reference to them.
	 */
	async loadPages(pageHandler) {
		const pages = await $.get('/endpoint/pagesFolderContents');

		await pages.asyncForEach(async page => {
			//	The RESTful entrypoint above returns a JSON array of filenames. The filename also corresponds to the name of the page.
			const pageName = page.replace(/\.js/, '');

			//	Dynamically import the pages.
			this.pageRefs[pageName] = (await import(`./pages/${page}`)).default;

			//	And set the PageHandler reference.
			this.pageRefs[pageName].setPageHandler(pageHandler);

			//	Set the double linked ref.
			if (typeof this.pageRefs[pageName].setPageRouter === 'function') {
				this.pageRefs[pageName].setPageRouter(this);
			}
		});
	}

	/**
	 * This method modifies the current location with respect to the page currently active.
	 * @param {string} toPage Name of the swap target page.
	 */
	pageSwapped(toPage, noHistoryUpdate = false) {
		if (toPage !== 'hostStep2')
			if (typeof this.pageRefs[toPage].pageSwapped === 'function')
				this.pageRefs[toPage].pageSwapped();

		if (toPage === 'main')
			toPage = '';

		if (!noHistoryUpdate)
			window.history.pushState({}, '', `/${toPage}`);
	}

	/**
	 * On page load, this method routes to the correct page.
	 */
	async route() {
		const requestedPage = window.location.pathname.replace(/^\//, '');
		
		if (requestedPage.match(/island\//)) {

			//	Island page.

			//	Pre-load the data on the island page. Can fail: the turnip code is invalid.
			try {
				await this.pageRefs.island.preload();

				//	Swap to the island page without updating the location href.
				PageHandler.swapToPage('island', false, true);
			} catch (ex) {
				console.log(ex);
				await PageHandler.swapToPage('main');
				Animator.showErrorModal('The specified Turnip Code is invalid. The island might have been deleted. We\'re sorry for the inconvenience. :(');
				window.localStorage.removeItem('back');
				$('.mainPage .backToIsland').hide();
			}

		} else if (requestedPage.match(/hostStep2/)) {

			//	Host Step 2. Invalid route when reached from typing the URL on the browser directly.
			PageHandler.swapToPage('main');

		} else if (requestedPage.match(/islands/)) {

			await this.pageRefs.islands.preload();

			PageHandler.swapToPage('islands', true, true);

		}
	}

	/**
	 * Returns the reference to the specified page.
	 */
	getPageRef(pageName) {
		return this.pageRefs[pageName];
	}
}

export default new PageRouter();