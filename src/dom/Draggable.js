<<<<<<< HEAD
/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
	includes: L.Mixin.Events,

	statics: {
		START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
		END: {
			mousedown: 'mouseup',
			touchstart: 'touchend',
			pointerdown: 'touchend',
			MSPointerDown: 'touchend'
		},
		MOVE: {
			mousedown: 'mousemove',
			touchstart: 'touchmove',
			pointerdown: 'touchmove',
			MSPointerDown: 'touchmove'
		}
	},

	initialize: function (element, dragStartTarget) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
	},

	enable: function () {
		if (this._enabled) { return; }

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.on(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
		}

		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) { return; }

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.off(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
		}

		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		this._moved = false;

		if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		L.DomEvent.stopPropagation(e);

		if (L.Draggable._disabled) { return; }

		L.DomUtil.disableImageDrag();
		L.DomUtil.disableTextSelection();

		if (this._moving) { return; }

		var first = e.touches ? e.touches[0] : e;

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

		L.DomEvent
		    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
		    .on(document, L.Draggable.END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new L.Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }
		if (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }

		L.DomEvent.preventDefault(e);

		if (!this._moved) {
			this.fire('dragstart');

			this._moved = true;
			this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

			L.DomUtil.addClass(document.body, 'leaflet-dragging');
			this._lastTarget = e.target || e.srcElement;
			L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_updatePosition: function () {
		this.fire('predrag');
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag');
	},

	_onUp: function () {
		L.DomUtil.removeClass(document.body, 'leaflet-dragging');

		if (this._lastTarget) {
			L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
			this._lastTarget = null;
		}

		for (var i in L.Draggable.MOVE) {
			L.DomEvent
			    .off(document, L.Draggable.MOVE[i], this._onMove)
			    .off(document, L.Draggable.END[i], this._onUp);
		}

		L.DomUtil.enableImageDrag();
		L.DomUtil.enableTextSelection();

		if (this._moved && this._moving) {
			// ensure drag is not fired after dragend
			L.Util.cancelAnimFrame(this._animRequest);

			this.fire('dragend', {
				distance: this._newPos.distanceTo(this._startPos)
			});
		}

		this._moving = false;
	}
});
=======
/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Evented.extend({

	statics: {
		START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
		END: {
			mousedown: 'mouseup',
			touchstart: 'touchend',
			pointerdown: 'touchend',
			MSPointerDown: 'touchend'
		},
		MOVE: {
			mousedown: 'mousemove',
			touchstart: 'touchmove',
			pointerdown: 'touchmove',
			MSPointerDown: 'touchmove'
		}
	},

	initialize: function (element, dragStartTarget, preventOutline) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
		this._preventOutline = preventOutline;
	},

	enable: function () {
		if (this._enabled) { return; }

		L.DomEvent.on(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);

		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) { return; }

		L.DomEvent.off(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);

		this._enabled = false;
		this._moved = false;
	},

<<<<<<< HEAD
	updateMapBearing: function(mapBearing) {
		this._mapBearing = mapBearing;
	},
=======
	_onDown: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }
>>>>>>> origin/fix-ie11-disable-drag-on-click

	_onDown: function (e) {
		this._moved = false;

		if (L.DomUtil.hasClass(this._element, 'leaflet-zoom-anim')) { return; }

		if (L.Draggable._dragging || e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches) || !this._enabled) { return; }
		L.Draggable._dragging = true;  // Prevent dragging multiple objects at once.

		if (this._preventOutline) {
			L.DomUtil.preventOutline(this._element);
		}
<<<<<<< HEAD
=======

		if (L.Draggable._disabled) { return; }
>>>>>>> origin/drag-cancel-click

		L.DomUtil.disableImageDrag();
		L.DomUtil.disableTextSelection();

		if (this._moving) { return; }

		this.fire('down');

		var first = e.touches ? e.touches[0] : e;

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

		L.DomEvent
		    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
		    .on(document, L.Draggable.END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
<<<<<<< HEAD
=======
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }

>>>>>>> origin/fix-ie11-disable-drag-on-click
		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new L.Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint),
		    bearing = this._mapBearing || 0;

// 		console.log(offset, bearing, offset.rotate(bearing));
		if (bearing) {
			offset = offset.rotate(-bearing);
		}

		if (!offset.x && !offset.y) { return; }
		if (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }

		L.DomEvent.preventDefault(e);

		if (!this._moved) {
			this.fire('dragstart');

			this._moved = true;
			this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

			L.DomUtil.addClass(document.body, 'leaflet-dragging');

			this._lastTarget = e.target || e.srcElement;
			L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		L.Util.cancelAnimFrame(this._animRequest);
		this._lastEvent = e;
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true);
	},

	_updatePosition: function () {
		var e = {originalEvent: this._lastEvent};
		this.fire('predrag', e);
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag', e);
	},

<<<<<<< HEAD
	_onUp: function () {
=======
	_onUp: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }

>>>>>>> origin/fix-ie11-disable-drag-on-click
		L.DomUtil.removeClass(document.body, 'leaflet-dragging');

		if (this._lastTarget) {
			L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
			this._lastTarget = null;
		}

		for (var i in L.Draggable.MOVE) {
			L.DomEvent
			    .off(document, L.Draggable.MOVE[i], this._onMove, this)
			    .off(document, L.Draggable.END[i], this._onUp, this);
		}

		L.DomUtil.enableImageDrag();
		L.DomUtil.enableTextSelection();

		if (this._moved && this._moving) {
			// ensure drag is not fired after dragend
			L.Util.cancelAnimFrame(this._animRequest);

			this.fire('dragend', {
				distance: this._newPos.distanceTo(this._startPos)
			});

			L.DomUtil.suppressClick();
		}

		this._moving = false;
		L.Draggable._dragging = false;
	}
});
>>>>>>> origin/rotate
