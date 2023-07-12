//=============================================================================
// IsiahBitmapTools.js
//=============================================================================

/*:
 * @author Isiah Brighton
 * @plugindesc v1.0 A utility plugin that adds more features to the Bitmap, allowing for more advanced draw functionality. Covered under MIT License.
 * @target MZ
 * 
 * @help
 * 
 * ============================================================================
 * Overview
 * ============================================================================
 * 
 * This plugin adds a number of extra functions to the Bitmap.
 * 
 * This plugin may be used by other plugin developers. It can be modified,
 * distrubuted, and so on as per the terms laid out in the MIT License.
 * 
 * ============================================================================
 * New Bitmap Functions
 * ============================================================================
 * 
 *     drawPolygon(coordinateArray, color, fill, thickness)
 * 
 * This draws a shape of a solid color using a coordinate of arrays.
 * 
 * Parameters:
 *     coordinateArray - an array of objects with 2 data members each: x and y
 *         These are the coordinates within the bitmap that the shape will be drawn.
 *         Example: [{x: 11, y: 11}, {x: 25, y: 11}, {x: 25, y: 40}, {x: 11, y: 11}]
 *     color - a color value (string, hex color code)
 *         The color of the polygon to be drawn.
 *     fill - boolean (true/false)
 *         Whether the polygon will be solid (true) or an outline (false)
 *     thickness - integer
 *         
 *         
 * 
 * 
 */

//MZ compatibility
if (Utils.RPGMAKER_NAME == "MZ")
{
	Bitmap.prototype._setDirty = function ()
	{
		this._baseTexture.update();
	}
}

Bitmap.prototype.bltFade = function (source, sx, sy, sw, sh, dx, dy, dw, dh, direction)
{
	direction = direction || 'down';
	dw = dw || sw;
	dh = dh || sh;

	var sizeRateW = dw / sw;
	var sizeRateH = dh / sw;

	var maxLoops;
	if (direction == 'down' || direction == 'up')
		maxLoops = sh;
	else
		maxLoops = sw;
	var opacity = 1;
	for (var i = 0; i < maxLoops; i++)
	{
		var bw = sw;
		var bh = 1;
		if (direction == 'left' || direction == 'right')
		{
			bw = 1;
			bh = sh;
		}
		var opacity = (i / maxLoops) * 255;
		if (direction == 'down' || direction == 'right')
			opacity = 255 - opacity;
		this.paintOpacity = opacity;

		var syy = sy + i;
		var sxx = sx;
		var dyy = dy + i;
		var dxx = dx;
		if (direction == 'left' || direction == 'right')
		{
			syy = sy;
			sxx = sx + i;
			dyy = dy;
			dxx = dx + i
		}

		var dww = bw;
		var dhh = bh * sizeRateH;

		this.blt(source, sxx, syy, bw, bh, dxx, dyy);
	}
}

Bitmap.prototype.drawPolygon = function (coordinateArray, color, fill, thickness)
{
	var context = this._context;
	context.save();
	context.fillStyle = color;
	context.strokeStyle = color;
	if (thickness != undefined)
		context.lineWidth = thickness;
	context.beginPath();
	context.moveTo(coordinateArray[0].x, coordinateArray[0].y);
	for (var i = 1; i < coordinateArray.length; i++)
	{
		var coordinate = coordinateArray[i];
		context.lineTo(coordinate.x, coordinate.y);
	}
	if (fill)
		context.fill();
	else
		context.stroke();
	context.restore();
	this._setDirty();
}

Bitmap.prototype.clearPolygon = function (coordinateArray)
{
	var context = this._context;
	context.save();
	context.beginPath();
	context.moveTo(coordinateArray[0].x, coordinateArray[0].y);
	for (var i = 1; i < coordinateArray.length; i++)
	{
		var coordinate = coordinateArray[i];
		context.lineTo(coordinate.x, coordinate.y);
	}
	//context.fill();
	context.clip();
	this.clear();
	context.restore();
};

Bitmap.prototype.clearCircle = function (x, y, radius, color)
{
	var context = this._context;
	context.save();
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2, false);
	context.clip();
	this.clear();
	context.restore();
	this._setDirty();
};

Bitmap.prototype.clearImage = function (source, sx, sy, sw, sh, dx, dy, dw, dh)
{
	dw = dw || sw;
	dh = dh || sh;
	if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
		sx + sw <= source.width && sy + sh <= source.height)
	{
		this._context.globalCompositeOperation = 'destination-out';
		this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
		this._setDirty();
	}
}

Bitmap.prototype.generateCoordinates = function (amount)
{
	var coordinates = []
	for (var i = 0; i < amount; i++)
	{
		var coordinate = {
			x: Math.floor(Math.random() * this.width),
			y: Math.floor(Math.random() * this.height)
		}
		coordinates.push(coordinate);
	}

	return coordinates;
}

Bitmap.prototype.circlet = function (source, sx, sy, sw, sh, dx, dy, dw, dh)
{
	dw = dw || sw;
	dh = dh || sh;
	var sr = Math.max(sw, sh) / 2;
	var context = this._context;
	context.save();
	context.fillStyle = 'rgba(0,0,0,0.0)'
	context.beginPath();
	context.arc(dx + sr, dy + sr, sr, 0, Math.PI * 2, false);
	context.fill();
	context.clip();
	context.globalCompositeOperation = 'source-over';
	context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
	context.restore();
	this._setDirty();
};

Bitmap.prototype.polyt = function (source, sx, sy, sw, sh, coordinateArray, dx, dy)
{
	var context = this._context;
	var lowestX = Number.MAX_VALUE;
	var lowestY = Number.MAX_VALUE;
	context.save();
	context.fillStyle = 'rgba(0,0,0,0.0)';
	context.beginPath();
	context.moveTo(coordinateArray[0].x, coordinateArray[0].y);
	for (var i = 1; i < coordinateArray.length; i++)
	{
		var coordinate = coordinateArray[i];
		context.lineTo(coordinate.x, coordinate.y);
				if (coordinate.x < lowestX)
					lowestX = coordinate.x;
				if (coordinate.y < lowestY)
					lowestY = coordinate.y;
	}
	context.clip();
	//context.fill();
	if (dx == undefined)
	{
		dx = lowestX;
		dy = lowestY;
	}

	context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, sw, sh);
	this._setDirty();
	context.restore();
}

Bitmap.prototype.blurTransparent = function ()
{
	for (var i = 0; i < 2; i++)
	{
		var w = this.width;
		var h = this.height;
		var canvas = this._canvas;
		var context = this._context;
		var tempCanvas = document.createElement('canvas');
		var tempContext = tempCanvas.getContext('2d');
		tempCanvas.width = w + 2;
		tempCanvas.height = h + 2;
		tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
		tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
		tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
		tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
		tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
		context.save();
		context.fillStyle = 'rgba(0,0,0,0.0)';
		context.fillRect(0, 0, w, h);
		context.globalCompositeOperation = 'darker';
		context.globalAlpha = 1 / 9;
		for (var y = 0; y < 3; y++)
		{
			for (var x = 0; x < 3; x++)
			{
				context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
			}
		}
		context.restore();
	}
	this._setDirty();
};

Scene_Title.prototype.create = function ()
{
	Scene_Base.prototype.create.call(this);
	this.createBackground();
	this.createForeground();
	this.createWindowLayer();
	this.createCommandWindow();
	this.createExtraSprite();
};

Scene_Title.prototype.createExtraSprite = function ()
{
	this._extraSprite = new Sprite();
	this._extraSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
	//this._extraSprite.bitmap.fillAll('white');
	this.addChild(this._extraSprite);
}