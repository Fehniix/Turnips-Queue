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

	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};
}

export default loadExtensions;