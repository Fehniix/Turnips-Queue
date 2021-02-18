'use strict';

import PageHandler from './pageHandler.js';
import Animator from './animator.js';

//	Main, and strictly anonoymous, entry point.
(() => {
	window.addEventListener('load', () => {
		//	Inject to jQuery's prototype a method to show FlexBox items.
		jQuery.prototype.showFlex = function() {
			this.css('display', 'flex');
		};

		//	Initialize the Page Handler.
		PageHandler.initialize();

		//	Event binding.

		$(window).on('islandsLoaded', _ => {
			$('.island').each((index, element) => {
				//	Rotate island notes randomly.
				console.log(element)
			});
		});
		
		//	Main page.
		$('#noteHost').on('click', _ => {
			PageHandler.swapToPage('host', true);
		});

		$('#noteJoin').on('click', _ => {
			PageHandler.swapToPage('island', true);
		});

		$('#noteIslands').on('click', _ => {
			PageHandler.swapToPage('islands', true);
		});

		//	Host page.
		$('.hostPage .btnCancel').on('click', _ => {
			PageHandler.swapToPage('main');
		});

		$('.hostPage .btnNext').on('click', _ => {
			PageHandler.swapToPage('hostStep2', true);
		});

		$('.hostPageStep2 .btnBack').on('click', _ => {
			PageHandler.swapToPage('host', true);
		});

		//	Island page
		$('.islandPage .btnBack').on('click', _ => {
			PageHandler.swapToPage('main');
		});

		// Islands page

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