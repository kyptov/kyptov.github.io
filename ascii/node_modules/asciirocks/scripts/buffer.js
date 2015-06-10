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
/** This gets called when pressing CTRL-C **/
    function copySelectedContent() {
        
        copyArray=Array();
        if (copyMode) {
            
            if (copyEndY<copyStartY) {
                var buffer = copyStartY;
                copyStartY=copyEndY;
                copyEndY=buffer;
            } 
            if (copyEndX < copyStartX) {
                var buffer = copyStartX;
                copyStartX = copyEndX;
                copyEndX = buffer;
            }
            
            copyWidth=copyEndX-copyStartX+1;
            copyHeight=copyEndY-copyStartY+1;
            copyStartXBuffer=copyStartX;
            copyStartYBuffer=copyStartY;
            for (var y = 0; y < copyEndY-copyStartY+1; y++) 
            {
                    
                    copyArray[y]=Array();
                    for (var x = 0; x < copyEndX-copyStartX+1; x++) {
                        
                        copyArray[y][x]=screenCharacterArray[y+copyStartY+firstLine][x+copyStartX];
                    }
            }
        } else {
            copyArray[0]=Array();
            copyWidth=1;
            copyHeight=1;
            copyArray[0][0]=screenCharacterArray[cursorPosY+firstLine][cursorPosX];
        }
        
    }
    
	/** This gets called when pressing CTRL-V **/
    function pasteSelectedContent() {
        
      
        for (var y = 0; y < copyHeight; y++) 
            {
                    for (var x = 0; x < copyWidth; x++) {
                       
                        var asciiCode = copyArray[y][x][0];
                        
                        var foreground = copyArray[y][x][1];
                        var background = copyArray[y][x][2];
                        codepage.drawChar(globalContext, asciiCode, foreground, background, cursorPosX+x, cursorPosY+y+firstLine, false, true);
                    }
            }
            
    }