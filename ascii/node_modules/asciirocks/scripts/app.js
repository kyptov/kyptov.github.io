
       doRedraw=false;
        var currentDraw=0;
        /** used in connection with mouse click **/
        var waitingforDoubleclick = false;
        /** timer used for mouseclick **/
        var doubleclickInterval;
        /** Canvas context obect **/
        var globalContext;
        /** When we are drawing by using mouse clicks, this is set to true **/
        var drawingMode = false;
        /** Set on mouse click, and evaluated in mousemove **/
        var mouseDown =false;
        /** This is the general width and height, used globally to show the right coordinate system inside the canvas **/
        var width=320;
        var height=90;
        
        var movingX = false;
        var movingY = false;
        var movingXStartPos = 0;
        var movingYStartPos = 0;
        
        // Check/uncheck if the scrollbar is being shown
        var scrollBarXShown = 1;
        var scrollBarYShown = 1;
        
        var visibleWidth = 160;
        var visibleHeight = 45;
        var totalVisibleWidth = 320;
        var totalVisibleHeight=90;
        var firstLine=0;
        var leftLine=0;
        
        var resizeToScreen=false;
        /** This contains all characters. This is an array with three int values **/
        /*
        asciiCode = screenCharacterArray[cursorPosY][currentPos-1][0];
        fgcolor = screenCharacterArray[cursorPosY][currentPos-1][1];
        bgcolor = screenCharacterArray[cursorPosY][currentPos-1][2];
        */
       var hideTimer; // Gets used when toggling the color using CTRL-Cursor for clearing the currently shown color
 
        var screenCharacterArray = new Array();
                
        /** When changing the charset. Number one indicates characters from 1-9, other characters are ascii codes **/
        var currentCharset=7;
        /** This is the character used when drawing **/
        var currentChar=216;
        
        /** This is an image object, containing the image used when initializing the Codepage object, which has the parameter "images/CO_437_8x16.png" for setting this image **/
        var codepageImg;
        /** Actual color. Can get changed by changing the foreground inside the panel with the colors **/
        var currentColor=15;
        /** This is ctx = document.getElementById("ansi").getContext("2d"); and gets set at different positions. Should be all at one position **/
        var ctx;
        
        /** This is not used at the moment (shape.js) and should be used for dragging a small overview image (rectangular box) showing the complete ANSI image when it's too large **/
        var ansimation;
        /** Cursor X and Y positions start at 0, when the cursor is at 1,1 **/
        var cursorPosX=0;
        var cursorPosY=0;
        /** Used for toggling the cursor **/
        var cursorShown=true;
        /** Timer used or displaying displaying the cursor in a certain time span, toggling from shown to not shown */
        var cursorInterval;
        /** Depending on the screen size, this has a certain value of pixels **/
        var characterWidth, characterHeight;
        /** Depending on what cursor mode is on: Insert or overwrite, whereby in this case different ascii charsets get used **/
        var insert=true;
        /** Stores the current fore and background color **/
        var currentBackground=0;
        var currentForeground=15;
        
        var copyMode=false;
        var copyStartX=0;
        var copyStartY=0;
        var copyEndX=0;
        var copyEndY=0;
        
        
        var copyArray=new Array();
        var copyWidth=0;
        var copyHeight=0;
        
        var undo = new Array();
        var redo = new Array();
        
        
        var ctrlKey=false;
        
        /** This gets called when pressing on the blue window, and sets the character set as well as the ascii code for drawing **/
        function setD(asciiCode, drawingBox) {
        
            currentCharset=drawingBox;
            currentChar=asciiCode;
        }
        
        /** This contains the ansi colors used in the color picker. No guarantee at all **/
        var ansicolors = [
      '000000', 'cd0000', '00cd00', 'cdcd00', '1e90ff', 'cd00cd', '00cdcd', 'e5e5e5', '4c4c4c', 'ff0000', // 10
      '00ff00', 'ffff00', '4682b4', 'ff00ff', '00ffff', 'FFFFFF', '000000', '00005F', '000087', '0000af', // 20
      '0000D7', '0000FF', '005F00', '005F5F', '005f87', '005faf', '005fd7', '005fff', '008700', '00875f', // 30
      '008787', '0087af', '0087d7', '0087ff', '00af00', '00af5f', '00af87', '00afaf', '00afd7', '00afff', // 40
      '00d700', '00d787', '00d787', '00d7af', '00d7af', '00d7ff', '00ff00', '00ff5f', '00ff87', '00ffaf', // 50
      '00ffd7', '00ffff', '5f0000', '5f5fff', '5f0087', '5f00af', '5f00d7', '5f00ff', '5f5f00', '5f5f5f', // 60
      '5f5f87', '5f5faf', '5f5fd7', '5f5fff', '5f8700', '5f875f', '5f8787', '5f87af', '5f87d7', '5f87ff', // 70
      '5faf00', '5faf5f', '5faf87', '5fafaf', '5fafd7', '5fafff', '5fd700', '5fd75f', '5fd787', '5fd7af', // 80
      '5fd7d7', '5fd7ff', '5fff00', '3399cc', '5fff87', '5fffaf', '5fffd7', '5fffff', '870000', '87005f', // 90
      '870087', '8700af', '8700af', '8700ff', '875f00', '875f5f', '875f87', '875faf', '875fd7', '875fff', // 100 
      '878700', '87875f', '878787', '8787af', '8787d7', '8787ff', '87af00', '87af5f', '87af87', '87afaf', // 110
      '87afd7', '87afff', '87d700', '87d75f', '87d787', '87d7af', '87d7d7', '87d7ff', '87ff00', '87ff5f', // 120
      '87ff87', '87ffaf', '87ffd7', '87ffff', 'af0000', 'af005f', 'af0087', 'af00af', 'af00d7', 'af00ff', // 130
      'af5f00', 'af5f5f', 'af5f87', 'af5faf', 'af5fd7', 'af5fff', 'af8700', 'af875f', 'af8787', 'af87af', // 140
      'af87d7', 'af87ff', 'afaf00', 'afd7af', 'afaf87', 'afafaf', 'afafd7', 'afafff', 'afd700', 'afd75f', // 150
      'afd787', 'afd7af', 'afd7d7', 'afd7ff', 'afff00', 'afff5f', 'afff87', 'afffaf', 'afffd7', 'afffff', // 160
      'd70000', 'd7005f', 'dd2699', 'd700af', 'd700d7', 'd700ff', 'd75f00', 'd75f5f', 'd75f87', 'd75faf', // 170
      'd75fd7', 'd75fff', 'd78700', 'd7875f', 'd78787', 'd787af', 'd787d7', 'd787ff', 'd7af00', 'd7af5f', // 180
      'd7af87', 'd7afaf', 'd7afd7', 'd7afff', 'd7d75f', 'd7d75f', 'd7d787', 'd7d7af', 'd7d7d7', 'd7d7ff', // 190
      'd7ff00', 'd7ff5f', 'd7ff87', 'd7ffaf', 'd7ffd7', 'd7ffff', 'ff0000', 'ff005f', 'ff0087', 'ff00af', // 200
      'ff00d7', 'ff00ff', 'ff5f00', 'ff5f5f', 'ff5f87', 'ff5faf', 'ff5fd7', 'ff5fff', 'ff8700', 'ff875f', // 210
      'ff8787', 'ff87af', 'ff87d7', 'ffaf00', 'ffaf00', 'ffaf5f', 'ffaf87', 'ffafaf', 'ffafd7', 'ffafff', // 220
      'ffd700', 'ffd75f', 'ffd787', 'ffd7af', 'ffd7d7', 'ffd7ff', 'ffff00', 'ffff5f', 'ffff87', 'ffffaf', // 230
      'ffffd7', 'ffffff', '080808', '121212', '1c1c1c', '262626', '303030', '3a3a3a', '444444', '4e4e4e', // 240
      '585858', '626262', '6c6c6c', '767676', '808080', '8a8a8a', '949494', '9e9e9e', 'a8a8a8', 'b2b2b2', // 250
      'bcbcbc', 'c6c6c6', 'd0d0d0', 'e4e4e4', 'e4e4e4', 'eeeeee', 'ffffff', '000000', '000000', '000000'  // 260
    ];
    
    /** This contains the special characters when choosing one of the character blocks inside the blue window **/
     var keys = new Array();
                keys[0] = [ 49, 50, 51, 52, 53, 54, 55, 56, 57, 48 ];
                keys[1] = [ 218, 191, 192, 217, 196, 179, 195, 180, 193, 194 ];
                keys[2] = [ 201, 187, 200, 188, 205, 186, 204, 185, 202, 203 ];
                keys[3] = [ 251, 184, 212, 190, 205, 179, 198, 181, 207, 209 ];
                keys[4] = [ 161, 183, 211, 135, 179, 186, 199, 182, 208, 144 ];
                keys[5] = [ 197, 206, 139, 140, 232, 163, 155, 156, 153, 239 ];
                keys[6] = [ 176, 177, 178, 219, 223, 220, 124, 141, 254, 250 ];
                keys[7] = [ 001, 002, 003, 004, 005, 006, 196, 127, 014, 207 ];
                keys[8] = [ 024, 025, 024, 025, 016, 017, 023, 023, 020, 021 ];
                keys[9] = [ 174, 175, 061, 243, 169, 170, 253, 246, 171, 172 ];
                keys[10] = [ 149, 241, 020, 021, 235, 157, 227, 167, 251, 252 ];
                keys[11] = [ 162, 225, 147, 228, 230, 232, 235, 236, 237, 237 ];
                keys[12] = [ 128, 135, 165, 164, 152, 159, 044, 249, 173, 168 ];
                keys[13] = [ 131, 132, 133, 160, 248, 134, 142, 143, 145, 146 ];
                
   
                keys[14] = [ 136, 137, 138, 130, 144, 140, 139, 141, 161, 158 ];
                keys[15] = [ 147, 148, 149, 224, 167, 150, 129, 151, 163, 154 ];
      /** Ansi interpreter, display and charactersatonce **/
      var interpreter, display, charactersatonce;
         
        function doRedraw(visibleXStart, visibleYStart, mustBe) {
           
             for (var x = 0; ( (x < visibleWidth-1) && (currentDraw==mustBe)); x++)
             {
                for (var y = 0; ( (y < visibleHeight) && (currentDraw==mustBe) ); y++) 
                {
                    codepage.copyChar(ctx, x+visibleXStart, y+visibleYStart, x, y); // do not store
                }
            }
        }
        
        function redrawScreen() {
            
             
            
             var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
             var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
            
             visibleXStart = Math.floor((scrollPosX/window_innerWidth)*width);
             visibleXStop = visibleXStart + visibleWidth;
             
             visibleYStart = Math.floor((scrollPosY/window_innerHeight)*height);
             var visibleYStop = visibleYStart + visibleHeight;
             animOffsetX=visibleXStart;
             animOffsetY=visibleYStart;
             
             doRedraw=true;
             
             
        }
          
        function showMenu() {
            
            
            
        }
        
        
    function clearWholeScreen() 
    {
        console.log("clearScreen");
       if (confirm('Are you sure?')) {
          doClearScreen(true);
        }
    }
    
	/** This clears the screen by putting spaces with the current foreground and background color on the screen **/
    function doClearScreen(resetCharacters, all) {
        
      if (typeof(all)=="undefined") all=false;
        
      var charArray = new Array();
      charArray[0]=32;
      charArray[1]=currentForeground;
      charArray[2]=currentBackground;
      var startY = 0;
      
       var bgstring = "#"+ansicolors[currentBackground];
       
       if (resetCharacters) {
           redrawCursor();
                while (startY<totalVisibleHeight) 
                {
                 var startX=0;
                 while (startX<totalVisibleWidth) 
                 {
                         screenCharacterArray[startY][startX++]=charArray;


                 }
                 startY++;
                }
                globalDisplay.clearScreen(bgstring);
       }
      
       ctx = document.getElementById("ansi").getContext("2d");
       ctx.fillStyle = bgstring;
       var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
       var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
       if (all==false) {
           ctx.fillRect(0, 0, window_innerWidth-canvasCharacterWidth, window_innerHeight-(canvasCharacterHeight*1));
       } else {
           ctx.fillRect(0, 0, document.getElementById('ansi').width, document.getElementById('ansi').height);
       }
       redrawCursor();
        
    }
        
        function updateCanvasSize() {
            
        }
        
         // Shows the cursor, which is ascii code 220 or 95, depending on whether or not insert is on. Does nothing with the character in the background.
         function redrawCursor() {

			 if ( (typeof(enableCursor)=="undefined") || (enableCursor==true) )
			 {
			 
            
            cursorShown=false;
            
            ctx = document.getElementById("ansi").getContext("2d");
           
            codepage.drawChar(ctx, insert==false ? 220 : 95, 15, (copyMode==false) ? 0 : 15, cursorPosX, cursorPosY, true, cursorPosY); // shows cursor transparently
            clearTimeout(cursorInterval);
            cursorInterval = setInterval(function() { toggleCursor(); }, 10);
			setTimeout(function() { clearTimeout(cursorInterval);  cursorShown=false; cursorInterval = setInterval(function() {  toggleCursor(); }, 500); }, 10);

			}

        }
       
        function getDisplayWidth() {
            return visibleWidth; // return parseInt(document.getElementById('displaywidth').value);
        }
        function getDisplayHeight() {
            return visibleHeight; // return parseInt(document.getElementById('displayheight').value);
        }
        function getTotalDisplayWidth() {
            return totalVisibleWidth; // return parseInt(document.getElementById('displaywidth').value);
        }
        function getTotalDisplayHeight() {
            return totalVisibleHeight; // return parseInt(document.getElementById('displayheight').value);
        }
        
        function setCursorPosX(x) {
             
            cursorPosX=x;
        }
        
        function setCursorPosY(y) {
            
            cursorPosY=y;
        }
        
        function setCursorPosXNoDebug(x) {
            cursorPosX=x;
        }
        
        function setCursorPosYNoDebug(y) {
            cursorPosY=y;
        }
        
        function initansicanvas() {
            
                setTimeout(function() { toggleCursor(true); }, 1000);
             
                ansicanvas = document.getElementById('ansi');
                
                ansicanvas.addEventListener('mousedown', function(e) {
                    
                  
                    
                        var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
                        var window_innerHeight = (visibleHeight*(canvasCharacterHeight));

                        var mouse = getMousePos(ansicanvas, e);
                        var my = mouse.y;                
                        var mx = mouse.x;

                        var myScrollbarY = window_innerHeight-canvasCharacterHeight;

                        if (my>(myScrollbarY)) {
                            movingXStartPos = mx;
                            console.log("Setting movingX to true");
                            movingX=true;
                            movingY=false;
                        }

                        var myScrollbarX = window_innerWidth-canvasCharacterWidth;

                        if (mx>myScrollbarX) {
                            movingYStartPos = my;
                            console.log("Setting movingY to true");
                            movingY=true;
                            movingX=false;
                        }
                    
                      if ( (copyMode) ) {
                        resetHighlighted();
                        copyMode=false;
                    }
                    
                    if (waitingforDoubleclick==false) {
                        hidePanel();
                        waitingforDoubleclick = true;
                        clearTimeout(doubleclickInterval);
                        doubleclickInterval = setTimeout(function() { waitingforDoubleclick=false; }, 300);
                        
                    } else {
                        
                        showPanel();
                    }
                    
                    mouseDown=true;
                    mouseMove(ansicanvas, e);
                   
                   /* asciiCode = screenCharacterArray[cursorPosY][cursorPosX][0];
                    fgcolor = screenCharacterArray[cursorPosY][cursorPosX][1];
                    bgcolor = screenCharacterArray[cursorPosY][cursorPosX][2];
                    console.log("asciiCode:"+asciiCode+" fgcolor:"+fgcolor+" bgcolor:"+bgcolor);
                    */
                  
                   
                    if (drawingMode) {
                       
                        codepage.drawChar(ctx, currentChar, currentForeground, currentBackground, cursorPosX, cursorPosY, false); // false == update coordinate system
                    }
                    
                   
                    
                }, true);
                
                
                    // PANEL !!!!
                document.getElementById('panel').addEventListener('mousedown', function(e) {
                    
                    if (waitingforDoubleclick==false) {
                        waitingforDoubleclick = true;
                        clearTimeout(doubleclickInterval);
                        doubleclickInterval = setTimeout(function() { waitingforDoubleclick=false; }, 400);
                    } else { // we can save us the work and clear the timeout
                        hidePanel();
                        waitingforDoubleclick = false;
                        clearTimeout(doubleclickInterval);
                    }
                });
                    
                 
                
                ansicanvas.addEventListener('mouseleave', function(e) {
                    mouseDown=false;
                });
                
                ansicanvas.addEventListener('mouseup', function(e) {
                   mouseDown=false;
                   if ( (movingX) || (movingY) ) {
                   firstLine=animOffsetY; 
                   leftLine=animOffsetX;
                   movingX=false;
                   movingY=false;
                   }
                });
                
                ansicanvas.addEventListener('mousemove', function(e) {
                   
                   
                   if (movingY==true) 
                   {
                       var mouse = getMousePos(ansicanvas, e);
                       var mx = mouse.x;
                       var my = mouse.y;
                       updateScrollbarY(2, my-movingYStartPos);
                       redrawScreen();
                   
                   } else
                   if (movingX==true) 
                   {
                       var mouse = getMousePos(ansicanvas, e);
                       var mx = mouse.x;
                       var my = mouse.y;
                       updateScrollbarX(2, mx-movingXStartPos);
                       redrawScreen();
                   
                   } else
                   
                   if (mouseDown==true) {
                    
                   mouseMove(ansicanvas,e);
                    
                   if (drawingMode==true) {
                        codepage.drawChar(ctx, currentChar, currentForeground, currentBackground, cursorPosX, cursorPosY, false); // false == update coordinate system
                    }
                    
                   }
                   
                });

               
        }
        
        /** This gets called whenever the mouse moves and the left mouse button is getting keeped pressed  **/
        
        function mouseMove(ansicanvas, e) {
            
            
            var mouse = getMousePos(ansicanvas, e);
                    var mx = mouse.x;
                    var my = mouse.y;                
            
            if (movingY==true) {
                
            } else if (movingX==true) {
                
            }
            
            
                   
                                        showCharacter(false);

					if (resizeToScreen==false)
					{					
                    
						myCursorPosX = Math.floor(mx / canvasCharacterWidth);
						myCursorPosY = Math.floor(my / canvasCharacterHeight);

					} else 
					{
						var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
						var window_innerHeight = (visibleHeight*(canvasCharacterHeight));

						myCursorPosX = Math.floor((mx / window_innerWidth) * visibleWidth);
						myCursorPosY = Math.floor((my / window_innerHeight) * visibleHeight);

					}
                                                var maxWidth = getDisplayWidth()-1;
                                                
                                                if (myCursorPosX<=maxWidth-scrollBarXShown) {
                                                    
                                                
						//if (myCursorPosX>=getDisplayWidth()-1) { console.log(myCursorPosX+" too far"); setCursorPosX(getDisplayWidth()-1); redrawCursor(); return; }
						if (myCursorPosY>=getDisplayHeight()-1-scrollBarYShown) { console.log(myCursorPosY+" too high"); setCursorPosX(myCursorPosX); setCursorPosY(getDisplayHeight()-1-scrollBarYShown); redrawCursor(); return; }
						
                                               
                                                    setCursorPosX(myCursorPosX);
                                                    setCursorPosY(myCursorPosY);
                                                } else {
                                                    // Calculate scrollbar
                                                    
                                                }
						redrawCursor();
                                                
                   
            
        }
        
		 /** This gets called from handleKeyCode **/
        function executeKey(keyCode) {
       showCharacter(false); 
        if (insert==false) {
                                    var myascii = screenCharacterArray[cursorPosY+firstLine][cursorPosX][0] ;
                                    undo.push({ action : "overwrite", x : cursorPosX, y : cursorPosY, fgColor : screenCharacterArray[cursorPosY][cursorPosX][1], bgColor : screenCharacterArray[cursorPosY][cursorPosX][2], asciiCode : myascii});
                                    
                                  
                                    codepage.drawChar(ctx, keyCode, currentForeground, currentBackground, cursorPosX, cursorPosY, false, cursorPosY+leftLine, cursorPosX+leftLine);
                                    if (cursorPosX<getDisplayWidth()-2) { setCursorPosX(cursorPosX+1); }
                                    redrawCursor();
                                } else {
                                    
                                    undo.push({ action : "removeCharacter", x : cursorPosX, y : cursorPosY, rightsideAsciiCode : screenCharacterArray[cursorPosY+firstLine][getDisplayWidth()-1][0], rightsideFGColor : screenCharacterArray[cursorPosY+firstLine][getDisplayWidth()-1][1], rightsideBGColor : screenCharacterArray[cursorPosY+firstLine][getDisplayWidth()-1][2]});
                                   
                                    moveAndDrawCharacters(keyCode);
                                    codepage.drawChar(ctx, keyCode, currentForeground, currentBackground, cursorPosX, cursorPosY, false, cursorPosY+firstLine, cursorPosX+leftLine);
                                    if (cursorPosX<getDisplayWidth()-2) { setCursorPosX(cursorPosX+1); } else
                                        if ((cursorPosX+leftLine)<getTotalDisplayWidth()-2) { scrollRight++; }
                                    redrawCursor();
                                }
                                
                                localStorage["ansicanvas"]=JSON.stringify(screenCharacterArray);
       
   }
   
   /** CTRL-C - buffer functionality - called when pressing CTRL-V **/
   function moveAndDrawCharacters(keyCode) {
       
            var realY = Number(firstLine)+Number(cursorPosY);
            var currentPos=getDisplayWidth()-2;
                                            while (currentPos>cursorPosX) 
                                            {

                                            if (typeof(screenCharacterArray[cursorPosY+firstLine][currentPos-1+leftLine])=="undefined") 
                                            {
                                                console.log("Error Y: "+currentPos+" X: "+(currentPos-1)+" is undefined");
                                                return;
                                            }
                                            var realX = Number(leftLine)+Number(currentPos);
                                            var prevX = realX-1;
                                            var asciiCode = screenCharacterArray[realY][prevX][0];
                                            var fgColor = screenCharacterArray[realY][prevX][1];
                                            var bgColor = screenCharacterArray[realY][prevX][2];


                                            codepage.drawChar(ctx, asciiCode, fgColor, bgColor, currentPos, cursorPosY, false, realY, realX);
                                            currentPos--;

                                            }
       
       var currentPos = getTotalDisplayWidth()-1; // No left line
       
       while (currentPos>=getDisplayWidth()+leftLine-1) {
          
           screenCharacterArray[realY][currentPos]=screenCharacterArray[realY][currentPos-1];
           currentPos--;
       }
                                   
       
   }
        
		 /** This is the panel with the information about how to use this application **/
        function showPanel() {
         
            if ($('#panel').css('display')!="block") {
                
                         $(".panel").slideDown("slow", "easeOutBounce");
                        } 
                        waitingforDoubleclick = false;
                        clearTimeout(doubleclickInterval);
        }
        
		/** This hides the panel **/
        function hidePanel() {
            if ($('#panel').css('display')=="block") {
                 $(".panel").slideUp("slow", "easeOutBounce");
            }
            waitingforDoubleclick = false;
            clearTimeout(doubleclickInterval);
        }
        
		/* This creates a new screenCharacterArray in which the colors and codes get stored, by default color white and space (32) **/
        function setANSICanvasSize() {
            var totalDisplayWidth=getTotalDisplayWidth();
            var totalDisplayHeight=getTotalDisplayHeight();
            
            for (var y = 0; y <= totalDisplayHeight; y++) // TODO if really 
            {                    
                    var xArray = new Array();
                    for (var x = 0; x <= totalDisplayWidth; x++)  // TODO if really
                    {
                     var data = new Array();
                     data[0]=32; // ascii code
                     data[1]=15; // foreground color
                     data[2]=0; // background color
                     xArray[x]=data;
                    }
                    screenCharacterArray[y]=xArray;
                    
                    //console.log("y:"+y+" length:"+screenCharacterArray[y].length);
            }

           $('body').attr('onresize', 'resize_canvas();');
            
        }
        
		/** This gets called to switch the cursor between insert and overwrite mode **/
        function toggleCursor(interval) {
     
            cursorShown=!cursorShown;
            
            if (cursorShown) {
               
            // Depending on what cursor is active, shows character code 220 or character code 95
            console.log("copyMode:"+copyMode);
            codepage.drawChar(globalContext, insert==false ? 220 : 95, 15, (copyMode == false) ? 0 : 15, cursorPosX, cursorPosY, true, false); // shows cursor transparently
            
            } else {
                showCharacter(false); // see below
            }
            
           
            
        }
        
        
		/** Shows the character at the current position. Might get called from toggleCursor to hide the cursor **/
        
        function showCharacter(overwrite) {
            
            if (typeof(overwrite)=="undefined") overwrite=true;
            
            var asciiCode = screenCharacterArray[cursorPosY+firstLine][cursorPosX+leftLine][0];
            var foreground = screenCharacterArray[cursorPosY+firstLine][cursorPosX+leftLine][1];
            var background = screenCharacterArray[cursorPosY+firstLine][cursorPosX+leftLine][2];
       
            codepage.drawChar(globalContext, asciiCode, foreground, (copyMode == false) ? background : 15, cursorPosX, cursorPosY, false, overwrite);
            
        }
        
       function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
    
    function cursorMove() {
        
    }
    
    
    
    /** This converts to keycodes to real characters. Language dependency included. Calls executeKey to show the keys in effect **/
   function handleKeyCode(keyCode,e) {
          
            
               if ( (copyMode) && (!e.shiftKey) ) {
                   if ( (keyCode!=99) && (keyCode!=116) && (keyCode!=120) ) {
                        resetHighlighted();
                        copyMode=false;
                        }
                    }
               
                if ( (keyCode>=48) && (keyCode<=57) )
                {
                    
                        if (keyCode==48) keyCode=9; else
                        keyCode=keyCode-49;
                   
                        executeKey(keys[(currentCharset-1)][keyCode]);
                   
                    return true;
                }
                
                
              
                clearTimeout(hideTimer);
                codepage.overlay=null;
                
                switch(keyCode){
                    
                    case 120 :  // CTRL-X
					
	                    if (ctrlKey) { // this is not e.ctrlKey
	                    
	                     if (copyMode) 
	                     {
	                     
	                     	for (var x = 0; x < copyWidth; x++) {
	                     		for (var y = 0; y < copyHeight; y++) 
	                     		{
	                     			codepage.drawChar(globalContext, 32, 15, 0, cursorPosX+x, cursorPosY+y+firstLine, false, true);
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
                             
                             var asciiCode = myredo.asciiArray[0];
                             var fgColor = myredo.asciiArray[1];
                             var bgColor = myredo.asciiArray[2];
                             
                             showCharacter(false);
                             setCursorPosX(myredo.x+1);
                             setCursorPosY(myredo.y);
                             
                             moveAndDrawCharacters(keyCode);
                             codepage.drawChar(ctx, asciiCode, fgColor, bgColor, myredo.x, myredo.y);
                             
                         } else { // overwrite
                             
                             var asciiCode = myredo.asciiArray[0];
                             var fgColor = myredo.asciiArray[1];
                             var bgColor = myredo.asciiArray[2];
                             showCharacter(false)
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
                                        var asciiCode = screenCharacterArray[currentPosY][currentPosX+1][0];
                                        var fgColor = screenCharacterArray[currentPosY][currentPosX+1][1];
                                        var bgColor = screenCharacterArray[currentPosY][currentPosX+1][2];

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
                                      var asciiCode = screenCharacterArray[cursorPosY+firstLine][currentPos+1][0];
                                      var fgcolor = screenCharacterArray[cursorPosY+firstLine][currentPos+1][1];
                                      var bgcolor = screenCharacterArray[cursorPosY+firstLine][currentPos+1][2];
                                      
                                      codepage.drawChar(ctx, asciiCode, fgcolor, bgcolor, currentPos-leftLine, cursorPosY, false, false);
                                  }
                                  screenCharacterArray[cursorPosY+firstLine][currentPos]=screenCharacterArray[cursorPosY+firstLine][currentPos+1];
                                  currentPos++;
                              }
                              
                              var ch = new Array();
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
   }
   
   
   function highlightCharacter(myCursorPosX, myCursorPosY) {
       
       var asciiCode = screenCharacterArray[myCursorPosY+firstLine][myCursorPosX+leftLine][0];
       var foreground = screenCharacterArray[myCursorPosY+firstLine][myCursorPosX+leftLine][1];
       codepage.drawChar(ctx, asciiCode, foreground, 15, myCursorPosX, myCursorPosY, false, false); // do not store
       
   }
   
    function showOriginalCharacter(myCursorPosX, myCursorPosY) {
       
       var asciiCode = screenCharacterArray[myCursorPosY+firstLine][myCursorPosX+leftLine][0];
       var foreground = screenCharacterArray[myCursorPosY+firstLine][myCursorPosX+leftLine][1];
       var background = screenCharacterArray[myCursorPosY+firstLine][myCursorPosX+leftLine][2];
       codepage.drawChar(ctx, asciiCode, foreground, background, myCursorPosX, myCursorPosY, false, false); // do not store
       
   }
   
   function resetHighlighted() 
   {
       
       if (copyStartY < copyEndY) {
          
           for (var y = copyStartY; y <= copyEndY; y++) {
       
            if (copyStartX < copyEndX) {
                for (var x = copyStartX; x <= copyEndX; x++) 
                {
                        showOriginalCharacter(x, y);
                }
            } else { // copyStartX > copyEndX
                for (var x = copyEndX; x <= copyStartX; x++) 
                {
                        showOriginalCharacter(x, y);
                }
            }
                
                
                
          }
      } else {
          
          for (var y = copyStartY; y >= copyEndY; y--) {
       
          
           if (copyStartX < copyEndX) {
              
                for (var x = copyStartX; x <= copyEndX; x++) 
                {
                        showOriginalCharacter(x, y);
                }
            } else { // copyStartX > copyEndX
               
                for (var x = copyEndX; x <= copyStartX; x++) 
                {
                        showOriginalCharacter(x, y);
                }
            }
            
           }
          
      }
       
   }
   
   
   
   /** This gets called due when a different event gets called **/
   function handleKeyCode2(keyCode,e) {
             
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
   
   
   
   
   /** This registers a key event listener, so entering something in the browser has functionality **/
   function registerKeyEventListener() { 
		
                document.body.addEventListener('keypress',
                function(e)
                {
                
                    var keyCode = e.which;
                   
                    if (keyCode!=0) {
                        e.preventDefault(); 
                        
                        window.handleKeyCode(keyCode,e);
                    }
                
                },
                false);
                
                document.body.addEventListener('keydown',
                function(e)
                {
                 
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
                        window.handleKeyCode2(keyCode,e);
                    } else if (keyCode==8) {
                        e.preventDefault();
                        window.handleKeyCode(keyCode, e);
                    }
                    
                
                },
                false);
                
               
                
    }
        
		/** This is getting called whenever the user resizes the canvas, to show always the same amount of characters, just with a different width and height **/
        function resize_canvas(){
            
            canvas = document.getElementById("ansi");
            ctx = document.getElementById("ansi").getContext("2d");
            setCanvasSize(canvas);
            //doClearScreen(false);
           
            for (var y = firstLine; y < screenCharacterArray.length-1; y++) {
           
                for (var x = 0; x < screenCharacterArray[y].length-1; x++) {
                
                     
                     var charArray = screenCharacterArray[y][x];
                     asciiCode=charArray[0];
                     foreground=charArray[1];
                     background=charArray[2];
                    
                    
                     codepage.drawChar(ctx, asciiCode, foreground, background, x, y, false);
                     
                }
            }
            updateScrollbarX(2);
            updateScrollbarY(2);
        }
        
       function setCanvasSize(canvas) {
            
            var window_innerWidth = $(window).width();
            var window_innerHeight = $(window).height();
            var characterWidthPct= window_innerWidth/(visibleWidth*8); // How often does the character fit into the width
            var characterHeightPct = window_innerHeight/(visibleHeight*16);  // How often does the character fit into the height
            
            if (resizeToScreen==false) {
            
                fullCanvasWidth=Math.floor(visibleWidth*8*characterWidthPct);
                fullCanvasHeight=Math.floor(visibleWidth*8*characterHeightPct);

                canvas.width=fullCanvasWidth;
                canvas.height=fullCanvasHeight;
                canvasCharacterWidth=Math.floor(8*characterWidthPct);
                canvasCharacterHeight=Math.floor(16*characterHeightPct);
        
            } else {
            
                fullCanvasWidth=window_innerWidth; // Math.floor(width*8*characterWidthPct);
                fullCanvasHeight=window_innerHeight; // Math.floor(width*8*characterHeightPct);

                canvas.width=fullCanvasWidth;
                canvas.height=fullCanvasHeight;

                canvasCharacterWidth=Math.floor(window_innerWidth/visibleWidth); // Math.floor(8*characterWidthPct);
                canvasCharacterHeight=Math.floor(window_innerHeight / visibleHeight); // Math.floor(16*characterHeightPct);
           
            
            }
           
            
        } 
      
       /** This is getting called when saving the ANSI, and exports the asciis by saving the decimal values of the screen into a file **/
      
        
       function myexport() {
       
                cursorY=firstLine;

                var html="";

                while (cursorY+1<height) 
                {
                 var lineWidth=getDisplayWidth()-1;
                 
                 lineAsciiCode=screenCharacterArray[cursorY][lineWidth][0];
                 lineBackground=screenCharacterArray[cursorY][lineWidth][2];
                 
                 while ( (lineAsciiCode==32) && (lineBackground==0) && (lineWidth>=0) ) 
                 {
                     lineAsciiCode=screenCharacterArray[cursorY][lineWidth][0];
                     lineBackground=screenCharacterArray[cursorY][lineWidth][2];
                     if (lineAsciiCode==32)
                     lineWidth--;
                 }
                 
                 cursorX=0;
                 while (cursorX<=lineWidth)
                 {
                            var charArray = screenCharacterArray[cursorY][cursorX];
                            if (typeof(charArray[0])!="undefined") {
                                    var asciiCode = charArray[0].toString();
                                    while (asciiCode.length<3) asciiCode="0"+asciiCode;

                                    var foreground = charArray[1].toString();
                                    while (foreground.length<3) foreground="0"+foreground;

                                    var background = charArray[2].toString();
                                    while (background.length<3) background="0"+background;
                             
                                    html+=asciiCode+foreground+background;
                            }
                        cursorX++;
                 }
                 html+="breakline";
                 cursorY++;
                }
                
               
                $.ajax({
                url: 'export.php',
                type: 'POST',
                dataType : 'json',
                data: { value: html },
                success: function(result) {
                   $('#file').html(result.filename);
                   $('#file').attr("href", "download/"+result.filename);
                   $('#part1').css('display', 'inline');
                   $('#part2').css('display', 'none');
                   $('#popup').bPopup();
                }
                });
            
        }
        
    