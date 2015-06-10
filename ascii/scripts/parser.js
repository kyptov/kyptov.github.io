/**
 * Created by Alexandr on 30.05.2015.
 * @namespace printthat
 */
"use strict";
(function(global) {

    var INPUT_WIDTH = 20;

    var defaultColors = {
        text: {
            fg : [255,255,255],
            bg : [0,0,0]
        },
        input: {
            fg : [255,255,0],
            bg : [0,0,255]
        },
        button: {
            fg : [255,255,255],
            bg : [68,68,68]
        }
    };

    var clickable = ["button"];

    var editable = ["input", "textarea"];

    var selected = 0;

    if (typeof global.jQuery === "undefined") {
        throw "need jQuery";
    }

    /**
     * Constructor
     * @constructor
     */
    var Parser = function() {

        this._init();
    };

    /**
     * Return parsed data
     * @returns {Array}
     */
    Parser.prototype.getAll = function() {
        return this.elements;
    };

    /**
     * Check element on coords and make it selected
     * @param x
     * @param y
     * @returns {*}
     */
    Parser.prototype.clickOnElement = function(x, y) {

        // Getting all elements can be clicked
        if (this.clickable.length === 0) {
            this._getClickable();
        }

        // Getting all elements can be edit
        if (this.editable.length === 0) {
            this._getEditable();
        }

        // all elements
        for (var i = 0, length = this.clickable.length; i < length; i++) {
            var el = this.clickable[i];

            if (el.contains(x, y) && el.type === "button") {
                // todo fire button action
                return false;
            }
        }

        // all elements
        for (i = 0, length = this.editable.length; i < length; i++) {

            el = this.editable[i];

            if (el.contains(x, y)) {
                selected = i;
                return el.select(x, y).cursor();
            }
        }

        return false;

    };

    /**
     * Selecting current element
     * @returns {{x: number, y: number}}
     */
    Parser.prototype.selectCurrent = function() {
        if (this.editable.length === 0) {
            this._getEditable();
        }

        return this.editable[selected].select().cursor();
    };

    /**
     * Parser
     * @param container
     */
    Parser.prototype.parse = function(container) {
        var self = this;

        // Reset all data
        if (this.elements.length > 0) {
            this._init();
        }

        // Create container
        var $data = $("<div></div>");

        // Add data in container
        $data.append($($(container).text()));

        // parsing from parent to child
        $data.children().each(function() {

            // default parent
            var el = {
                text: "",
                x: 0,
                y: 0,
                fg: defaultColors.text.fg,
                bg: defaultColors.text.bg
            };

            // parsing childs
            self._parseElement(this, el);

        });

        console.log(this.elements);
    };

    /**
     * Add text to selected element
     * @param text
     * @returns {*}
     */
    Parser.prototype.addText = function(text) {
        if (this.editable.length === 0) {
            this._getEditable();
        }

        if (typeof this.editable[selected] === "undefined") {
            return false;
        }

        return this.editable[selected].addText(text).cursor();
    };

    /**
     * moving cursor inside element
     * @param side
     * @returns {*}
     */
    Parser.prototype.move = function(side) {
        if (this.editable.length === 0) {
            this._getEditable();
        }

        if (typeof this.editable[selected] === "undefined") {
            return false;
        }

        return this.editable[selected].move(side).cursor();
    };

    /**
     * Delete one symbol before cursor inside selected element
     * @returns {*}
     */
    Parser.prototype.backspace = function() {
        if (this.editable.length === 0) {
            this._getEditable();
        }

        if (typeof this.editable[selected] === "undefined") {
            return false;
        }

        return this.editable[selected].backspace().cursor();
    };


    /**
     * Init Parse
     * @private
     */
    Parser.prototype._init = function() {
        this.elements = [];
        this.editable = [];
        this.clickable = [];
    };

    /**
     * Get editable elements
     * @private
     */
    Parser.prototype._getEditable = function() {
        for (var i = 0, length = this.elements.length; i < length; i++) {
            if (editable.indexOf(this.elements[i].type) !== -1) {
                this.editable.push(this.elements[i]);
            }
        }
    };

    /**
     * Get clickable elements
     * @private
     */
    Parser.prototype._getClickable = function() {
        for (var i = 0, length = this.elements.length; i < length; i++) {
            if (clickable.indexOf(this.elements[i].type) !== -1) {
                this.clickable.push(this.elements[i]);
            }
        }
    };

    /**
     * Recursively parsing childrens
     * @param el
     * @param parent
     */
    Parser.prototype._parseElement = function(el, parent) {
        var self = this;

        // jquery object
        var $el = $(el);

        // tag name
        var type = $el.prop("tagName").toLowerCase();

        // extracting text
        if (type === "span") {
            type = "text";
            var text = $el
                .contents()
                .filter(function() {
                    return this.nodeType === 3;
                })
                .text()
                .trim();
        } else if (type === "input" || type === "textarea") {
            text = $el.val();
            if ($el.attr("type") === "button") {
                type = "button"
            }
        }

        // <form> doesn`t have text
        text = text || "";

        // creating element
        var element = {
            type: type,
            text: text,
            x: self._getCoord($el, "x", parent),
            y: self._getCoord($el, "y", parent),
            fg: self._getColor($el, "fg", parent),
            bg: self._getColor($el, "bg", parent)
        };

        if (type === "textarea") {
            element.width = $el.attr("cols");
            element.height = $el.attr("rows");
        }


        element = new Element(element);

        // prevent store data in closure (memory leaking)
        type = null;
        text = null;
        parent = null;

        // add parsed element
        this.elements.push(element);

        // parsing deeper
        $el.children().each(function() {
            self._parseElement(this, element);
        });

    };

    /**
     * Get color from element or from parent
     * @param $el
     * @param type
     * @param parent
     * @returns {*}
     * @private
     */
    Parser.prototype._getColor = function($el, type, parent) {

        var color = $el.data(type);

        // element has color
        if (typeof color !== "undefined") {
            return this._getRGBColor(color) || defaultColors.text[type];
        }

        // color from parent
        return parent[type];

    };

    /**
     * Getting coord from element, if element doesn`t - from parent (recursively)
     * if parent "body" - default 0
     * @param $el
     * @param axis
     * @returns {*}
     * @private
     * @param parent
     */
    Parser.prototype._getCoord = function($el, axis, parent) {

        // Check element
        var value = $el.data(axis);

        // Element has value
        if (typeof value !== "undefined") {
            return value;
        }

        // get parent position
        if (axis === "x") {
            return parent.x + parent.text.length; // Parent have text and his child need to move on position after text
        } else {
            return parent.y;
        }
    };

    /**
     * Recursivelly search bg color in parents
     */
    Parser.prototype._getBackgroundColor = function ($element) {

        if ($element === $("body")) {
            return $element.css("background-color")
        }

        if ($element.css("background-color") !== "rgba(0, 0, 0, 0)") {
            return $element.css("background-color")
        }

        return this._getBackgroundColor($element.parent());
    };

    /**
     * Parsing hex color into RGB array [255,255,255]
     * http://stackoverflow.com/questions/5623838
     */
    Parser.prototype._getRGBColor = function (hex) {

        if (!hex) {
            return false;
        }

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : false;
    };

    // Set constructor
    Parser.prototype.constructor = Parser;

    // Publish in global
    if (typeof exports !== 'undefined') {
        exports.tagParser = new Parser;
    }  else {
        global.tagParser = new Parser;
    }

    /**
     * Element
     * @param props
     * @constructor
     */
    var Element = function(props) {

        this.x = props.x || 0;
        this.y = props.y || 0;

        this.type = props.type || "text";

        if (props.type === "input" || props.type === "textarea") {
            this.fg = defaultColors.input.fg;
            this.bg = defaultColors.input.bg
        } else if (props.type === "button") {
            this.fg = props.fg || defaultColors.button.fg;
            this.bg = defaultColors.button.bg;
        } else {
            this.fg = props.fg || defaultColors[props.type].fg;
            this.bg = props.bg || defaultColors[props.type].bg;
        }

        this._cursorX = 0;
        this._cursorY = 0;

        if (props.type === "button") {
            var text = props.text || "Submit";
        } else {
            text = props.text || "";
        }

        if (props.type === "input") {
            this._width = INPUT_WIDTH;
            this._height = 1;
        } else if (props.type === "textarea") {
            this._width = props.width || 20;
            this._height = props.height || 10;
        } else {
            this._width = text.length;
            this._height = 1;
        }

        this.text = this._text = "";

        this.textStart = 0;
        this.textPos = 0;

        this.addText(text);

    };

    /**
     * Check if the element under x and y
     * @param x
     * @param y
     * @returns {boolean}
     */
    Element.prototype.contains = function(x, y) {

        if (y < this.y) {
            return false;
        }

        if (y >= this.y + this._height) {
            return false;
        }

        if (x < this.x)  {
            return false;
        }

        if (x >= this.x + this._width) {
            return false;
        }

        return true;
    };

    /**
     * Select element
     * @param {number} [x]
     * @param {number} [y]
     * @returns {Element}
     */
    Element.prototype.select = function(x, y) {

        // default at the end of input
        x = x || this.x + this._width - 1;
        y = y || this.y + this._height - 1;

        // amount of chars can be placed inside input
        var elDimension = this._width * this._height;

        // If text is bigger than input
        if (this._text.length >= elDimension) {
            this._cursorY = y;
            this._cursorX = x;
            this.textStart = this._text.length - elDimension;
            return this;
        }

        // y coord of last line of text
        var maxY = Math.ceil(this.text.length / this._width) + this.y - 1;

        // last position of char in last line
        var maxX = this.x + this._text.length % this._width;

        // all text is visible -> text starts from beginning
        this.textStart = 0;

        if (y > maxY) {
            this._cursorY = maxY;
            this._cursorX = maxX;
        } else if (y === maxY) {
            this._cursorY = y;
            if (x >= maxX) {
                this._cursorX = maxX;
            } else {
                this._cursorX = x;
            }
        } else {
            this._cursorY = y;
            this._cursorX = x;
        }

        return this;
    };

    /**
     * Return cursor position
     * @returns {{x: number, y: number}}
     */
    Element.prototype.cursor = function() {
        return {
            x: this._cursorX,
            y: this._cursorY
        }
    };

    /**
     * Add text to element
     * @param text
     * @returns {HTMLElement}
     */
    Element.prototype.addText = function(text) {

        // type text is not editable
        if (editable.indexOf(this.type) === -1) {
            this._text = this.text = text;
            this._render();
            return this;
        }

        // Position in text by cursor position
        var textPos = this.textStart + (this._cursorY - this.y) * this._width + (this._cursorX - this.x);

        // Inserting text on position
        this._text = [this._text.slice(0, textPos), text, this._text.slice(textPos)].join('');

        // amount of chars can be placed inside input
        var elDimension = this._width * this._height;

        // if the text is bigger than input
        var offset = textPos + text.length - elDimension;

        // text starts from offfset - all string move left
        if (offset >= 0) {
            this.textStart = offset + 1;
        }

        // visible text
        this.text = this._text.substr(this.textStart, elDimension);

        // position of cursor
        var x = this._cursorX + text.length;
        var y = this._cursorY;

        // if added text bigger than input
        if (x - this.x >= this._width) {
            var lines = Math.ceil((x + 1 - this.x) / this._width);
            console.log("text heoght",lines);
            if (lines > this._height) {
                x = this.x + this._width - 1;
                y = this.y + this._height - 1;
            } else {
                y = this.y + lines - 1;
                x = this.x + text.length % this._width - 1;
            }
        }

        // cursor position on screen
        this._cursorX = x;
        this._cursorY = y;

        this._render();

        return this;
    };

    /**
     * Moving cursor inside element
     * @param side
     * @returns {HTMLElement}
     */
    Element.prototype.move = function(side) {

        var x = this._cursorX;
        var y = this._cursorY;

        switch(side) {
            case "up":
                if (y === this.y) {
                    break;
                }
                y--;
                break;

            case "down":
                if (y === this.y + this._height - 1) {
                    break;
                }
                y++;
                break;

            case "right":
                if (x === this.x + this._width - 1) {
                    break;
                }
                x++;
                break;

            case "left":
                if (x === this.x) {
                    break;
                }
                x--;
                break;
        }

        // calculate position
        return this.select(x,y);

    };

    /**
     * Delete one symbol before cursor
     * @returns {HTMLElement}
     */
    Element.prototype.backspace = function() {

        // Position in text by cursor position
        var textPos = this.textStart + (this._cursorY - this.y) * this._width + (this._cursorX - this.x);

        // nothing to delete
        if (textPos === 0) {
            return this;
        }

        // remove one symbol
        this._text = [this._text.slice(0, textPos - 1), this._text.slice(textPos)].join('');

        // amount of chars can be placed inside input
        var elDimension = this._width * this._height;

        // if text was bigger than element
        if (this.textStart > 0 && this._text < elDimension) {
            this.textStart--;
        }

        // visible text
        this.text = this._text.substr(this.textStart, elDimension);

        // cursor position
        if (this._cursorX - 1 < this.x) {
            this._cursorX = this.x + this._width - 1;
            this._cursorY--;
        } else {
            this._cursorX--;
        }

        this._render();

        return this;
    };

    /**
     * Print element on screen
     * @private
     */
    Element.prototype._render = function() {

        // crop text to width * hight from start
        var x = 0,
            y = 0;
        for (var i = 0, length = this._width * this._height; i < length; i++) {
            var char = this.text[i] || " ";
            printthat(char, this.x + x, this.y + y, this.fg, this.bg);
            x++;
            if (x >= this._width) {
                x = 0;
                y++;
            }
        }
    };

})(this);