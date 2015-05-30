/**
 * Created by Alexandr on 30.05.2015.
 */
"use strict";
(function() {

    var global = this;

    if (typeof global.jQuery === "undefined") {
        throw "need jQuery";
    }

    /**
     * Constructor
     * @constructor
     */
    var ParseHTML = function() {
        this.elements = [];
    };

    /**
     * Return parsed data
     * @returns {Array}
     */
    ParseHTML.prototype.getAll = function() {
        return this.elements;
    };

    /**
     * Parser
     * @param container
     */
    ParseHTML.prototype.parse = function(container) {
        this.elements = [];

        var self = this;

        $(container)
            .find("*")
            .each(function () {

                // Cache element
                var $this = $(this);

                self.elements.push({
                    tag: $this.prop("tagName").toLowerCase(),
                    x: $this.offset().left,
                    y: $this.offset().top,
                    width: $this.width(),
                    height: $this.height(),
                    text: $this.text()
                });
            });
    };

    // Set constructor
    ParseHTML.prototype.constructor = ParseHTML;

    // Publish in global
    if (typeof exports !== 'undefined') {
        exports.ParseHTML = ParseHTML;
    }  else {
        global.ParseHTML = ParseHTML;
    }

}).call(this);