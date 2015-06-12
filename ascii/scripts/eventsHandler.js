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

    events.ctrlKey = false;

    events.init = function() {

        this.doubleClickStarted = false;

        $("#ansi").bind("mousedown", this.parsed_mousedown);

        this.setFocusOnInputField();

        $(document).unbind('keydown').bind('keydown', this.parsed_keydown);
        $(document).unbind('keypress').bind('keypress', this.parsed_keydown);
        //this._registerKeyEventListener();
    };

    events.setCursor = function(coords) {
        if (coords) {
            parsed_setCursorPosX(coords.x);
            parsed_setCursorPosY(coords.y);
        }
    };

    events.setFocusOnInputField = function() {
        events.setCursor(tagParser.selectCurrent());

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

    events.checkSelectionOnParsed = function (x, y) {
        events.setCursor(tagParser.clickOnElement(x, y));
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

    events.handleParsedKeyCode = function(keyCode, e) {

        switch (keyCode) {

            case 249 :
                events.executeParsedKey(151); // high two becomes ( for french keyboard
                return true;

            case 178:
                events.executeParsedKey(40); // high two becomes ( for french keyboard
                return true;

            case 224:
                events.executeParsedKey(133); // a accent
                return true;

            case 232:
                events.executeParsedKey(138); // e accent
                return true;

            case 231:
                events.executeParsedKey(135); // ca
                return true;

            case 233:
                events.executeParsedKey(130); // e accent
                return true;

            case 176 :
                events.executeParsedKey(167);
                return true;
                break;
            case 96 : // opening single quote - convert to standard single quote due to cursor right bug on single quote
                events.executeParsedKey(39);
                return true;

            case 219 : // bracket right
                events.executeParsedKey(93);
                return true;

            case 221: // bracket left
                events.executeParsedKey(91);
                return true;

            case 220 : // UE or backslash
                if (e.shiftKey) {
                    events.executeParsedKey(154);
                } else {
                    events.executeParsedKey(92);
                }
                return true;

            case 214 :
                events.executeParsedKey(153);
                return true;

            case 196 :
                events.executeParsedKey(142);
                return true;

            case 228 :
                events.executeParsedKey(132);
                return true;

            case 246 :
                events.executeParsedKey(148);
                return true;

            case 252 :
                events.executeParsedKey(129);
                return true;

            case 191:
                events.executeParsedKey(47);
                return true;

            case 222: // single/double quote
                if (!e.shiftKey) {
                    events.executeParsedKey(39);
                } else {
                    events.executeParsedKey(34); // double quote
                }
                return true;

            case 192 :
                events.executeParsedKey(39);
                return true;

            case 48 :
                if (!e.shiftKey) {
                    events.executeParsedKey(48);
                } else {
                    events.executeParsedKey(61);
                }
                return true;

            case 223: // sz
                events.executeParsedKey(225);
                break;

            case 13 :
                events.executeParsedKey(13);
                break;

            case 180 : // single quote above sz
                events.executeParsedKey(39);
                return true;

            case 39 : // right
                if (e.shiftKey) {
                    events.executeParsedKey(39);
                } else {
                    events.moveWithArrow("right");
                }
                return true;

            case 40 : // down
                if (e.shiftKey) {
                    events.executeParsedKey(40);
                }else {
                    events.moveWithArrow("down");
                }
                return true;

            case 37: // left, %
                if (e.shiftKey) {
                    events.executeParsedKey(37);
                }else {
                    events.moveWithArrow("left");
                }
                return true;

            case 38: // up
                if (e.shiftKey) {
                    events.executeParsedKey(38);
                }else {
                    events.moveWithArrow("up");
                }
                return true;

            case 8: // backspace
                events.backspace();
                return true;

            default :
                events.executeParsedKey(keyCode);
                return true;
        }
        return false;
    };

    events.executeParsedKey = function(keyCode) {
        var char = String.fromCharCode(keyCode);
        events.setCursor(tagParser.addText(char));
    };

    events.moveWithArrow = function(side) {
        events.setCursor(tagParser.move(side));
    };

    events.backspace = function() {
        events.setCursor(tagParser.backspace());
    };

    /**
     * This registers a key event listener, so entering something in the browser has functionality
     */
    events._registerKeyEventListener = function() {

        document.body.addEventListener('keypress', function (e) {

                var keyCode = e.which;

                if (keyCode != 0) {
                    e.preventDefault();
                    events.handleKeyCode(keyCode, e);
                }

        });

        document.body.addEventListener('keydown', function (e) {

                var keyCode = e.which;

                if (keyCode == 17) {
                    events.ctrlKey = true;
                } else if (keyCode == 27) {
                    if ($('#panel').css('display') == "block") {

                        hidePanel();
                    } else {
                        showPanel();
                    }
                } else if ((keyCode <= 40) && (keyCode >= 37)) {
                    e.preventDefault();
                    events.handleKeyCode2(keyCode, e);
                } else if (keyCode == 8) {
                    e.preventDefault();
                    events.handleKeyCode(keyCode, e);
                }
        });
    };

    /**
     * This converts to keycodes to real characters. Language dependency included. Calls executeKey to show the keys in effect
     */
    events.handleKeyCode = function(keyCode, e) {

        if ( (global.copyMode) && (!e.shiftKey) ) {
            if ( (keyCode!=99) && (keyCode!=116) && (keyCode!=120) ) {
                global.resetHighlighted();
                global.copyMode = false;
            }
        }

        if ( (keyCode>=48) && (keyCode<=57) ) {

            if (keyCode==48) keyCode=9; else
                keyCode=keyCode-49;

            executeKey(global.keys[(global.currentCharset-1)][keyCode]);

            return true;
        }



        clearTimeout(hideTimer);
        global.codepage.overlay = null;

        var asciiCode, fgColor, bgColor;

        switch(keyCode){

            case 120 :  // CTRL-X

                if (ctrlKey) { // this is not e.ctrlKey

                    if (copyMode)
                    {

                        for (var x = 0; x < copyWidth; x++) {
                            for (var y = 0; y < copyHeight; y++)
                            {
                                global.codepage.drawChar(globalContext, 32, 15, 0, cursorPosX+x, cursorPosY+y+firstLine, false, true);
                            }
                        }
                    }
                } else {

                    executeKey(120);

                }
                break;

            case 121 :
                if (ctrlKey) { // this is not e.ctrlKey
                    if (redo.length==0) return;
                    var myredo = redo.pop();

                    if (myredo.action=="insert") {

                        asciiCode = myredo.asciiArray[0];
                        fgColor = myredo.asciiArray[1];
                        bgColor = myredo.asciiArray[2];

                        showCharacter(false);
                        setCursorPosX(myredo.x+1);
                        setCursorPosY(myredo.y);

                        moveAndDrawCharacters(keyCode);
                        codepage.drawChar(ctx, asciiCode, fgColor, bgColor, myredo.x, myredo.y);

                    } else { // overwrite

                        asciiCode = myredo.asciiArray[0];
                        fgColor = myredo.asciiArray[1];
                        bgColor = myredo.asciiArray[2];
                        showCharacter(false);
                        codepage.drawChar(ctx, asciiCode, fgColor, bgColor, myredo.x, myredo.y);
                        setCursorPosX(myredo.x+1);
                        setCursorPosY(myredo.y);
                    }


                } else {
                    executeKey(121);
                }
                break;
            case 122 :
                // Z / CTRL-Z
                if (e.ctrlKey) {
                    if (undo.length==0) return;
                    var myundo = undo.pop();
                    var originalCharacter = screenCharacterArray[myundo.y][myundo.x];

                    if (myundo.action=="removeCharacter") {

                        // A character was previously inserted. We now need to remove that character.
                        var currentPosX = myundo.x;
                        var currentPosY = myundo.y;

                        while (currentPosX < getDisplayWidth()-1)
                        {
                            asciiCode = screenCharacterArray[currentPosY][currentPosX+1][0];
                            fgColor = screenCharacterArray[currentPosY][currentPosX+1][1];
                            bgColor = screenCharacterArray[currentPosY][currentPosX+1][2];

                            codepage.drawChar(ctx, asciiCode, fgColor, bgColor, currentPosX, currentPosY);
                            currentPosX++;
                        }

                        codepage.drawChar(ctx, myundo.rightsideAsciiCode, myundo.rightsideFGColor, myundo.rightsideBGColor, getDisplayWidth()-1, currentPosY);
                        showCharacter(false);
                        setCursorPosX(myundo.x);
                        setCursorPosY(myundo.y);

                        redo.push({ action : "insert", asciiArray : originalCharacter, x : myundo.x, y : myundo.y });

                    } else
                    if (myundo.action=="overwrite") {

                        codepage.drawChar(ctx, myundo.asciiCode, myundo.fgColor, myundo.bgColor, myundo.x, myundo.y);

                        showCharacter(false);
                        setCursorPosX(myundo.x);
                        setCursorPosY(myundo.y);
                        redo.push({ action : "overwrite", asciiArray : originalCharacter, x : myundo.x, y : myundo.y });
                    }
                    break;
                } else {
                    executeKey(122);
                }

                return true;
                break;

            case 249 :
                executeKey(151); // high two becomes ( for french keyboard
                return true;
                break;

            case 178: executeKey(40); // high two becomes ( for french keyboard
                return true;
                break;

            case 224: executeKey(133); // a accent


                return true;
            case 232: executeKey(138); // e accent


                return true;
                break;
            case 231: executeKey(135); // ca


                return true;
                break;
            case 233: executeKey(130); // e accent

                return true;
                break;
            case 176 :
                executeKey(167);
                return true;
                break;
            case 112 :
                if (e.ctrlKey) {
                    alert(cursorPosX+"/"+cursorPosY);
                    break;
                } else {
                    executeKey(112);
                }
                break;
            case 96 : // opening single quote - convert to standard single quote due to cursor right bug on single quote
                executeKey(39);
                return true;
                break;
            case 97 : // CTRL-A
                if (ctrlKey) {
                    var ascii = screenCharacterArray[cursorPosY+firstLine][cursorPosX];
                    alert("Color / Foreground color / Background color: "+ascii);
                } else {
                    executeKey(97);
                }
                return true;
                break;
            case 99 :
                //CTRL-C
                if (ctrlKey) {
                    copySelectedContent();
                } else {
                    executeKey(99);
                }
                break;
            case 118 :
                //CTRL-V
                if (ctrlKey) {
                    pasteSelectedContent();
                } else {
                    executeKey(118);
                }
                break;
            case 219 : // bracket right
                executeKey(93);
                return true;
                break;
            case 221: // bracket left
                executeKey(91);
                return true;
                break;
            case 220 : // UE or backslash
                if (e.shiftKey) {
                    executeKey(154);
                } else {
                    executeKey(92);
                }
                return true;
                break;
            case 214 :
                executeKey(153);
                return true;
                break;
            case 196 :
                executeKey(142);
                return true;
                break;
            case 228 :
                executeKey(132);
                return true;
                break;
            case 246 :
                executeKey(148);
                return true;
                break;
            case 252 :
                executeKey(129);
                return true;
                break;
            case 191:
                executeKey(47);
                return true;
                break;
            case 222: // single/double quote
                if (!e.shiftKey) {
                    executeKey(39);
                } else {
                    executeKey(34); // double quote
                }
                return true;
                break;
            case 192 :
                executeKey(39);
                return true;
                break;
            case 48 :
                if (!e.shiftKey) {
                    executeKey(48);
                } else {
                    executeKey(61);
                }
                return true;
                break;
            case 223: // sz
                executeKey(225);
                break;
            case 13 :
                showCharacter();
                setCursorPosX(0);
                console.log("getDisplayHeight:"+getDisplayHeight());
                if (cursorPosY+firstLine<getDisplayHeight()-1) {
                    console.log("Y:"+cursorPosY);
                    setCursorPosY(cursorPosY+1);
                }
                var maxHeight = getDisplayHeight()-1;
                if (cursorPosY<maxHeight) {
                    scrollDown++;
                }
                redrawCursor();
                break;
            case 180 : // single quote above sz
                executeKey(39);
                return true;
                break;
            case 39 : // right
                if (e.shiftKey) {

                    executeKey(39);
                }
                return true;
                break;
            case 40 : // down
                if (e.shiftKey) {

                    executeKey(40);
                }
                return true;
                break;
            case 37: // left, %
                if (e.shiftKey) {

                    executeKey(37);
                }
                return true;
                break;
            case 38: // up
                if (e.shiftKey) {

                    executeKey(38);
                }
                return true;
                break;
            case 8: // backspace

                if (cursorPosX>0) {
                    setCursorPosX(cursorPosX-1);
                    var currentPos = cursorPosX;

                    // Now to those characters which are outside of the visible screen
                    currentPos = cursorPosX+leftLine;
                    console.log("CPOS<TOTALVIS:"+currentPos+"<"+totalVisibleWidth);
                    showCharacter(false);
                    while (currentPos < totalVisibleWidth) {
                        screenCharacterArray[cursorPosY+firstLine][currentPos]=screenCharacterArray[cursorPosY+firstLine][currentPos+1];
                        // let's care about the visible characters on the screen

                        var ypos=cursorPosY+firstLine;
                        var maxxpos=getDisplayWidth()+leftLine-1;
                        var maxypos=getDisplayHeight()+firstLine;

                        if (currentPos<maxxpos) {
                            console.log("DRAWCHRA"+(currentPos+1)+" to "+(currentPos-leftLine)+" firstLine:"+firstLine);
                            asciiCode = screenCharacterArray[cursorPosY+firstLine][currentPos+1][0];
                            var fgcolor = screenCharacterArray[cursorPosY+firstLine][currentPos+1][1];
                            var bgcolor = screenCharacterArray[cursorPosY+firstLine][currentPos+1][2];

                            codepage.drawChar(ctx, asciiCode, fgcolor, bgcolor, currentPos-leftLine, cursorPosY, false, false);
                        }
                        screenCharacterArray[cursorPosY+firstLine][currentPos]=screenCharacterArray[cursorPosY+firstLine][currentPos+1];
                        currentPos++;
                    }

                    var ch = [];
                    ch.push(32);
                    ch.push(screenCharacterArray[cursorPosY+firstLine][currentPos][1]);
                    ch.push(screenCharacterArray[cursorPosY+firstLine][currentPos][2]);

                    screenCharacterArray[cursorPosY+firstLine][currentPos+1]=ch;


                    redrawCursor();
                }
                return true;

            default :



                executeKey(keyCode);

                return true;
                break;
        }
        return false;
    };

    /**
     * This gets called due when a different event gets called
     */
    events.handleKeyCode2 = function(keyCode, e) {

        clearTimeout(hideTimer);
        codepage.overlay=null;

        var doshowcharacter=true;

        // Check if we need to leave the selection mode. This happens when a key gets pressed without the shift button being pressed.
        if ( (copyMode) && (!e.shiftKey) ) {

            copyMode=false;
            clearTimeout(cursorInterval);
            resetHighlighted();
            doshowcharacter=false;
            cursorInterval = setTimeout(function() { toggleCursor(); }, 500);

        }

        switch(keyCode){

            case 39 : // cursor right
                showCharacter(false);
                var maxWidth = getDisplayWidth()-scrollBarXShown; // When the scroll is being shown, the size of the canvas is 1 character smaller

                if (!e.shiftKey) {
                    if (!e.ctrlKey) {


                        if (cursorPosX<maxWidth-scrollBarXShown) {

                            setCursorPosX(cursorPosX+1);
                            redrawCursor();
                        } else if (cursorPosX+leftLine<getTotalDisplayWidth()-2) {
                            scrollRight++;
                        }
                    } else {

                        if (currentBackground>0) currentBackground--; else currentBackground=255;
                        codepage.drawChar(ctx, 32, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay=new Array();
                        codepage.overlay[0]=32;
                        codepage.overlay[1]=currentForeground;
                        codepage.overlay[2]=currentBackground;
                        hideTimer = setTimeout(function() { codepage.overlay=null; }, 1000);
                    }
                } else {
                    // This gets called when the shift key is pressed and cursor right is pressed, so selection takes place
                    if (copyMode==false) {
                        copyMode=true;
                        copyStartX=cursorPosX;
                        copyStartY=cursorPosY;
                        copyEndX=cursorPosX;
                        copyEndY=cursorPosY;
                    }
                    if (cursorPosX<maxWidth) {
                        copyEndX++;

                        if (cursorPosX<copyStartX) { // The cursor is to the left of the copyStartX ([][][][][][]copyStartX)

                            // currentPosX < copyStartX - show the original characters


                            // currentPosX > copyStartX - move selection to the right (copyStartX[][][][][][][][[])
                            for (var y = copyEndY; y >= copyStartY; y--)
                            {
                                highlightCharacter(cursorPosX+1, y);
                            }

                            if (copyStartY < copyEndY) {

                                for (var y = copyEndY; y >= copyStartY; y--)
                                {
                                    showOriginalCharacter(cursorPosX, y);
                                }

                            } else {

                                for (var y = copyStartY+1; y >= copyEndY-1; y--)
                                {

                                    showOriginalCharacter(cursorPosX, y);
                                }

                            }

                        } else {


                            if (copyStartY < copyEndY) {

                                // currentPosX > copyStartX - move selection to the right (copyStartX[][][][][][][][[])
                                for (var y = copyStartY; y <= copyEndY; y++)
                                {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX+1, y);
                                }
                            } else {

                                for (var y = copyStartY; y >= copyEndY; y--)
                                {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX+1, y);
                                }
                            }
                        }

                        setCursorPosX(cursorPosX+1);
                        redrawCursor();

                    }


                }
                return true;
                break;
            case 40 : // cursor down
                showCharacter(false);
                if (!e.shiftKey) {
                    if (!e.ctrlKey) {

                        var maxHeight = getDisplayHeight()-1-scrollBarYShown;

                        if (cursorPosY<maxHeight) {
                            cursorPosY++;
                            redrawCursor();
                        }
                        else if (cursorPosY+firstLine<totalVisibleHeight) {
                            // Scroll
                            scrollDown++;

                        }
                    } else {
                        if (currentForeground>0) currentForeground--; else currentForeground=255;
                        codepage.drawChar(ctx, 219, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay=new Array();
                        codepage.overlay[0]=219;
                        codepage.overlay[1]=currentForeground;
                        codepage.overlay[2]=currentBackground;
                        hideTimer = setTimeout(function() { codepage.overlay=null; }, 1000);
                    }

                } else {
                    clearTimeout(cursorInterval);

                    if (copyMode==false) {
                        copyMode=true;
                        copyStartX=cursorPosX;
                        copyStartY=cursorPosY;
                        copyEndX=cursorPosX;
                        copyEndY=cursorPosY;
                    }
                    if (cursorPosY<getDisplayHeight()-1) {

                        copyEndY++;

                        if (cursorPosX == copyStartX) {

                            if (cursorPosY<copyStartY)
                            {

                                showOriginalCharacter(cursorPosX-1, cursorPosY);
                                showOriginalCharacter(cursorPosX, cursorPosY);
                            } else {
                                highlightCharacter(cursorPosX, cursorPosY);
                                highlightCharacter(cursorPosX, cursorPosY+1);
                            }


                        } else
                        if (cursorPosX <= copyStartX) { // (cursorPosX is to the left of copyEndX) [][][][][][][]copyEndX

                            if (cursorPosY<copyStartY)
                            {

                                for (var x = cursorPosX; x <= copyStartX; x++)
                                {
                                    showOriginalCharacter(x, cursorPosY);

                                }

                            } else {
                                for (var x = cursorPosX; x <= copyStartX; x++)
                                {
                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY+1);
                                }
                            }
                        } else { // cursorPosX > copyEndX (cursorPosX is to the right of copyEndX) copyEndX[][][][][][][][][][]
                            if (cursorPosY<copyStartY)
                            {
                                for (var x = copyStartX; x <= cursorPosX; x++)
                                {
                                    showOriginalCharacter(x, cursorPosY);
                                }
                            } else {
                                for (var x = copyStartX; x <= cursorPosX; x++)
                                {

                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY+1);
                                }
                            }
                        }
                        setCursorPosY(cursorPosY+1);
                        highlightCharacter(cursorPosX, cursorPosY);
                        redrawCursor();
                        cursorInterval = setTimeout(function() { toggleCursor(); }, 500);
                    }
                }
                return true;
                break;
            case 37: // cursor left, %
                showCharacter(false);
                if (!e.shiftKey) {
                    if (!e.ctrlKey) {

                        if (cursorPosX>0) {
                            setCursorPosX(cursorPosX-1);
                            redrawCursor();
                        } else if (cursorPosX+leftLine>0) {
                            scrollLeft++;
                        }
                    } else {
                        // Change color
                        if (currentBackground<255) currentBackground++; else currentBackground=0;
                        codepage.drawChar(ctx, 32, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay=new Array();
                        codepage.overlay[0]=32;
                        codepage.overlay[1]=currentForeground;
                        codepage.overlay[2]=currentBackground;
                        hideTimer = setTimeout(function() { codepage.overlay=null; }, 1000);
                    }
                } else {

                    clearTimeout(cursorInterval);
                    if (copyMode==false) {
                        copyMode=true;
                        copyStartX=cursorPosX;
                        copyStartY=cursorPosY;
                        copyEndX=cursorPosX;
                        copyEndY=cursorPosY;
                    }
                    if (cursorPosX>0) { // Only if we are not on the very left

                        copyEndX--;

                        if (cursorPosX > copyStartX) {

                            if (copyEndY > copyStartY) {

                                for (var y = copyEndY+1; y >= copyStartY-1; y--)
                                {
                                    showOriginalCharacter(cursorPosX, y);
                                }
                            } else {

                                for (var y = copyStartY+1; y >= copyEndY; y--)
                                {
                                    showOriginalCharacter(cursorPosX, y);
                                }
                            }

                        } else {
                            if (copyEndY > copyStartY) {

                                for (var y = copyStartY; y < copyEndY; y++)
                                {
                                    showOriginalCharacter(cursorPosX, y);
                                }

                                for (var y = copyStartY; y < copyEndY; y++)
                                {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX-1, y);
                                }

                            } else {
                                /* for (var y = copyStartY; y > copyEndY; y--)
                                 {

                                 showOriginalCharacter(cursorPosX, y);
                                 }*/

                                for (var y = copyStartY; y >= copyEndY; y--)
                                {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX-1, y);
                                }


                            }
                        }

                        setCursorPosX(cursorPosX-1);
                        highlightCharacter(cursorPosX, cursorPosY);
                        cursorInterval = setTimeout(function() { toggleCursor(); }, 500);

                    }
                }
                return true;
                break;
            case 38: // cursor up
                showCharacter(false);
                if (!e.shiftKey) {
                    if (!e.ctrlKey) {
                        if (cursorPosY>0) {
                            // If the cursor is not at the very top, moves the cursor one up
                            cursorPosY--;
                            redrawCursor();
                        } else if (firstLine>0) {
                            // Scrolls if the cursor is at the very top
                            scrollUp++;
                        }
                    } else {
                        // Changes the foreground color
                        if (currentForeground<255) currentForeground++; else currentForeground=0;
                        codepage.drawChar(ctx, 219, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay=new Array();
                        codepage.overlay[0]=219;
                        codepage.overlay[1]=currentForeground;
                        codepage.overlay[2]=currentBackground;
                        hideTimer = setTimeout(function() { codepage.overlay=null; }, 1000);
                    }
                } else {
                    if (copyMode==false) {
                        copyMode=true;
                        copyStartX=cursorPosX;
                        copyStartY=cursorPosY;
                        copyEndX=cursorPosX;
                        copyEndY=cursorPosY;
                    }
                    if (cursorPosY>0) {
                        if (cursorPosX == copyStartX) {

                            if (cursorPosY <= copyStartY) {
                                highlightCharacter(cursorPosX, cursorPosY);
                                highlightCharacter(cursorPosX, cursorPosY-1);
                            } else {
                                showOriginalCharacter(cursorPosX, cursorPosY);
                            }


                        } else
                        if (cursorPosX <= copyStartX) { // (cursorPosX is to the left of copyEndX) [][][][][][][]copyEndX

                            if (cursorPosY <= copyStartY) {

                                for (var x = cursorPosX; x <= copyStartX; x++)
                                {

                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY-1);
                                }
                            } else
                            {

                                for (var x = cursorPosX; x <= copyStartX; x++)
                                {
                                    showOriginalCharacter(x, cursorPosY);
                                }
                            }
                        } else { // cursorPosX > copyEndX (cursorPosX is to the right of copyEndX) copyEndX[][][][][][][][][][]

                            if (cursorPosY <= copyStartY)
                            {

                                for (var x = copyStartX; x < cursorPosX; x++)
                                {

                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY-1);
                                }
                            } else {

                                for (var x = copyStartX; x <= cursorPosX; x++)
                                {
                                    showOriginalCharacter(x, cursorPosY);
                                }
                            }
                        }
                        copyEndY--;
                        setCursorPosY(cursorPosY-1);
                        highlightCharacter(cursorPosX, cursorPosY);
                        redrawCursor();
                    }
                }

                break;
            default:

                return true;
                break;
        }
        return false;
    }


    // Publish in global
    if (typeof exports !== 'undefined') {
        exports.eventsHandler = events;
    }  else {
        global.eventsHandler = events;
    }

}).call(this);