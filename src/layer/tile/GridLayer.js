/*
 * @class GridLayer
 * @inherits Layer
 * @aka L.GridLayer
 *
 * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
 * GridLayer can be extended to create a tiled grid of HTML Elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
 *
 *
 * @section Synchronous usage
 * @example
 *
 * To create a custom layer, extend GridLayer and impliment the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
 *
 * ```js
 * var CanvasLayer = L.GridLayer.extend({
 *     createTile: function(coords){
 *         // create a <canvas> element for drawing
 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         var size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
 *         var ctx = canvas.getContext('2d');
 *
 *         // return the tile so it can be rendered on screen
 *         return tile;
 *     }
 * });
 * ```
 *
 * @section Asynchrohous usage
 * @example
 *
 * Tile creation can also be asyncronous, this is useful when using a third-party drawing library. Once the tile is finsihed drawing it can be passed to the done() callback.
 *
 * ```js
 * var CanvasLayer = L.GridLayer.extend({
 *     createTile: function(coords, done){
 *         var error;
 *
 *         // create a <canvas> element for drawing
 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         var size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // draw something and pass the tile to the done() callback
 *         done(error, tile);
 *     }
 * });
 * ```
 *
 * @section
 */


L.GridLayer = L.Layer.extend({

	options: {
		// @option tileSize: Number|Point = 256
		// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
		tileSize: 256,

		// @option opacity: Number = 1.0
		// Opacity of the tiles. Can be used in the `createTile()` function.
		opacity: 1,

		// @option updateWhenIdle: Boolean = depends
		// If `false`, new tiles are loaded during panning, otherwise only after it (for better performance). `true` by default on mobile browsers, otherwise `false`.
		updateWhenIdle: L.Browser.mobile,
<<<<<<< HEAD
=======
		updateInterval: 200
>>>>>>> origin/pyramid

		// @option updateWhenZooming: Boolean = true
		// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
		updateWhenZooming: true,

		// @option updateInterval: Number = 200
		// Tiles will not update more than once every `updateInterval` milliseconds when panning.
		updateInterval: 200,

		// @option attribution: String = null
		// String to be shown in the attribution control, describes the layer data, e.g. "© Mapbox".
		attribution: null,

		// @option zIndex: Number = 1
		// The explicit zIndex of the tile layer.
		zIndex: 1,

		// @option bounds: LatLngBounds = undefined
		// If set, tiles will only be loaded inside inside the set `LatLngBounds`.
		bounds: null,

		// @option minZoom: Number = 0
		// The minimum zoom level that tiles will be loaded at. By default the entire map.
		minZoom: 0,

		// @option maxZoom: Number = undefined
		// The maximum zoom level that tiles will be loaded at.
//		maxZoom: undefined,

		// @option noWrap: Boolean = false
		// Whether the layer is wrapped around the antimeridian. If `true`, the
		// GridLayer will only be displayed once at low zoom levels.
		noWrap: false,

		// @option pane: String = 'tilePane'
		// `Map pane` where the grid layer will be added.
		pane: 'tilePane'
	},

	initialize: function (options) {
		options = L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._initContainer();

		this._levels = {};
		this._tiles = {};

<<<<<<< HEAD
<<<<<<< HEAD
		this._resetView();
=======
=======
		this._pruneTiles = L.Util.throttle(this._pruneTiles, 200, this);

>>>>>>> origin/prune2
		this._levels = {};
		this._tiles = {};
		this._cache = {};

		this._tiles = {};
		this._loaded = {};
		this._tilesToLoad = 0;

		this._reset();
>>>>>>> origin/pyramid
		this._update();
		map.on('rotateend', this._onMoveEnd, this);
	},

	beforeAdd: function (map) {
		map._addZoomLimit(this);
	},

	onRemove: function (map) {
<<<<<<< HEAD
		this._removeAllTiles();
=======
>>>>>>> origin/pyramid
		L.DomUtil.remove(this._container);
		map._removeZoomLimit(this);
		this._container = null;
		this._tileZoom = null;
		map.off('rotateend', this._onMoveEnd, this);
	},

	// @method bringToFront: this
	// Brings the tile layer to the top of all tile layers.
	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this._container);
			this._setAutoZIndex(Math.max);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings the tile layer to the bottom of all tile layers.
	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this._container);
			this._setAutoZIndex(Math.min);
		}
		return this;
	},

	// @method getAttribution: String
	// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
	getAttribution: function () {
		return this.options.attribution;
	},

	// @method getContainer: String
	// Returns the HTML element that contains the tiles for this layer.
	getContainer: function () {
		return this._container;
	},

	// @method setOpacity(opacity: Number): this
	// Changes the [opacity](#gridlayer-opacity) of the grid layer.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// @method setZIndex(zIndex: Number): this
	// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
	setZIndex: function (zIndex) {
		this.options.zIndex = zIndex;
		this._updateZIndex();

		return this;
	},

	// @method isLoading: Boolean
	// Returns `true` if any tile in the grid layer has not finished loading.
	isLoading: function () {
		return this._loading;
	},

	// @method redraw: this
	// Causes the layer to clear all the tiles and request them again.
	redraw: function () {
		if (this._map) {
			this._removeAllTiles();
			this._update();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			viewprereset: this._invalidateAll,
			viewreset: this._resetView,
			zoom: this._resetView,
			moveend: this._onMoveEnd
		};

		if (!this.options.updateWhenIdle) {
			// update tiles on move, but not more often than once per given interval
			if (!this._onMove) {
				this._onMove = L.Util.throttle(this._onMoveEnd, this.options.updateInterval, this);
			}

			events.move = this._onMove;
		}

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	// @section Extension methods
	// Layers extending `GridLayer` shall reimplement the following method.
	// @method createTile(coords: Object, done?: Function): HTMLElement
	// Called only internally, must be overriden by classes extending `GridLayer`.
	// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
	// is specified, it must be called when the tile has finished loading and drawing.
	createTile: function () {
		return document.createElement('div');
	},

	// @section
	// @method getTileSize: Point
	// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
	getTileSize: function () {
		var s = this.options.tileSize;
		return s instanceof L.Point ? s : new L.Point(s, s);
	},

	_updateZIndex: function () {
		if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._container.style.zIndex = this.options.zIndex;
		}
	},

	_setAutoZIndex: function (compare) {
		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

		var layers = this.getPane().children,
		    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

		for (var i = 0, len = layers.length, zIndex; i < len; i++) {

			zIndex = layers[i].style.zIndex;

			if (layers[i] !== this._container && zIndex) {
				edgeZIndex = compare(edgeZIndex, +zIndex);
			}
		}

		if (isFinite(edgeZIndex)) {
			this.options.zIndex = edgeZIndex + compare(-1, 1);
			this._updateZIndex();
		}
	},

	_updateOpacity: function () {
		if (!this._map) { return; }

		// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
		if (L.Browser.ielt9) { return; }

		L.DomUtil.setOpacity(this._container, this.options.opacity);

		var now = +new Date(),
		    nextFrame = false,
		    willPrune = false;

		for (var key in this._tiles) {
			var tile = this._tiles[key];
			if (!tile.current || !tile.loaded) { continue; }

			var fade = Math.min(1, (now - tile.loaded) / 200);

			L.DomUtil.setOpacity(tile.el, fade);
			if (fade < 1) {
				nextFrame = true;
			} else {
				if (tile.active) { willPrune = true; }
				tile.active = true;
			}
		}

		if (willPrune && !this._noPrune) { this._pruneTiles(); }

		if (nextFrame) {
			L.Util.cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
		}
	},

	_initContainer: function () {
		if (this._container) { return; }

		this._container = L.DomUtil.create('div', 'leaflet-layer');
		this._updateZIndex();

		if (this.options.opacity < 1) {
			this._updateOpacity();
<<<<<<< HEAD
=======
		}

		this.getPane().appendChild(this._container);
	},

	_pruneTiles: function (z) {
		function keys(_) {
			var l = [];
			for (var k in _) { l.push(k); }
			return l;
		}

		function map(_, fn) {
			var l = [];
			for (var i = 0; i < _.length; i++) {
				var val = fn(_[i]);
				if (val) { l.push(val); }
			}
			return l;
		}

		function zoomCoord(_) {
			var power = Math.pow(2, this._tileZoom - z),
				p = new L.Point(Math.floor(_.x * power), Math.floor(_.y * power));
			p.coord = _;
			return p;
		}

		if (!this._levels[this._tileZoom]) {
			return false;
		}

		var nativeTiles = this._levels[this._tileZoom].tiles,
			scaledTiles = this._levels[z].tiles,
			scaledCoords = map(map(keys(scaledTiles), this._keyToTileCoords), L.bind(zoomCoord, this)),
			bounds = this._getTileRange(this._map.getBounds(), this._tileZoom),
			scaled, i, key, that = this, delay = 500;

		function deferRemove(key, z) {
			return function () {
				var tile = that._levels[z].tiles[key];
				L.DomUtil.remove(tile);
				that.fire('tileunload', {tile: tile});
				delete that._levels[z].tiles[key];
			};
		}

		if (z < this._tileZoom) {
			for (i = 0; i < scaledCoords.length; i++) {
				scaled = scaledCoords[i];
				key = this._tileCoordsToKey(scaled);
				if ((key in nativeTiles && nativeTiles[key].complete) ||
					!bounds.contains(scaled)) {

					key = this._tileCoordsToKey(scaled.coord);
					setTimeout(deferRemove(z, key), delay);

				}
			}
		} else if (z > this._tileZoom) {
			var subs = Math.pow(4, z - this._tileZoom), neededSubs = {};
			for (i = 0; i < scaledCoords.length; i++) {
				scaled = scaledCoords[i];
				key = this._tileCoordsToKey(scaled);
				if ((key in nativeTiles && nativeTiles[key].complete) ||
					!bounds.contains(scaled)) {
					if (typeof neededSubs[key] === 'undefined') { neededSubs[key] = subs; }
					if (!--neededSubs[key].subs) {

						key = this._tileCoordsToKey(scaled.coord);
						setTimeout(deferRemove(z, key), delay);

					}
				}
			}
		}
	},

	_updateLevels: function () {
		var zoom = this._tileZoom;

		for (var z in this._levels) {
<<<<<<< HEAD
			this._levels[z].el.style.zIndex = -Math.abs(zoom - z);
=======
			z = parseInt(z, 10);
			if (z > zoom + 2 || z < zoom - 2) {
				this._destroyLevel(this._levels[z]);
				delete this._levels[z];
			} else {
                if (z !== zoom) { this._pruneTiles(z); }
                this._levels[z].el.style.zIndex = -Math.abs(zoom - z);
			}
>>>>>>> origin/prune
		}

		return (this._level = this._getLevel(zoom));
	},

	_getLevel: function (zoom) {
		if (this._levels[zoom]) {
			return this._levels[zoom];
>>>>>>> origin/pyramid
		}

		var level = {},
			map  = this._map;

<<<<<<< HEAD
		level.el = L.DomUtil.create('div',
			'leaflet-tile-container leaflet-zoom-animated leaflet-zoom-' + zoom, this._container);
		level.el.style.zIndex = 0;

		level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
		level.zoom = zoom;
		level.tiles = {};

		this._levels[zoom] = level;

=======
			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
			level.zoom = zoom;
		}

		this._level = level;

