'use strict';

import PageHandler from './pageHandler.js';
import Animator from './animator.js';

//	Main, and strictly anonoymous, entry point.
(() => {
	window.addEventListener('load', () => {
		//	Initialize the Page Handler.
		PageHandler.initialize();

		//	Event binding.
		
		//	Main page.
		$('#noteHost').on('click', _ => {
			PageHandler.swapToPage('host');
		});

		//	Host page.
		$('.hostPage .btnCancel').on('click', _ => {
			PageHandler.swapToPage('main');
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