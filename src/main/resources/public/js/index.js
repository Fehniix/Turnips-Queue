'use strict';

import PageHandler from './pageHandler.js';
import PageRouter from './pageRouter.js';
import Animator from './animator.js';
import Extensions from './extensions.js';

//	Main, and strictly anonoymous, entry point.
(() => {
	window.addEventListener('load', () => {
		//	Load extensions first.
		Extensions();

		//	Initialize the Page Handler.
		PageHandler.initialize();

		//	Load pages dynamically.
		PageRouter.loadPages(PageHandler);

		//	Global binds.
		//	Available events:
		//	islandsLoaded, pageSwapped.
		$(window).on('islandsLoaded', _ => {
			$('.island').each((index, element) => {
				//	Rotate island notes randomly.
				console.log(element)
			});
		});

		//	Modals
		$('#linkRules').on('click', _ => {
			Animator.showModal('modalRules');
		});

		$('#linkFAQ').on('click', _ => {
			Animator.showModal('modalFAQ');
		});

		$('.blackOverlay').on('click', _ => {
			Animator.hideModal();
		});
	});
})();