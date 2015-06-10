<?php
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
function foreground($foreground) {
   return chr(27)."[38;5;".$foreground."m";
}

function background($background) {
    return chr(27)."[48;5;".$background."m";    
}

$currentForeground=15;
$currentBackground=0;

fwrite($f, foreground(15));
fwrite($f, background(0));

$pos=0;
while ($pos<strlen($string)) {
    
    $extract = substr($string, $pos, 9);
    
    if (strcmp($extract,"breakline")==0) {
        fwrite($f, chr(13).chr(10));
    } else {
        $asciiCode=substr($extract, 0, 3);
        $foreground=substr($extract, 3, 3);
        $background=substr($extract, 6, 3);
        
        while ( (strcmp(substr($foreground, 0, 1), "0")==0)  && (strlen($foreground)>1) ) 
        {
         $foreground=substr($foreground, 1);    
        }
        while ( (strcmp(substr($background, 0, 1), "0")==0) && (strlen($background)>1) )
        {
         $background=substr($background, 1);    
        }
        
        if ( ($currentBackground==0) && ($asciiCode==32) ) {
            fwrite($f, foreground(0));
            $currentForeground=0;
        } else {
            if ($foreground!=$currentForeground) fwrite($f, foreground($foreground));#
            $currentForeground=$foreground;
        }
        if ($background!=$currentBackground) fwrite($f, background($background));
        
        fwrite($f, chr($asciiCode));
        
        $currentBackground=$background;
    }
    
    $pos=$pos+9;
    
}

fclose($f);

?>