>>>>>>> origin/prune2
		return level;
	},

	_pruneTiles: function () {

		if (!this._map) { return; }

		this._retain = {};

		var bounds = this._map.getBounds(),
			z = this._tileZoom,
			range = this._getTileRange(bounds, z),
			i, j, key, found;

		for (i = range.min.x; i <= range.max.x; i++) {
			for (j = range.min.y; j <= range.max.y; j++) {

				key = i + ':' + j + ':' + z;

				this._retain[key] = true;

				if (!this._loaded[key]) {
					found = this._retainParent(i, j, z, z - 5) || this._retainChildren(i, j, z, z + 2);
				}
			}
		}

		for (key in this._tiles) {
			if (!this._retain[key]) {
				setTimeout(L.bind(this._deferRemove, this, key), 250);
			}
		}
	},

	_deferRemove: function (key) {
		if (!this._retain[key]) {
			this._removeTile(key);
		}
	},

	_retainParent: function (x, y, z, minZoom) {
		var x2 = Math.floor(x / 2),
			y2 = Math.floor(y / 2),
			z2 = z - 1;

		var key = x2 + ':' + y2 + ':' + z2;

		if (this._loaded[key]) {
			this._retain[key] = true;
			return true;

		} else if (z2 > minZoom) {
			return this._retainParent(x2, y2, z2, minZoom);
		}

		return false;
	},

	_retainChildren: function (x, y, z, maxZoom) {

		for (var i = 2 * x; i < 2 * x + 2; i++) {
			for (var j = 2 * y; j < 2 * y + 2; j++) {

				var key = i + ':' + j + ':' + (z + 1);

				if (this._loaded[key]) {
					this._retain[key] = true;

				} else if (z + 1 < maxZoom) {
					this._retainChildren(i, j, z + 1, maxZoom);
				}
			}
		}
	},

