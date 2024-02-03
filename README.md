# IsiahBitmapTools
 A plugin for RPG Maker MV/MZ sdfsdthat adds extra functionality to the Bitmap class

[You can download the plugin directly here](IsiahBitmapTools.js)

## New Bitmap functions


| Function | Description|
| -------- | ---------- |
| drawPolygon | Draws a shape of a solid color using an array of coordinates |
| clearPolygon | Clears a shape made of the specified coordinates |
| clearCircle | Clears in the shape of a circle |
| clearImage | Clears in the shape of the specified bitmap, ignoring transparencies |
| circlet | Performs a block transfer, but in a circle shape |
| polyt | Performs a block transfer, but in a polygon shape specified by coordinates |
| blurTransparent | An improvement over Bitmap.prototype.blur which allows the use of transparent images |
| bltFade | Performs a block transfer fading out in the specified direction |

### drawPolygon

> Bitmap.prototype.drawPolygon(coordinateArray: array, color: string, fill: boolean, thickness?: number)

Draws a shape of a solid color using an array of coordinates.

| Parameters | Data Type | Description |
| ---------- | --------- | ----------- |
| coordinateArray | Object array | An array of objects with 2 data members: x and y. This is the coordinates on the bitmap that will form the polygonal shape to draw |
| color | string | The color of the polygon to be drawn in CSS format.
| fill | boolean | Whether the polygon will be solid (true) or an outline (false) |
| thickness | number | The number of pixels thick the line will be drawn if the polygon is an outline |

Example:
```
var triangleCoordinates = [
    { x: 50, y: 25 },
    { x: 25, y: 50 },
    { x: 75, y: 50 },
    { x: 50, y: 25 }
]
bitmap.drawPolygon(triangleCoordinates, 'red', true);
bitmap.drawPolygon(triangleCoordinates, 'white', false, 2);
```
The above code will draw a filled-in red triangle with a white outline.

### clearPolygon

> Bitmap.prototype.clearPolygon(coordinateArray: array)

Clears a shape made of the specified coordinates.

| Parameters | Data Type | Description |
| ---------- | --------- | ----------- |
| coordinateArray | Object array | An array of objects with 2 data members: x and y. This is the coordinates on the bitmap that will form the polygonal shape to draw |

Example:
```
var triangleCoordinates = [
    { x: 50, y: 25 },
    { x: 25, y: 50 },
    { x: 75, y: 50 },
    { x: 50, y: 25 }
]
bitmap.fillAll('white');
bitmap.clearPolygon(triangleCoordinates);
```
The above code will fill the bitmap with white, and then clear a triangle shape.

### clearCircle

> Bitmap.prototype.clearCircle(x: number, y: number, radius: number)

Clears in the shape of a circle

| Parameters | Data Type | Description |
| ---------- | --------- | ----------- |
| x | number | The x coordinate of the center of the circle |
| y | number | The y coordinate of the center of the circle |
| x | number | The radius of the circle |

Example:
```
bitmap.drawCircle(50, 50, 25);
bitmap.clearCircle(50, 50, 20);
```
The above code will leave an outline of a circle with a thickness of 5.

### clearImage

> Bitmap.prototype.clearImage(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number)

Clears in the shape of the specified bitmap, ignoring transparencies

If you're familiar with Bitmap.prototype.blt(), you'll recognize these parameters. It is effectively a block transfer, but erasing instead of drawing.

| Parameters | Data Type | Description |
| ---------- | --------- | ----------- |
| source | Bitmap | The bitmap to use to determine which pixels to clear |
| sx | number | The x coordinate in the source |
| sy | number | The y coordinate in the source |
| sw | number | The width of the source image |
| sh | number | The height of the source image |
| dx | number | The x coordinate in the destination |
| dy | number | The y coordinate in the destination |
| dw | number | The width in the destination |
| dh | number | The height in the destination |

Example:
```
var face = ImageManager.loadFace("Actors1");
bitmap.fillAll('white');
bitmap.clearImage(face, 0, 0, ImageManager.faceWidth, ImageManager.faceHeight, 12, 12);
```
The above code fills the bitmap with white and then cuts out a hole in the shape of the first actor's face. Note, this code uses ImageManager.faceWidth/faceHeight, which are in MZ but not MV. The MV equivalent is Window_Base._faceWidth/_faceHeight.

### circlet

> Bitmap.prototype.circlet(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number)

This is an alternate version of Bitmap.prototype.blt() which draws in a circle instead of a square. The radius of the circle is obtained from sw and sh.

| Parameters | Data Type | Description |
| ---------- | --------- | ----------- |
| source | Bitmap | The bitmap to draw |
| sx | number | The x coordinate in the source |
| sy | number | The y coordinate in the source |
| sw | number | The width of the source image |
| sh | number | The height of the source image |
| dx | number | The x coordinate in the destination |
| dy | number | The y coordinate in the destination |
| dw | number | The width in the destination |
| dh | number | The height in the destination |

Example:
```
var squareBitmap = ImageManager.loadSystem("bigSquare");
bitmap.circlet(0, 0, squareBitmap.width, squareBitmap.height, 0, 0);
```
The above code will load an image which is just a large square and draw a circle using that image, cropping out the corners. Arguably adding more corners in the process.

### polyt

> Bitmap.prototype.polyt(source: Bitmap, sx: number, sy: number, sw: number, sh: number, coordinateArray: array, dx: number, dy: number)

This is an alternate version of Bitmap.prototype.blt() which draws in a polygonal shape. A fusion of blt and drawPolygon.

| Parameters | Data Type | Description |
| ---------- | --------- | ----------- |
| source | Bitmap | The bitmap to draw |
| sx | number | The x coordinate in the source |
| sy | number | The y coordinate in the source |
| sw | number | The width of the source image |
| sh | number | The height of the source image |
| coordinateArray | Object array | An array of objects with 2 data members: x and y. This is the coordinates on the bitmap that will form the polygonal shape to draw |
| dx | number | The x coordinate in the destination |
| dy | number | The y coordinate in the destination |

Example:
```
var face = ImageManager.loadFace("Actors1");
var triangleCoordinates = [
    { x: 50, y: 25 },
    { x: 25, y: 50 },
    { x: 75, y: 50 },
    { x: 50, y: 25 }
]
bitmap.polyt(face, 0, 0, ImageManager.faceWidth, ImageManager.faceHeight, triangleCoordinates, 0, 0);
```
The above code will draw a triangle's worth of a character's face.

### blurTransparent

> Bitmap.prototype.blurTransparent()

An improvement over Bitmap.prototype.blur() which allows the use of transparent images. The edges of color may bleed and darken slightly, and the effect becomes more pronounced when repeatedly blurring the same bitmap.

Example:
```
var face = ImageManager.loadFace("Actors1");
bitmap.blt(face, 0, 0, ImageManager.faceWidth, ImageManager.faceHeight, 0, 0);
bitmap.blurTransparent();
```
The above code will draw an actor's face and then blur it.

### clearByColor

> Bitmap.prototype.clearByColor(color: string)

Clears all pixels of the specified color

| Parameters | Data Type | Description |
| ---------- | --------- | ----------- |
| color | string | The color to be erased from the bitmap in CSS format. |

Example:
```
bitmap.clearByColor('white');
```
The above code will erase the color white from a bitmap.