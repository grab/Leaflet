/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
<<<<<<< HEAD
	// @section Mousewheel options
	// @option scrollWheelZoom: Boolean|String = true
	// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
	// it will zoom to the center of the view regardless of where the mouse was.
	scrollWheelZoom: true,
<<<<<<< HEAD

	// @option wheelDebounceTime: Number = 40
	// Limits the rate at which a wheel can fire (in milliseconds). By default
	// user can't zoom via wheel more often than once per 40 ms.
	wheelDebounceTime: 40,

	// @option wheelPxPerZoomLevel: Number = 50
	// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
	// mean a change of one full zoom level. Smaller values will make wheel-zooming
	// faster (and vice versa).
	wheelPxPerZoomLevel: 50
=======
	wheelDebounceTime: 40,
	scrollAtZoomLimits: false
>>>>>>> origin/scroll-prevent
=======
	scrollWheelZoom: true
>>>>>>> origin/linearzoom2
});

L.Map.ScrollWheelZoom = L.Handler.extend({
	addHooks: function () {
<<<<<<< HEAD
		L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);
=======
		L.DomEvent.on(this._map._container, {
			mousewheel: this._onWheelScroll,
<<<<<<< HEAD
			MozMousePixelScroll: this._preventScroll
=======
			MozMousePixelScroll: L.DomEvent.preventDefault,
			mouseenter: this._cacheOffset
>>>>>>> origin/cache-mouse-pos
		}, this);
<<<<<<< HEAD
>>>>>>> origin/scroll-prevent

		this._delta = 0;
=======
>>>>>>> origin/linearzoom2
	},

	removeHooks: function () {
<<<<<<< HEAD
		L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll, this);
=======
		L.DomEvent.off(this._map._container, {
			mousewheel: this._onWheelScroll,
			MozMousePixelScroll: this._preventScroll
		}, this);
>>>>>>> origin/scroll-prevent
	},

	_onWheelScroll: function (e) {
<<<<<<< HEAD
		var delta = L.DomEvent.getWheelDelta(e);

		var debounce = this._map.options.wheelDebounceTime;
		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);
=======
		var delta = L.DomEvent.getWheelDelta(e),
			map = this._map,
			mousePos = map.mouseEventToContainerPoint(e);
>>>>>>> origin/linearzoom2

		if (!map._animatingZoom) {
			this._performZoom(delta, mousePos);
		} else {
			map.once('moveend', L.bind(this._performZoom, this, delta, mousePos));
		}

<<<<<<< HEAD
		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(L.bind(this._performZoom, this), left);

		this._preventScroll(e, delta);
	},

	_preventScroll: function(e, delta) {
		var map = this._map;
		if (map.options.scrollAtZoomLimits) {
			if (!delta) { delta = L.DomEvent.getWheelDelta(e); }
			var zoom = map.getZoom();
			if ((delta < 0 && map.getMinZoom() >= zoom) ||
				(delta > 0 && map.getMaxZoom() <= zoom)) {
				return;
			}
		}
=======
>>>>>>> origin/linearzoom2
		L.DomEvent.stop(e);
	},

	_performZoom: function (delta, mousePos) {
		var map = this._map,
<<<<<<< HEAD
		    zoom = map.getZoom(),
		    snap = this._map.options.zoomSnap || 0;
=======
		    zoom = map.getZoom();
>>>>>>> origin/linearzoom2

		map._stop(); // stop panning and fly animations if any

<<<<<<< HEAD
		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
		var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
		    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
		    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
		    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;
=======
		delta = delta > 0 ? 1 : -1;
		delta = map._limitZoom(zoom + delta) - zoom;
>>>>>>> origin/linearzoom2

		if (!delta) { return; }

		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta);
		} else {
			map.setZoomAround(mousePos, zoom + delta);
		}
	},

	_cacheOffset: function () {
		var el = this._map._container;
		// jshint camelcase: false
		el._leaflet_offset = L.DomUtil.getOffset(el);
	}
});

// @section Handlers
// @property scrollWheelZoom: Handler
// Scroll wheel zoom handler.
L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);
