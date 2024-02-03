//=============================================================================
// IsiahBitmapTools.js
//=============================================================================

/*:
 * @author Isiah Brighton
 * @plugindesc v1.0 A utility plugin that adds more features to the Bitmap, allowing for more advanced draw functionality. Covered under MIT License.
 * @target MZ
 * @url https://github.com/IsiahBrighton/IsiahBitmapTools
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
 * Bitmap Function Reference
 * ============================================================================
 * 
 * A detailed list of functions and parameter descriptions can be found in
 * the README at:
 * https://github.com/IsiahBrighton/IsiahBitmapTools/blob/main/README.md
 * 
 * 
 *     drawPolygon(coordinateArray, color, fill, thickness)
 * This draws a shape of a solid color using an array of coordinates.
 * 
 *     clearPolygon(coordinateArray)
 * Clears a shape made of the specified coordinates.
 * 
 *     clearCircle(x, y, radius)
 * Clears in the shape of a cirlce
 * 
 *     clearImage(source, sx, sy, sw, sh, dx, dy, dw, dh)
 * Clears in the shape of the specified bitmap, ignoring transparencies.
 * 
 *     circlet(source, sx, sy, sw, sh, dx, dy, dw, dh)
 * An alternate version of Bitmap.prototype.blt() which draws in a circle
 * instead of a square.
 * 
 *     polyt(source, sx, sy, sw, sh, coordinateArray, dx, dy)
 * An alternate version of Bitmap.prototype.blt() which draws in a 
 * polygonal shape. A fusion of blt and drawPolygon
 * 
 *     blurTransparent()
 * An improvement over Bitmap.prototype.blur() which allows the use of 
 * transparent images. The edges of color may bleed and darken slightly, 
 * and the effect becomes more pronounced when repeatedly blurring the same 
 * bitmap.
 * 
 *     clearByColor(color)
 * Removes all pixels from the bitmap of the supplied color.
 * 
 *         
 * ============================================================================
 * MIT License
 * ============================================================================
 * 
 * Copyright (c) 2023 IsiahBrighton
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN  THE SOFTWARE.
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

Bitmap.prototype.clearCircle = function (x, y, radius)
{
	var context = this._context;
	context.save();
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

Bitmap.prototype.clearByColor = function (color)
{
	for (var x = 0; x < this.width; x += 3)
	{
		for (var y = 0; y < this.height; y += 3)
		{
			var pixelColor = this.getPixel(x, y);
			if (pixelColor.toString() == color)
			{
				this.clearRect(x, y, 3, 3);
			}
		}
	}
}
