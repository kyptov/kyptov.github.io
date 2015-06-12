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

            // if element under x,y
            if (el.contains(x, y) && el.type === "button") {

                // fire onclick or empty string
                eval(el.onclick);

                // If button inside form and onclick without preventDefault - trigger form
                if (el.form && el.onclick.indexOf("preventDefault") === -1) {
                    this._submitForm(el.form);
                }
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
                bg: defaultColors.text.bg,
                form: false
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
        this.formId = 0;
        this.forms = {};
    };

    /**
     * Submiting the form by formId
     * @param formId
     * @private
     */
    Parser.prototype._submitForm = function(formId) {

        if (typeof this.forms[formId] === "undefined") {
            console.log("unknown form id:" + formId);
            return;
        }

        var formData = {};

        for (var i = 0, length = this.elements.length; i < length; i++) {

            var el = this.elements[i];

            if (el.form && el.form === formId && el.name) {
                formData[el.name] = el._text;
            }
        }

        console.log("data from inputs", formData);

        if (this.forms[formId].onsubmit) {
            console.log("form has attr 'onsubmit' with function " + this.forms[formId].onsubmit);
            eval(this.forms[formId].onsubmit);
            return;
        }

        if (this.forms[formId].action) {
            console.log("send ajax to" + this.forms[formId].action + "with data", formData);

            // AJAX request
            $.ajax({
                url: this.forms[formId].action,
                method: 'post',
                dataType: 'json',
                data: formData,
                success: function (response) {
                    if (typeof(response.js)!="undefined") eval(response.js);
                },
                fail : function(response) {
                    alert("An error occured");
                    if (typeof(response.msg)!="undefined") alert(response.msg);
                }
            });
        } else {
            console.log("form doesnt have onsubmit or action attr");
        }
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
                type = "button";
            }
        }

        // <form> doesn`t have text
        text = text || "";

        if (type === "form") {
            var form = "form_" + this.formId++;
            this.forms[form] = {
                onsubmit: $el.attr("onsubmit"),
                action: $el.attr("action")
            }
        } else {
            form = parent.form;
        }

        // creating element
        var element = {
            type: type,
            text: text,
            x: self._getCoord($el, "x", parent),
            y: self._getCoord($el, "y", parent),
            fg: self._getColor($el, "fg", parent),
            bg: self._getColor($el, "bg", parent),
            form: form,
            onclick: $el.attr("onclick") || "",
            name: $el.attr("name") || false
        };

        if (type === "textarea") {
            element.width = $el.attr("cols");
            element.height = $el.attr("rows");
        }

        // prevent store data in closure (memory leaking)
        type = null;
        text = null;
        parent = null;

        // add parsed element
        this.elements.push(new Element(element));

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
    if (typeof global.exports !== 'undefined') {
        global.exports.tagParser = new Parser;
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

        // Colors
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

        // Text
        if (props.type === "button") {
            var text = props.text || "Submit";
        } else {
            text = props.text || "";
        }

        // Dimension
        if (props.type === "input") {
            this._width = INPUT_WIDTH;
            this._height = 1;
        } else if (props.type === "textarea") {
            this._width = parseInt(props.width) || 20;
            this._height = parseInt(props.height) || 10;
        } else {
            this._width = text.length;
            this._height = 1;
        }

        // amount of chars can be placed inside input
        this.length = this._width * this._height;

        // name attribute
        if (props.type === "input" || props.type === "textarea") {
            this.name = props.name;
        }

        this.text = this._text = "";

        this.textStart = 0;

        if (this.type !== "text") {
            this.form = props.form;
        }

        if (this.type === "button") {
            this.onclick = props.onclick;
        }

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

        return x < this.x + this._width;


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

        // If text is bigger than input
        if (this._text.length >= this.length) {
            this._cursorY = y;
            this._cursorX = x;
            //this.textStart = this._text.length - this.length;
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

        // if the text is bigger than input
        var offset = textPos + text.length - this.length;

        // text starts from offfset - all string move left
        if (offset >= 0) {
            this.textStart = offset + 1;
        }

        // position of cursor
        var x = this._cursorX + text.length;
        var y = this._cursorY;

        // if added text bigger than input
        if (x - this.x >= this._width) {
            var lines = Math.ceil((x + 1 - this.x) / this._width);
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

        var textStart = this.textStart;

        switch(side) {
            case "up":
                if (y === this.y) {
                    if (textStart === 0) {
                        break;
                    }

                    textStart--;
                    break;
                }
                y--;
                break;

            case "down":
                if (y === this.y + this._height - 1) {
                    if (this._text.length - textStart <= this._width * this._height) {
                        break;
                    }

                    textStart++;
                    break;
                }
                y++;
                break;

            case "right":

                // simple moving right
                if (x < this.x + this._width - 1) {
                    x++;
                    break;
                }

                // end of line
                var EOL = (x === this.x + this._width - 1);

                // last line
                var lastLine = (y === this.y + this._height - 1);

                // moving to the begining of next line
                if (EOL && !lastLine) {
                    x = this.x;
                    y++;
                    break;
                }

                // moving text
                if (EOL && lastLine && this._text.length - textStart > this.length) {
                    textStart++;
                    break;
                }

                break;

            case "left":

                // simple moving left
                if (x > this.x) {
                    x--;
                    break;
                }

                // up one line
                if (x === this.x && y > this.y) {
                    x = this.x + this._width - 1;
                    y--;
                    break;
                }

                // moving text
                if (x === this.x && textStart > 0) {
                    textStart--;
                    break;
                }

                break;
        }

        if (textStart !== this.textStart) {
            this.textStart = textStart;
            this._render();
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

        // if text was bigger than element
        if (this.textStart > 0 && this._text < this.length) {
            this.textStart--;
        }

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

        // visible text
        this.text = this._text.substr(this.textStart, this.length);

        // print text to width * hight from start
        var x = 0,
            y = 0;
        for (var i = 0; i < this.length; i++) {
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