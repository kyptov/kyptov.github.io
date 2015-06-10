/** This registers a key event listener, so entering something in the browser has functionality **/
function registerParsedKeyEventListener() {
		
                document.body.addEventListener('keydown',parsed_keypress,
                false);
                
                document.body.addEventListener('keypress',parsed_keydown,
                false);
                
               
                
}
    
var parsed_keydown = function(e)
                {
                
                    var keyCode = e.which;
                   
                    if (keyCode!=0) {
                        e.preventDefault(); 
                        
                        handleParsedKeyCode(keyCode,e);
                    }
                
                };
                
var parsed_keypress = function(e)
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
                       handleParsedKeyCode2(keyCode,e);
                    } /*else if (keyCode==8) {
                        e.preventDefault();
                        parsed_handleParsedKeyCode(keyCode, e);
                    }*/
                    
                
                };
                
var parsed_mousedown = function(e) {
				  
                    if (doubleClickStarted)
                    {
                        doubleClickStarted=false;
                        switchbutton();
                        clearTimeout(doubleClickInterval);
                    }
                    doubleClickStarted = true;
                    doubleClickInterval = setTimeout(function() { doubleClickStarted=false; }, 300);
                   
                    var ansicanvas = document.getElementById('ansi');
                    var mouse = getMousePos(ansicanvas, e);
                    var mx = mouse.x;
                    var my = mouse.y;                    
                    
                    showCharacter();
                    
                    myCursorPosX = Math.floor(mx / canvasCharacterWidth);
                    myCursorPosY = Math.floor(my / canvasCharacterHeight);
                    
                    if (myCursorPosX>=getDisplayWidth()-1) { console.log(myCursorPosX+" too far"); setCursorPosX(getDisplayWidth()-1); redrawCursor(); return; }
                    if (myCursorPosY>=getDisplayHeight()-1) { console.log(myCursorPosY+" too high"); setCursorPosY(getDisplayHeight()-1); redrawCursor(); return; }
                   
                    
                    checkSelectionOnParsed(myCursorPosX, myCursorPosY);
                    
}