(function(global) {
/**
* 
* https://github.com/TooTallNate/ansi.js
* 
* References:
*
* - http://en.wikipedia.org/wiki/ANSI_escape_code
* - http://www.termsys.demon.co.uk/vtansi.htm
*
*/

var prefix = '\x1b[' // For all escape codes
  , suffix = 'm'; // Only for color codes

/**
* The ANSI escape sequences.
*/

var codes = {
    up: 'A'
  , down: 'B'
  , forward: 'C'
  , back: 'D'
  , nextLine: 'E'
  , previousLine: 'F'
  , horizontalAbsolute: 'G'
  , eraseData: 'J'
  , eraseLine: 'K'
  , scrollUp: 'S'
  , scrollDown: 'T'
  , savePosition: 's'
  , restorePosition: 'u'
  , queryPosition: '6n'
  , hide: '?25l'
  , show: '?25h'
};

/**
* Rendering ANSI codes.
*/

var styles = {
    bold: 1
  , italic: 3
  , underline: 4
  , inverse: 7
};

/**
* The negating ANSI code for the rendering modes.
*/

var reset = {
    bold: 22
  , italic: 23
  , underline: 24
  , inverse: 27
};

/**
* The standard, styleable ANSI colors.
*/

var colors = {
    white: 37
  , black: 30
  , blue: 34
  , cyan: 36
  , green: 32
  , magenta: 35
  , red: 31
  , yellow: 33
  , grey: 90
  , brightBlack: 90
  , brightRed: 91
  , brightGreen: 92
  , brightYellow: 93
  , brightBlue: 94
  , brightMagenta: 95
  , brightCyan: 96
  , brightWhite: 97
};

/**
* The `Cursor` class.
*/

function Cursor () {
  
  // controls the foreground and background colors
  this.fg = this.foreground = new Colorer(this, 0);
  this.bg = this.background = new Colorer(this, 10);

  // defaults
  this.Bold = false;
  this.Italic = false;
  this.Underline = false;
  this.Inverse = false;

  // keep track of the number of "newlines" that get encountered
  this.newlines = 0;
  
 
}

global.Cursor = Cursor;

function Colorer (cursor, base) {
  this.current = null
  this.cursor = cursor
  this.base = base
}
global.Colorer = Colorer;

/**
* Write an ANSI color code, ensuring that the same code doesn't get rewritten.
*/

Colorer.prototype._setColorCode = function setColorCode (code) {
  var c = String(code)
  if (this.current === c) return
  this.cursor.enabled && this.cursor.write(prefix + c + suffix)
  this.current = c
  return this
}

/**
* Set up the positional ANSI codes.
*/

Object.keys(codes).forEach(function (name) {
  var code = String(codes[name])
  Cursor.prototype[name] = function () {
    var c = code
    if (arguments.length > 0) {
      c = toArray(arguments).map(Math.round).join(';') + code
    }
    return prefix + c;
  }
})

/**
* Set up the functions for the rendering ANSI codes.
*/

Object.keys(styles).forEach(function (style) {
  var name = style[0].toUpperCase() + style.substring(1)
    , c = styles[style]
    , r = reset[style]

  Cursor.prototype[style] = function () {
    if (this[name]) return
    this.enabled && this.write(prefix + c + suffix)
    this[name] = true
    return this
  }

  Cursor.prototype['reset' + name] = function () {
    if (!this[name]) return
    return (prefix + r + suffix)
    return this
  }
})

/**
* Setup the functions for the standard colors.
*/

Object.keys(colors).forEach(function (color) {
  var code = colors[color]

  Colorer.prototype[color] = function () {
    this._setColorCode(this.base + code)
    return this.cursor
  }

  Cursor.prototype[color] = function () {
    return this.foreground[color]()
  }
})

/**
* Makes a beep sound!
*/

Cursor.prototype.beep = function () {
  return ('\x07')
  return this;
}

/**
* Moves cursor to specific position
*/

Cursor.prototype.goto = function (x, y) {
   // console.log("goto x:"+x+"y:"+y);
   // console.log("prefix:"+prefix);
  x = x | 0;
  y = y | 0;
  var retValue = prefix + y + ';' + x + 'H';
  //console.log("goto Returning "+y + ';' + x + 'H');
  return retValue;
}

Cursor.prototype.forward = function (cols) {
    //console.log("forward by:"+cols);
  
  var retValue = prefix + cols + 'C';
  //console.log("Returning "+retValue.length);
  return retValue;
}

Cursor.prototype.backward = function (cols) {
    //console.log("backward by:"+cols);
  
  var retValue = prefix + cols + 'D';
  //console.log("Returning "+retValue.length);
  return retValue;
}

Cursor.prototype.down = function (cols) {
    //console.log("down by:"+cols);
  
  var retValue = prefix + cols + 'B';
  //console.log("Returning "+retValue.length);
  return retValue;
}

Cursor.prototype.up = function (cols) {
    //console.log("up by:"+cols);
  
  var retValue = prefix + cols + 'A';
  //console.log("Returning "+retValue.length);
  return retValue;
}

/**
* Resets the color.
*/

Colorer.prototype.reset = function () {
  this._setColorCode(this.base + 39)
  return this.cursor;
}

/**
* Resets all ANSI formatting on the stream.
*/

Cursor.prototype.reset = function () {
  
  this.Bold = false
  this.Italic = false
  this.Underline = false
  this.Inverse = false
  this.foreground.current = null
  this.background.current = null
  return this.enabled && this.write(prefix + '0' + suffix)
}

/**
* Sets the foreground color with the given RGB values.
* The closest match out of the 216 colors is picked.
*/

Colorer.prototype.rgb = function (r, g, b) {
	

  var base = this.base + 38
    , code = rgb(r, g, b)
  this._setColorCode(base + ';5;' + code)
	  
  return this.cursor;
}

/**
* Same as `cursor.fg.rgb(r, g, b)`.
*/

Cursor.prototype.rgb = function (r, g, b) {
  return this.foreground.rgb(r, g, b);
}

/**
* Accepts CSS color codes for use with ANSI escape codes.
* For example: `#FF000` would be bright red.
*/

Colorer.prototype.hex = function (color) {
  return this.rgb.apply(this, hex(color));
}

/**
* Same as `cursor.fg.hex(color)`.
*/

Cursor.prototype.hex = function (color) {
  return this.foreground.hex(color);
}


// UTIL FUNCTIONS //

/**
* Translates a 255 RGB value to a 0-5 ANSI RGV value,
* then returns the single ANSI color code to use.
*/

function rgb (r, g, b) {
  var red = r / 255 * 5
    , green = g / 255 * 5
    , blue = b / 255 * 5;

  return rgb5(red, green, blue);
}

/**
* Turns rgb 0-5 values into a single ANSI color code to use.
*/

function rgb5 (r, g, b) {
  var red = Math.round(r)
    , green = Math.round(g)
    , blue = Math.round(b);
  return 16 + (red*36) + (green*6) + blue;
}

/**
* Accepts a hex CSS color code string (# is optional) and
* translates it into an Array of 3 RGB 0-255 values, which
* can then be used with rgb().
*/

function hex (color) {
  var c = color[0] === '#' ? color.substring(1) : color
    , r = c.substring(0, 2)
    , g = c.substring(2, 4)
    , b = c.substring(4, 6);
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
}

/**
* Turns an array-like object into a real array.
*/

function toArray (a) {
  var i = 0
    , l = a.length
    , rtn = []
  for (; i<l; i++) {
    rtn.push(a[i])
  }
  return rtn
} 
  
}(this));