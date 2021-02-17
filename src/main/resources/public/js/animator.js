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
}

export default new Animator();