<<<<<<< HEAD
	_updateLevels: function () {

		var zoom = this._tileZoom,
		    maxZoom = this.options.maxZoom;

		if (zoom === undefined) { return undefined; }

		for (var z in this._levels) {
			if (this._levels[z].el.children.length || z === zoom) {
				this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
			} else {
				L.DomUtil.remove(this._levels[z].el);
				this._removeTilesAtZoom(z);
				delete this._levels[z];
			}
=======
	_reset: function (e) {
		var map = this._map,
		    zoom = map.getZoom(),
		    tileZoom = Math.round(zoom),
		    tileZoomChanged = this._tileZoom !== tileZoom;

		if (tileZoomChanged || e && e.hard) {
			this._tileZoom = tileZoom;
			this._updateLevels();
			this._resetGrid();
		}

		this._setZoomTransforms(map.getCenter(), zoom);
	},

	_setZoomTransforms: function (center, zoom) {
		for (var i in this._levels) {
			this._setZoomTransform(this._levels[i], center, zoom);
		}
	},

	_setZoomTransform: function (level, center, zoom) {
		var scale = this._map.getZoomScale(zoom, level.zoom),
		    translate = level.origin.multiplyBy(scale)
		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		L.DomUtil.setTransform(level.el, translate, scale);
	},

<<<<<<< HEAD
	_clearTiles: function () {
		for (var key in this._tiles) {
			this.fire('tileunload', {
				tile: this._tiles[key]
			});
>>>>>>> origin/pyramid
		}

		var level = this._levels[zoom],
		    map = this._map;

		if (!level) {
			level = this._levels[zoom] = {};

			level.el = L.DomUtil.create('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
			level.el.style.zIndex = maxZoom;

<<<<<<< HEAD
			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
			level.zoom = zoom;

			this._setZoomTransform(level, map.getCenter(), map.getZoom());

			// force the browser to consider the newly added element for transition
			L.Util.falseFn(level.el.offsetWidth);
		}

		this._level = level;

		return level;
	},

	_pruneTiles: function () {
		if (!this._map) {
			return;
		}

		var key, tile;

		var zoom = this._map.getZoom();
		if (zoom > this.options.maxZoom ||
			zoom < this.options.minZoom) {
			this._removeAllTiles();
			return;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			tile.retain = tile.current;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			if (tile.current && !tile.active) {
				var coords = tile.coords;
				if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
					this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
				}
			}
		}

		for (key in this._tiles) {
			if (!this._tiles[key].retain) {
				this._removeTile(key);
			}
		}
=======
		this._tileContainer.innerHTML = '';
	},

=======
>>>>>>> origin/prune2
	_resetGrid: function () {
		var map = this._map,
		    crs = map.options.crs,
		    tileSize = this._tileSize = this._getTileSize(),
		    tileZoom = this._tileZoom;

		var bounds = this._map.getPixelWorldBounds(this._tileZoom);
		if (bounds) {
			this._globalTileRange = this._pxBoundsToTileRange(bounds);
		}

		this._wrapX = crs.wrapLng && [
			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize),
			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize)
		];
		this._wrapY = crs.wrapLat && [
			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize),
			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize)
		];
