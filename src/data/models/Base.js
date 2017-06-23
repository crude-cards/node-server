class Base {
	constructor(store) {
		Object.defineProperty(this, 'store', {
			value: store,
			writable: false,
			enumerable: false
		});
	}
}

module.exports = Base;
