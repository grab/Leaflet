/*
 * L.Handler.TouchRotate is used by L.Map to add two-finger rotation gestures.
 */

L.Map.mergeOptions({
	touchRotate: L.Browser.touch && !L.Browser.android23
});

L.Map.TouchRotate = L.Handler.extend({
	addHooks: function () {
		this._map.touchGestures.enable();
		this._map.touchGestures.rotate = true;
	},

	removeHooks: function () {
		this._map.touchGestures.rotate = false;
	}
});

L.Map.addInitHook('addHandler', 'touchRotate', L.Map.TouchRotate);
