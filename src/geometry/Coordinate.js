/*
 * L.Coordinate represents a coordinate with x and y coordinates.
 */

L.Coordinate = function (/*Number*/ x, /*Number*/ y, /*Number*/ z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

L.Coordinate.prototype = {

	clone: function () {
		return new L.Coordinate(this.x, this.y, this.z);
	},

	floor: function () {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	},

	distanceTo: function (coordinate) {
		var x = coordinate.x - this.x,
		    y = coordinate.y - this.y;
		return Math.sqrt(x * x + y * y);
	},

	zoomTo: function (z) {
		return this.zoomBy(this.z - z);
	},

	zoomBy: function (distance) {
		var power = Math.pow(2, distance);
		return new L.Coordinate(this.x * power,
			 this.y * power,
			 this.z + distance);
	},

	toKey: function () {
		return this.x + ':' + this.y + ':' + this.z;
	},

	equals: function (coordinate) {
		return coordinate.x === this.x &&
			coordinate.y === this.y &&
			coordinate.z === this.z;
	},

	// converts tile coordinates to its geographical bounds
	toBounds: function (map, tileSize) {
		var point = this.toPoint(),
			nwPoint = point.multiplyBy(tileSize),
		    sePoint = point.add([tileSize, tileSize]),

		    nw = map.wrapLatLng(map.unproject(nwPoint, this.z)),
		    se = map.wrapLatLng(map.unproject(sePoint, this.z));

		return new L.LatLngBounds(nw, se);
	},

	toPoint: function () {
		return new L.Point(this.x, this.y);
	},

	getPos: function (tileSize, origin) {
		return this.toPoint()
			.multiplyBy(tileSize)
			.subtract(origin);
	},

	toString: function () {
		return 'Coordinate(' +
		        L.Util.formatNum(this.x) + ', ' +
		        L.Util.formatNum(this.y) + ', ' +
		        L.Util.formatNum(this.z) + ')';
	}
};

L.Coordinate.fromKey = function (key) {
	var kArr = key.split(':'),
	    x = parseInt(kArr[0], 10),
	    y = parseInt(kArr[1], 10),
	    z = parseInt(kArr[1], 10);
	return new L.Coordinate(x, y, z);
};

L.coordinate = function (x, y, z) {
	if (x instanceof L.Coordinate) {
		return x;
	}
	if (L.Util.isArray(x)) {
		return new L.Coordinate(x[0], x[1], x[2]);
	}
	if (x === undefined || x === null) {
		return x;
	}
	return new L.Coordinate(x, y, z);
};
