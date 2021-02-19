function loadExtensions() {
	//	Inject to jQuery's prototype a method to show FlexBox items.
	jQuery.prototype.showFlex = function() {
		this.css('display', 'flex');
	};

	//	Asynchronous Array.forEach implementation.
	Array.prototype.asyncForEach = async function(callback) {
		for (let i = 0; i < this.length; ++i) {
			await callback(this[i]);
		}
	}
}

export default loadExtensions;