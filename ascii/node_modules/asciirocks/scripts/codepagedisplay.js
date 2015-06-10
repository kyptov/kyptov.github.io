/* The MIT License (MIT)
 *
 * Copyright (c) 2015 Oliver Bachmann, Karlsruhe, Germany
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*jslint browser: true, devel: true, plusplus: true */
 var xStart = 0;
 var yStart = 0;
 

function Codepage(codepageUrl, callback) {
        var COLORS, img, codepageImg;
        var overlay=null;

        function createCanvas(width, height) {
            
            var newCanvas = document.createElement("canvas");
            newCanvas.setAttribute("width", width);
            newCanvas.setAttribute("height", height);
            //canvasCharacterWidth=Math.floor(width/getDisplayWidth());
            //canvasCharacterHeight=Math.floor(height/getDisplayHeight());
            return newCanvas;
        }

        /*function copyCanvas(source, color, preserveAlpha) {
            var canvas, ctx, imageData, i;
            canvas = createCanvas(source.width, source.height);
            ctx = canvas.getContext("2d");
            ctx.drawImage(source, 0, 0);
            
            imageData = ctx.getImageData(0, 0, source.width, source.height);
            for (i = 0; i < imageData.data.length; ++i) {
                imageData.data[i++] = COLORS[color][0];
                imageData.data[i++] = COLORS[color][1];
                imageData.data[i++] = COLORS[color][2];
                if (!preserveAlpha) { imageData.data[i] = 255; }
            }
            ctx.putImageData(imageData, 0, 0);
            return canvas;
        }*/
        
        

        img = new Image();
        img.onload = function () {
            //var i, background;
            characterWidth = 256/32; //img.width / 32;
            characterHeight = 128/8; // img.height / 8;
            
            /*codepageImgs = [];
            backgroundImgs = [];
            background = createCanvas(characterWidth, characterHeight);
            for (i = 0; i < COLORS.length; i++) {
                codepageImg = copyCanvas(img, i, true);
                backgroundImg = colorCanvas(background, i, false);
            }*/
            codepageImg=img;
            
            callback();
        };
        img.src = codepageUrl;
       

        function drawChar(ctx, asciiCode, foreground, background, x, y, transparent, storeCharacter, storeCharacterX) {
            
           var realY = y;
           if (typeof(storeCharacter)=="number") {
               realY = storeCharacter;
               storeCharacter=true;
           }
           var realX = x;
           if (typeof(storeCharacterX)=="number") {
               realX = storeCharacterX;
               storeCharacter=true;
           }
           
           // This is just some information used when scrolling is implemented
            if (x>=xStart-1) {
                if (y>=yStart-1) {
                 
                 
                        if ( (typeof(transparent)=="undefined") || (transparent==false) ) {
                         var charArray = Array();
                         
                         charArray[0]=asciiCode;
                         charArray[1]=foreground;
                         charArray[2]=background;
                        
                            if (typeof(screenCharacterArray[realY])=="undefined") {
                                console.log("Error: Line "+y+" is undefined (out of range error)");
                            } else
                            if (typeof(screenCharacterArray[realY][x])=="undefined") {
                                console.log("Error: x value of ["+y+"]["+x+"] is undefined (out of range error)");
                            } else if ( (typeof(storeCharacter)=="undefined") || (storeCharacter==true) ) {
                                screenCharacterArray[realY][realX]=charArray;
                            } 
                        }
                         if (this.overlay!=null) {
                                    asciiCode=this.overlay[0];
                                    foreground=this.overlay[1];
                                    background=this.overlay[2];
                                }
                     
                        x = (x  ) * parseInt(canvasCharacterWidth);
                        y = (y ) * parseInt( canvasCharacterHeight );
                        if ( (typeof(transparent)=="undefined") || (transparent==false) ) {
                            var xpos=background;
                           
                            while (xpos >= 16) xpos=xpos-16;
                            // This calculates the position of the block of the image, which has the same characters over and over again with different backgrounds, regarding the y position
                            //console.log(Math.random()+"background:"+background);
                            var ypos = Math.floor(background/16);
                            ///console.log(Math.random()+"ypos:"+ypos);
                          
                            var myasciiCode=219;
                            
                            var myx = (myasciiCode % 32) * characterWidth+(xpos*256);
                            var myy = Math.floor(myasciiCode / 32) * characterHeight + (ypos*128);
                           
                            //alert("1:myx="+myx+" myy="+myy+" x="+x+" y="+y+"CW1:"+characterHeight+" canvasCharacterHeight:"+canvasCharacterHeight);
                            ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
                        }
                        
                        var xpos=foreground;
                        while (xpos >= 16) xpos=xpos-16;
                        var ypos = Math.floor(foreground/16);
                        
                        
                        var myx = (asciiCode % 32) * characterWidth+(xpos*256);
                        var myy = Math.floor(asciiCode / 32) * characterHeight + (ypos*128);
                        //alert(myx+"/"+x);
                        ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
            }
            }
        }
        
        
         function copyChar(ctx, originX, originY, x, y) {
            
       
           // This is just some information used when scrolling is implemented
            if (x>=xStart-1) {
                if (y>=yStart-1) {
                 
                        var charArray = screenCharacterArray[originY][originX];
                        asciiCode=charArray[0];
                        foreground=charArray[1];
                        background=charArray[2];
                        
                        x = (x  ) * parseInt(canvasCharacterWidth);
                        y = (y ) * parseInt( canvasCharacterHeight );
                        
                            var xpos=background;
                           
                            while (xpos >= 16) xpos=xpos-16;
                            // This calculates the position of the block of the image, which has the same characters over and over again with different backgrounds, regarding the y position
                            //console.log(Math.random()+"background:"+background);
                            var ypos = Math.floor(background/16);
                            ///console.log(Math.random()+"ypos:"+ypos);
                          
                            var myasciiCode=219;
                            
                            var myx = (myasciiCode % 32) * characterWidth+(xpos*256);
                            var myy = Math.floor(myasciiCode / 32) * characterHeight + (ypos*128);
                           
                            //alert("1:myx="+myx+" myy="+myy+" x="+x+" y="+y+"CW1:"+characterHeight+" canvasCharacterHeight:"+canvasCharacterHeight);
                            ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
                        
                        
                        var xpos=foreground;
                        while (xpos >= 16) xpos=xpos-16;
                        var ypos = Math.floor(foreground/16);
                        
                        
                        var myx = (asciiCode % 32) * characterWidth+(xpos*256);
                        var myy = Math.floor(asciiCode / 32) * characterHeight + (ypos*128);
                        //alert(myx+"/"+x);
                        ctx.drawImage(codepageImg, myx, myy, characterWidth, characterHeight, x, y, canvasCharacterWidth, canvasCharacterHeight);
            }
            }
        };
        
        

        /** Creates an own instance of a canvas object with its own context **/
        function generateDisplay(width, height) {
            return createCanvas(fullCanvasWidth, fullCanvasHeight);
        }

        function scrollDisplay(ctx, canvas) {
            ctx.drawImage(canvas, 0, characterHeight, canvas.width, canvas.height - characterHeight * 2, 0, 0, canvas.width, canvas.height - characterHeight * 2);
            ctx.fillStyle = "black";
            ctx.fillRect(0, canvas.height - characterHeight * 2, canvas.width, characterHeight);
        }

        return { "drawChar": drawChar, "generateDisplay": generateDisplay, "scrollDisplay": scrollDisplay, "copyChar" : copyChar };
    };
    
    
    function Display() {
        var canvas, ctx, x, y, savedX, savedY, foreground, background, bold, inverse;
        
        canvas = codepage.generateDisplay(width, height);
        ctx = canvas.getContext("2d");

        function homeCursor() {
            x = 0;
            y = 0;
        }

		function getPosX() {
			return x; 
		}

		function getPosY() {
				return y;
		}

        function resetAttributes() {
            foreground = 7;
            background = 0;
            bold = false;
            inverse = false;
        }

        function setBold(value) {
            bold = value;
        }

        function setInverse(value) {
            inverse = value;
        }

        function setPos(newX, newY) {
            x = Math.min(width, Math.max(0, newX));
            y = Math.min(height, Math.max(0, newY));
        }

        function setForeground(value) {
            foreground = value;
        }

        function setBackground(value) {
            background = value;
        }

        function clearToEndOfLine() {
            var i;
            for (i = x; i < width; ++i) {
                codepage.drawChar(ctx, 0, 0, 0, i, y);
            }
        }

       function clearScreen(fillStyle) {
            if (typeof(fillStyle)=="undefined") fillStyle="black";
            homeCursor();
            ctx.fillStyle = fillStyle;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function up(num) {
            y = Math.max(1, y - num);
        }

        function down(num) {
            y = Math.min(height - 1, y + num);
        }

        function newLine() {
            x = 0;
            if (y === height - 1) {
                //codepage.scrollDisplay(ctx, canvas);
                return true;
            }
            ++y;
            return false;
        }

        function back(num) {
            x = Math.max(1, x - num);
        }

        function forward(num) {
            if (x === width) { newLine(); }
            x = Math.min(width, x + num);
        }

        function drawChar(asciiCode) {
          
           // alert("DC");
            switch (asciiCode) {
            case 26:
                break;
            default:
                if (!inverse) {
                    //alert("calling drawChar with ascii:"+asciiCode+"fg:"+foreground+" background:"+background+"x:"+x+"y:"+y);;
                    codepage.drawChar(ctx, asciiCode, bold ? foreground  : foreground, background, x++, y);
                    
                } else {
                    //alert("inv ascii:"+asciiCode+"fg:"+foreground+" background:"+background);
                    //alert("calling drawChar with ascii:"+asciiCode+"fg:"+foreground+" background:"+background+"x:"+x+"y:"+y);;
                  
                  
                    codepage.drawChar(ctx, asciiCode, bold ? background + 8 : background, foreground, x++, y);
                }
                if (x === width + 1) { return newLine(); }
            }
            return false;
        }

        function savePosition() {
            savedX = x;
            savedY = y;
        }

        function restorePosition() {
            x = savedX;
            y = savedY;
        }

        homeCursor();
        resetAttributes();
       
        return {
            "resetAttributes": resetAttributes,
            "setBold": setBold,
            "setInverse": setInverse,
            "setPos": setPos,
            "up": up,
            "down": down,
            "newLine": newLine,
            "back": back,
            "forward": forward,
            "setForeground": setForeground,
            "setBackground": setBackground,
            "clearToEndOfLine": clearToEndOfLine,
            "clearScreen": clearScreen,
            "canvas": canvas,
            "drawChar": drawChar,
            "savePosition": savePosition,
            "restorePosition": restorePosition,
            "getPosX": getPosX,
            "getPosY": getPosY
        };
    }
