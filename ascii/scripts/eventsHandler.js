/**
 * Created by Alexandr on 04.06.2015.
 * @namespace parsed_setCursorPosX
 * @namespace parsed_setCursorPosY
 */
"use strict";
(function() {

    var global = this;

    var events = {};

    events.currentInput = 0;

    events.init = function() {

        this.doubleClickStarted = false;

        $("#ansi").bind("mousedown", this.parsed_mousedown);

        this.setFocusOnInputField();

        $(document).unbind('keydown').bind('keydown', this.parsed_keydown);
        $(document).unbind('keypress').bind('keypress', this.parsed_keydown);
    };

    events.setCursor = function(coords,possible_socket) {
        if (coords) {
            parsed_setCursorPosX(coords.x, possible_socket);
            parsed_setCursorPosY(coords.y, possible_socket);
        }
    };

    events.setFocusOnInputField = function(possible_socket) {
        events.setCursor(tagParser.selectCurrent(), possible_socket);

    };

    events.parsed_mousedown = function(e) {

        // Doubleclick handler
        if (events.doubleClickStarted) {
            events.doubleClickStarted = false;
            console.log("double click");
            // do something

        } else {
            events.doubleClickStarted = true;
            setTimeout(function() { events.doubleClickStarted = false; }, 300);
        }

        var ansicanvas = document.getElementById('ansi');
        var mouse = getMousePos(ansicanvas, e);
        var mx = mouse.x;
        var my = mouse.y;

        showCharacter();

        var myCursorPosX = Math.floor(mx / canvasCharacterWidth);
        var myCursorPosY = Math.floor(my / canvasCharacterHeight);

        if (myCursorPosX>=getDisplayWidth()-1) { console.log(myCursorPosX+" too far"); setCursorPosX(getDisplayWidth()-1); redrawCursor(); return; }
        if (myCursorPosY>=getDisplayHeight()-1) { console.log(myCursorPosY+" too high"); setCursorPosY(getDisplayHeight()-1); redrawCursor(); return; }

        events.checkSelectionOnParsed(myCursorPosX, myCursorPosY);

    };

    events.checkSelectionOnParsed = function (x, y, possible_socket) {
        events.setCursor(tagParser.clickOnElement(x, y), possible_socket);
    };

    events.parsed_keydown = function(e) {

        if (e.which != 0) {

            e.preventDefault();

            events.handleParsedKeyCode(e.which, e);
        }

    };

    events.parsed_keypress = function(e) {

        var keyCode = e.which;

        if (keyCode == 17) {
            ctrlKey=true;
        } else
        if (keyCode==27) {
            if ($('#panel').css('display')=="block") {
                hidePanel(); } else {
                showPanel();
            }
        } else
        if ( (keyCode<=40) && (keyCode>=37) ) {
            e.preventDefault();
            handleParsedKeyCode2(keyCode,e);
        }


    };

    events.handleParsedKeyCode = function(keyCode, e, possible_socket) {

        var mychar = String.fromCharCode(e.which);

        switch (keyCode) {

            case 249 :
                events.executeParsedKey(151, possible_socket); // high two becomes ( for french keyboard
                return true;

            case 178:
                events.executeParsedKey(40, possible_socket); // high two becomes ( for french keyboard
                return true;

            case 224:
                events.executeParsedKey(133, possible_socket); // a accent
                return true;

            case 232:
                events.executeParsedKey(138, possible_socket); // e accent
                return true;

            case 231:
                events.executeParsedKey(135, possible_socket); // ca
                return true;

            case 233:
                events.executeParsedKey(130, possible_socket); // e accent
                return true;

            case 176 :
                events.executeParsedKey(167, possible_socket);
                return true;
                break;
            case 96 : // opening single quote - convert to standard single quote due to cursor right bug on single quote
                events.executeParsedKey(39, possible_socket);
                return true;

            case 219 : // bracket right
                events.executeParsedKey(93, possible_socket);
                return true;

            case 221: // bracket left
                events.executeParsedKey(91, possible_socket);
                return true;

            case 220 : // UE or backslash
                if (e.shiftKey) {
                    events.executeParsedKey(154, possible_socket);
                } else {
                    events.executeParsedKey(92, possible_socket);
                }
                return true;

            case 214 :
                events.executeParsedKey(153, possible_socket);
                return true;

            case 196 :
                events.executeParsedKey(142, possible_socket);
                return true;

            case 228 :
                events.executeParsedKey(132, possible_socket);
                return true;

            case 246 :
                events.executeParsedKey(148, possible_socket);
                return true;

            case 252 :
                events.executeParsedKey(129, possible_socket);
                return true;

            case 191:
                events.executeParsedKey(47, possible_socket);
                return true;

            case 222: // single/double quote
                if (!e.shiftKey) {
                    events.executeParsedKey(39, possible_socket);
                } else {
                    events.executeParsedKey(34, possible_socket); // double quote
                }
                return true;

            case 192 :
                events.executeParsedKey(39, possible_socket);
                return true;

            case 48 :
                if (!e.shiftKey) {
                    events.executeParsedKey(48, possible_socket);
                } else {
                    events.executeParsedKey(61, possible_socket);
                }
                return true;

            case 223: // sz
                events.executeParsedKey(225, possible_socket);
                break;

            case 13 :
                events.executeParsedKey(13, possible_socket);
                break;

            case 180 : // single quote above sz
                events.executeParsedKey(39, possible_socket);
                return true;

            case 39 : // right
                if (e.shiftKey) {
                    events.executeParsedKey(39, possible_socket);
                } else {
                    events.moveWithArrow("right", possible_socket);
                }
                return true;

            case 40 : // down
                if (e.shiftKey) {
                    events.executeParsedKey(40, possible_socket);
                }else {
                    events.moveWithArrow("down", possible_socket);
                }
                return true;

            case 37: // left, %
                if (e.shiftKey) {
                    events.executeParsedKey(37, possible_socket);
                }else {
                    events.moveWithArrow("left", possible_socket);
                }
                return true;

            case 38: // up
                if (e.shiftKey) {
                    events.executeParsedKey(38, possible_socket);
                }else {
                    events.moveWithArrow("up", possible_socket);
                }
                return true;

            case 8: // backspace
                events.backspace(possible_socket);
                return true;

            default :
                events.executeParsedKey(keyCode, possible_socket);
                return true;
        }
        return false;
    };

    events.executeParsedKey = function(keyCode, possible_socket) {
        var char = String.fromCharCode(keyCode);
        events.setCursor(tagParser.addText(char), possible_socket);
    };

    events.moveWithArrow = function(side, possible_socket) {
        events.setCursor(tagParser.move(side), possible_socket);
    };

    events.backspace = function(possible_socket) {
        events.setCursor(tagParser.backspace(), possible_socket);
    };


    // Publish in global
    if (typeof exports !== 'undefined') {
        exports.eventsHandler = events;
    }  else {
        global.eventsHandler = events;
    }

}).call(this);