>>>>>>> origin/pyramid
	},

	_removeTilesAtZoom: function (zoom) {
		for (var key in this._tiles) {
			if (this._tiles[key].coords.z !== zoom) {
				continue;
			}
			this._removeTile(key);
		}
	},

<<<<<<< HEAD
	_removeAllTiles: function () {
		for (var key in this._tiles) {
			this._removeTile(key);
		}
	},

	_invalidateAll: function () {
		for (var z in this._levels) {
			L.DomUtil.remove(this._levels[z].el);
			delete this._levels[z];
		}
		this._removeAllTiles();

		this._tileZoom = null;
	},

	_retainParent: function (x, y, z, minZoom) {
		var x2 = Math.floor(x / 2),
		    y2 = Math.floor(y / 2),
		    z2 = z - 1,
		    coords2 = new L.Point(+x2, +y2);
		coords2.z = +z2;

		var key = this._tileCoordsToKey(coords2),
		    tile = this._tiles[key];

		if (tile && tile.active) {
			tile.retain = true;
			return true;

		} else if (tile && tile.loaded) {
			tile.retain = true;
		}

		if (z2 > minZoom) {
			return this._retainParent(x2, y2, z2, minZoom);
		}

		return false;
	},

	_retainChildren: function (x, y, z, maxZoom) {

		for (var i = 2 * x; i < 2 * x + 2; i++) {
			for (var j = 2 * y; j < 2 * y + 2; j++) {

				var coords = new L.Point(i, j);
				coords.z = z + 1;

				var key = this._tileCoordsToKey(coords),
				    tile = this._tiles[key];

				if (tile && tile.active) {
					tile.retain = true;
					continue;

				} else if (tile && tile.loaded) {
					tile.retain = true;
				}

				if (z + 1 < maxZoom) {
					this._retainChildren(i, j, z + 1, maxZoom);
=======
	_update: function () {
		if (!this._map) { return; }

		// TODO move to reset
		// var zoom = this._map.getZoom();

		// if (zoom > this.options.maxZoom ||
		//     zoom < this.options.minZoom) { return; }

		var bounds = this._map.getBounds();

<<<<<<< HEAD
		this._updateTiles(tileRange);
=======
		if (this.options.unloadInvisibleTiles) {
			this._removeOtherTiles(bounds);
		}

		this._addTiles(bounds);
>>>>>>> origin/prune2
	},

	// tile coordinates range for particular geo bounds and zoom
	_getTileRange: function (bounds, zoom) {
		var pxBounds = new L.Bounds(
		        this._map.project(bounds.getNorthWest(), zoom),
		        this._map.project(bounds.getSouthEast(), zoom));
		return this._pxBoundsToTileRange(pxBounds);
	},

<<<<<<< HEAD
	_updateTiles: function (tileRange) {
		var queue = [],
			queueObject = {},
		    center = tileRange.getCenter();

		var x, y, z, coord,
			lookUp = (this.options.minZoom !== undefined ? (this.options.minZoom - this._tileZoom) : 0),
			zoomed, zoomedKey;
=======
	_addTiles: function (bounds) {
		var queue = [],
			tileRange = this._getTileRange(bounds, this._tileZoom),
		    center = tileRange.getCenter(),
			j, i, coords;
>>>>>>> origin/prune2

		// create a queue of coordinates to load tiles from
		for (y = tileRange.min.y; y <= tileRange.max.y; y++) {
			for (x = tileRange.min.x; x <= tileRange.max.x; x++) {

				coord = new L.Coordinate(x, y, this._tileZoom);

				// add tile to queue if it's not in cache or out of bounds
<<<<<<< HEAD
				if (!(coord.toKey() in this._level.tiles) &&
					this._isValidTile(coord)) {
					queue.push(coord);
					queueObject[coord.toKey()] = true;
					for (z = -1; z > lookUp; z--) {
						zoomed = coord.zoomBy(z).floor();
						zoomedKey = zoomed.toKey();
						if (zoomedKey in this._cache && !(zoomedKey in queueObject)) {
							queueObject[zoomedKey] = true;
							queue.push(zoomed);
							break;
						}
					}
>>>>>>> origin/pyramid
=======
				if (!(this._tileCoordsToKey(coords) in this._tiles) && this._isValidTile(coords)) {
					queue.push(coords);
>>>>>>> origin/prune2
				}
			}
		}
	},

	_resetView: function (e) {
		var animating = e && (e.pinch || e.flyTo);
		this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
	},

	_animateZoom: function (e) {
		this._setView(e.center, e.zoom, true, e.noUpdate);
	},

	_setView: function (center, zoom, noPrune, noUpdate) {
		var tileZoom = Math.round(zoom);
		if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
		    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
			tileZoom = undefined;
		}

		var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

		if (!noUpdate || tileZoomChanged) {

			this._tileZoom = tileZoom;

			if (this._abortLoading) {
				this._abortLoading();
			}

			this._updateLevels();
			this._resetGrid();

<<<<<<< HEAD
			if (tileZoom !== undefined) {
				this._update(center);
			}
=======
			this._update(center, tileZoom);
>>>>>>> origin/mobile-setview

			if (!noPrune) {
				this._pruneTiles();
			}

			// Flag to prevent _updateOpacity from pruning tiles during
			// a zoom anim or a pinch gesture
			this._noPrune = !!noPrune;
		}

<<<<<<< HEAD
		this._setZoomTransforms(center, zoom);
	},

	_setZoomTransforms: function (center, zoom) {
		for (var i in this._levels) {
			this._setZoomTransform(this._levels[i], center, zoom);
		}
	},
=======
		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(center) - b.distanceTo(center);
		});

		var tilesToLoad = queue.length;
>>>>>>> origin/prune2

	_setZoomTransform: function (level, center, zoom) {
		var scale = this._map.getZoomScale(zoom, level.zoom),
		    translate = level.origin.multiplyBy(scale)
		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		if (L.Browser.any3d) {
			L.DomUtil.setTransform(level.el, translate, scale);
		} else {
			L.DomUtil.setPosition(level.el, translate);
		}
	},

	_resetGrid: function () {
		var map = this._map,
		    crs = map.options.crs,
		    tileSize = this._tileSize = this.getTileSize(),
		    tileZoom = this._tileZoom;

		var bounds = this._map.getPixelWorldBounds(this._tileZoom);
		if (bounds) {
			this._globalTileRange = this._pxBoundsToTileRange(bounds);
		}

		this._wrapX = crs.wrapLng && !this.options.noWrap && [
			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
		];
		this._wrapY = crs.wrapLat && !this.options.noWrap && [
			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
		];
	},

	_onMoveEnd: function () {
<<<<<<< HEAD
		if (!this._map || this._map._animatingZoom) { return; }
=======
		if (!this._map || this._map.isRotating()) { return; }
>>>>>>> origin/rotate

		this._resetView();
	},

<<<<<<< HEAD
	_getTiledPixelBounds: function (center) {
		var map = this._map,
		    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
		    scale = map.getZoomScale(mapZoom, this._tileZoom),
		    pixelCenter = map.project(center, this._tileZoom).floor(),
		    halfSize = map.getSize().divideBy(scale * 2);
=======
	_getTiledPixelBounds: function (center, zoom, tileZoom) {
		var map = this._map;

		var scale = map.getZoomScale(zoom, tileZoom),
			pixelCenter = map.project(center, tileZoom).floor(),
// 			halfSize = map.getSize().divideBy(scale * 2);
		    size = map.getSize(),
// 		    halfSize = size.divideBy(scale * 2),
		    halfPaneSize = new L.Bounds([
		        map.containerPointToLayerPoint([0, 0]).floor(),
		        map.containerPointToLayerPoint([size.x, 0]).floor(),
		        map.containerPointToLayerPoint([0, size.y]).floor(),
		        map.containerPointToLayerPoint([size.x, size.y]).floor()
		    ]).getSize().divideBy(scale * 2);
>>>>>>> origin/rotate

		return new L.Bounds(pixelCenter.subtract(halfPaneSize), pixelCenter.add(halfPaneSize));
	},

	// Private method to load tiles in the grid's active zoom level according to map bounds
	_update: function (center) {
		var map = this._map;
		if (!map) { return; }
		var zoom = map.getZoom();

		if (center === undefined) { center = map.getCenter(); }
		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

		var pixelBounds = this._getTiledPixelBounds(center),
		    tileRange = this._pxBoundsToTileRange(pixelBounds),
		    tileCenter = tileRange.getCenter(),
		    queue = [];

// 		console.log('pxcenter:', pixelCenter);
// 		console.log('px:', pixelBounds.min, pixelBounds.max);
// 		console.log('tile:', tileRange.min, tileRange.max);

		for (var key in this._tiles) {
			this._tiles[key].current = false;
		}

		// _update just loads more tiles. If the tile zoom level differs too much
		// from the map's, let _setView reset levels and prune old tiles.
		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

		// create a queue of coordinates to load tiles from
		for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
			for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
				var coords = new L.Point(i, j);
				coords.z = this._tileZoom;

<<<<<<< HEAD
				if (!this._isValidTile(coords)) { continue; }

				var tile = this._tiles[this._tileCoordsToKey(coords)];
				if (tile) {
					tile.current = true;
				} else {
					queue.push(coords);
				}
			}
		}

		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
		});
=======
		this._tilesToLoad += tilesToLoad;
>>>>>>> origin/prune2

<<<<<<< HEAD
		if (queue.length !== 0) {
			// if its the first batch of tiles to load
			if (!this._loading) {
				this._loading = true;
				// @event loading: Event
				// Fired when the grid layer starts loading tiles
				this.fire('loading');
			}

			// create DOM fragment to append tiles in one batch
			var fragment = document.createDocumentFragment();

			for (i = 0; i < queue.length; i++) {
				this._addTile(queue[i], fragment);
			}

			this._level.el.appendChild(fragment);
		}
	},
