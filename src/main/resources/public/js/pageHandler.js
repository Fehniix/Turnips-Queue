import Animator from "./animator.js";

class PageHandler {
	constructor() {
		// Each value contains the reference to each DOM object. Keys correspond to the "pageName" attribute of the pages.
		this.pages = {
			main: undefined,
			host: undefined,
			island: undefined,
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
		
		// 	After initialization, make the pages object strictly read-only. Nothing needs to change.
		Object.freeze(this.pages);
	}

	/**
	 * Swaps to the page identified by its unique name. The `flex` parameter specifies the target page is a FlexBox item.
	 */
	async swapToPage(pageName, flex = false) {
		if (!Object.keys(this.pages).includes(pageName))
			throw new Error('The supplied page to swap to does not exist.');

		await Animator.slideOff(this.pages[this.activePageName]);
		await Animator.slideOn(this.pages[pageName], flex);
		
		//	Set the currently active page.
		this.activePageName = pageName;

		//	Trigger custom pageSwapped event.
		$(window).trigger('pageSwapped');
	}

	/**
	 * Returns the currently active page name.
	 */
	getActivePageName() {
		return this.activePageName;
	}
}

export default new PageHandler();