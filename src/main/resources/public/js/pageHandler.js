import Animator from "./animator.js";

class PageHandler {
	constructor() {
		// Each value contains the reference to each DOM object. Keys correspond to the "pageName" attribute of the pages.
		this.pages = {
			main: undefined,
			host: undefined,
			hostedIsland: undefined,
			islands: undefined,
		};

		this.activePageName = undefined;
	}

	/**
	 * Retrieves the HTML code from the DOM of the different pages to swap between, and initializes page instances.
	 */
	initialize() {
		$('.page').each((_, pageElement) => {
			const pageName = $(pageElement).attr('pageName');

			this.pages[pageName] = pageElement;
		});

		//	First page to be shown is the main page.
		this.activePageName = 'main';
		
		// After initialization, make the pages object strictly read-only. Nothing needs to change.
		Object.freeze(this.pages);
	}

	/**
	 * Swaps to the page identified by its unique name.
	 */
	async swapToPage(pageName, flex = false) {
		await Animator.slideOff(this.pages[this.activePageName]);
		await Animator.slideOn(this.pages[pageName], flex);
		
		//	Set the currently active page.
		this.activePageName = pageName;
	}

	/**
	 * Returns the currently active page name.
	 */
	getActivePageName() {
		return this.activePageName;
	}
}

export default new PageHandler();