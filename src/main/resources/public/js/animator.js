class Animator {
	constructor() {

	}

 	slideOff(htmlElement) {
		return new Promise((resolve, _) => {
			$(htmlElement).animate({
				left: '-100vw',
				opacity: '0'
			}, 250, () => {
				$(htmlElement).hide();
				$(htmlElement).css('left', '100vw');
				resolve(); 
			});
		});
	}

	slideOn(htmlElement) {
		return new Promise((resolve, _) => {
			$(htmlElement).show();
			$(htmlElement).animate({
				left: '0vw',
				opacity: '1'
			}, 250, () => {
				resolve(); 
			});
		});
	}

	/**
	 * Shows the modal to the user.
	 * @param {*} modalId The modal root's ID.
	 */
	showModal(modalId) {
		const blackOverlay = $('.blackOverlay');
		const modal = $(`#${modalId}`);

		$(modal).css('top', '-40%');
		$(modal).css('opacity', '0');
		$(modal).show().animate({
			top: '50%',
			opacity: '1'
		}, 250);

		$(blackOverlay).css('opacity', '0');
		$(blackOverlay).show().animate({
			opacity: 1
		}, 250);
	}

	/**
	 * Hides all currently displayed modals. Supposedly only one is currently shown.
	 */
	hideModal() {
		$('.modal').animate({
			top: '-40%',
			opacity: '0'
		}, 250, () => {
			$('.modal').hide();
		});

		$('.blackOverlay').animate({
			opacity: '0'
		}, 250, () => {
			$('.blackOverlay').hide();
		});
	}
}

export default new Animator();