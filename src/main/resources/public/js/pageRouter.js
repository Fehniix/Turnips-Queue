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
		const pages = await $.get('/pagesFolderContents');

		await pages.asyncForEach(async page => {
			//	The RESTful entrypoint above returns a JSON array of filenames. The filename also corresponds to the name of the page.
			const pageName = page.replace(/\.js/, '');

			//	Dynamically import the pages.
			this.pageRefs[pageName] = await import(`./pages/${page}`);

			//	And set the PageHandler reference.
			this.pageRefs[pageName].default.setPageHandler(pageHandler);
		});
	}
}

export default new PageRouter();