=======
		var fragment, queues = {}, i;

		for (i = 0; i < tilesToLoad; i++) {
			if (!queues[queue[i].z]) { queues[queue[i].z] = []; }
			queues[queue[i].z].push(queue[i]);
		}

		for (z in queues) {
			// create DOM fragment to append tiles in one batch
			fragment = document.createDocumentFragment();
>>>>>>> origin/pyramid

			for (i = 0; i < queues[z].length; i++) {
				this._addTile(queues[z][i], fragment);
			}

<<<<<<< HEAD
		if (!crs.infinite) {
			// don't load tile if it's out of bounds and not wrapped
			var bounds = this._globalTileRange;
			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
		}

		if (!this.options.bounds) { return true; }

		// don't load tile if it doesn't intersect the bounds in options
		var tileBounds = this._tileCoordsToBounds(coords);
		return L.latLngBounds(this.options.bounds).overlaps(tileBounds);
	},

	_keyToBounds: function (key) {
		return this._tileCoordsToBounds(this._keyToTileCoords(key));
	},

	_keyToBounds: function (key) {
		return this._tileCoordsToBounds(this._keyToTileCoords(key));
	},

	// converts tile coordinates to its geographical bounds
	_tileCoordsToBounds: function (coords) {

		var map = this._map,
		    tileSize = this.getTileSize(),

		    nwPoint = coords.scaleBy(tileSize),
		    sePoint = nwPoint.add(tileSize),

		    nw = map.wrapLatLng(map.unproject(nwPoint, coords.z)),
		    se = map.wrapLatLng(map.unproject(sePoint, coords.z));

		return new L.LatLngBounds(nw, se);
	},

	// converts tile coordinates to key for the tile cache
	_tileCoordsToKey: function (coords) {
		return coords.x + ':' + coords.y + ':' + coords.z;
	},

	// converts tile cache key to coordinates
	_keyToTileCoords: function (key) {
		var k = key.split(':'),
<<<<<<< HEAD
		    coords = new L.Point(+k[0], +k[1]);
		coords.z = +k[2];
		return coords;
=======
			this._getLevel(z).el.appendChild(fragment);
		}

		this._flushTiles(queueObject);
	},

	_flushTiles: function (queueObj) {
		for (var t in this._tiles) {
			if (!queueObj[t]) {
				this._removeTile(t);
=======
			coords = new L.Point(+k[0], +k[1]);
		coords.z = +k[2];
		return coords;
	},

	// remove any present tiles that are off the specified bounds
	_removeOtherTiles: function (bounds) {
		for (var key in this._tiles) {
			var tileBounds = this._keyToBounds(key);
			if (!bounds.intersects(tileBounds)) {
				this._removeTile(key);
>>>>>>> origin/prune2
			}
		}
	},

	_isValidTile: function (coord) {
		var crs = this._map.options.crs;

		if (!crs.infinite) {
			// don't load tile if it's out of bounds and not wrapped
			var bounds = this._globalTileRange;
			if ((!crs.wrapLng && (coord.x < bounds.min.x || coord.x > bounds.max.x)) ||
			    (!crs.wrapLat && (coord.y < bounds.min.y || coord.y > bounds.max.y))) { return false; }
		}

		if (!this.options.bounds) { return true; }

		// don't load tile if it doesn't intersect the bounds in options
		return L.latLngBounds(this.options.bounds)
			.intersects(coord.toBounds(this.map, this.options.tileSize));
>>>>>>> origin/pyramid
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];
		if (!tile) { return; }

<<<<<<< HEAD
		L.DomUtil.remove(tile.el);
=======
		if (tile.parentNode) {
			L.DomUtil.remove(tile);
		}
>>>>>>> origin/pyramid

		delete this._tiles[key];
		delete this._loaded[key];

<<<<<<< HEAD
		// @event tileunload: TileEvent
		// Fired when a tile is removed (e.g. when a tile goes off the screen).
		this.fire('tileunload', {
			tile: tile.el,
=======
		this.fire('tileunload', {
			tile: tile,
>>>>>>> origin/prune2
			coords: this._keyToTileCoords(key)
		});
	},

	_initTile: function (tile) {
		L.DomUtil.addClass(tile, 'leaflet-tile');

<<<<<<< HEAD
		var tileSize = this.getTileSize();
		tile.style.width = tileSize.x + 'px';
		tile.style.height = tileSize.y + 'px';
=======
		tile.style.width = this._tileSize + 'px';
		tile.style.height = this._tileSize + 'px';
>>>>>>> origin/pyramid

		tile.onselectstart = L.Util.falseFn;
		tile.onmousemove = L.Util.falseFn;

		// update opacity on tiles in IE7-8 because of filter inheritance problems
		if (L.Browser.ielt9 && this.options.opacity < 1) {
			L.DomUtil.setOpacity(tile, this.options.opacity);
		}

		// without this hack, tiles disappear after zoom on Chrome for Android
		// https://github.com/Leaflet/Leaflet/issues/2078
		if (L.Browser.android && !L.Browser.android23) {
			tile.style.WebkitBackfaceVisibility = 'hidden';
		}
	},

<<<<<<< HEAD
	_addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords),
		    key = this._tileCoordsToKey(coords);

		var tile = this.createTile(this._wrapCoords(coords), L.bind(this._tileReady, this, coords));
<<<<<<< HEAD
=======
	_addTile: function (coord, container) {
		var level = this._getLevel(coord.z),
			tilePos = coord.getPos(this._tileSize, level.origin),
		    key = coord.toKey();

		// wrap tile coords if necessary (depending on CRS)
		this._wrapCoords(coord);

		var tile = this.createTile(coord, L.bind(this._tileReady, this));
		tile.coord = coord;
>>>>>>> origin/pyramid
=======
>>>>>>> origin/prune2

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
<<<<<<< HEAD
			L.Util.requestAnimFrame(L.bind(this._tileReady, this, coords, null, tile));
=======
			setTimeout(L.bind(this._tileReady, this, coords, null, tile), 0);
>>>>>>> origin/prune2
		}

		L.DomUtil.setPosition(tile, tilePos);

		// save tile in cache
<<<<<<< HEAD
<<<<<<< HEAD
		this._tiles[key] = {
			el: tile,
			coords: coords,
			current: true
		};
=======
		level.tiles[key] = tile;

		this._tiles[key] = tile;
>>>>>>> origin/pyramid

		container.appendChild(tile);
		// @event tileloadstart: TileEvent
		// Fired when a tile is requested and starts loading.
=======
		this._tiles[key] = tile;

		container.appendChild(tile);
>>>>>>> origin/prune2
		this.fire('tileloadstart', {
			tile: tile,
			coords: coords
		});
	},

	_tileReady: function (coords, err, tile) {
<<<<<<< HEAD
		if (!this._map) { return; }

=======
>>>>>>> origin/prune2
		if (err) {
			// @event tileerror: TileEvent
			// Fired when there is an error loading a tile.
			this.fire('tileerror', {
				error: err,
				tile: tile,
				coords: coords
			});
		}

		var key = this._tileCoordsToKey(coords);

<<<<<<< HEAD
<<<<<<< HEAD
		tile = this._tiles[key];
		if (!tile) { return; }

		tile.loaded = +new Date();
		if (this._map._fadeAnimated) {
			L.DomUtil.setOpacity(tile.el, 0);
			L.Util.cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
		} else {
			tile.active = true;
			this._pruneTiles();
		}

		L.DomUtil.addClass(tile.el, 'leaflet-tile-loaded');

		// @event tileload: TileEvent
		// Fired when a tile loads.
		this.fire('tileload', {
			tile: tile.el,
			coords: coords
		});

		if (this._noTilesToLoad()) {
			this._loading = false;
			// @event load: TileEvent
			// Fired when the grid layer loaded all visible tiles.
			this.fire('load');

			if (L.Browser.ielt9 || !this._map._fadeAnimated) {
				L.Util.requestAnimFrame(this._pruneTiles, this);
			} else {
				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
				// to trigger a pruning.
				setTimeout(L.bind(this._pruneTiles, this), 250);
			}
=======
		this._cache[tile.coord.toKey()] = tile;
=======
		if (!this._tiles[key]) { return; }

		this._loaded[key] = true;
		this._pruneTiles();

		L.DomUtil.addClass(tile, 'leaflet-tile-loaded');

		this.fire('tileload', {
			tile: tile,
			coords: coords
		});
>>>>>>> origin/prune2

		this._tilesToLoad--;

		if (this._tilesToLoad === 0) {
			this.fire('load');
<<<<<<< HEAD
>>>>>>> origin/pyramid
=======
			this._updateLevels();
>>>>>>> origin/prune
		}

<<<<<<< HEAD
	_getTilePos: function (coords) {
		return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
	},

	_wrapCoords: function (coords) {
		var newCoords = new L.Point(
			this._wrapX ? L.Util.wrapNum(coords.x, this._wrapX) : coords.x,
			this._wrapY ? L.Util.wrapNum(coords.y, this._wrapY) : coords.y);
		newCoords.z = coords.z;
		return newCoords;
	},

	_pxBoundsToTileRange: function (bounds) {
		var tileSize = this.getTileSize();
		return new L.Bounds(
			bounds.min.unscaleBy(tileSize).floor(),
			bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
	},

	_noTilesToLoad: function () {
		for (var key in this._tiles) {
			if (!this._tiles[key].loaded) { return false; }
		}
		return true;
=======
		this._update();
	},

	_wrapCoords: function (coords) {
		var newCoords = new L.Point(
			this._wrapX ? L.Util.wrapNum(coords.x, this._wrapX) : coords.x,
			this._wrapY ? L.Util.wrapNum(coords.y, this._wrapY) : coords.y);
		newCoords.z = coords.z;
		return newCoords;
	},

	_pxBoundsToTileRange: function (bounds) {
		return new L.Bounds(
			bounds.min.divideBy(this._tileSize).floor(),
			bounds.max.divideBy(this._tileSize).ceil().subtract([1, 1]));
	},

	_animateZoom: function (e) {
		this._setZoomTransforms(e.center, e.zoom);
>>>>>>> origin/pyramid
	}
});

// @factory L.gridLayer(options?: GridLayer options)
// Creates a new instance of GridLayer with the supplied options.
L.gridLayer = function (options) {
	return new L.GridLayer(options);
};
