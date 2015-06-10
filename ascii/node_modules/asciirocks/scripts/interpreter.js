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

function Interpreter(url, display) {
        var http, buffer, pos, escaped, escapeCode;

		

        

        http = new XMLHttpRequest();
        http.open("GET", url, true);

        http.onreadystatechange = function () {
            
            if (http.readyState === 4) {
                if (http.status === 200) {
					globalPos = 0;
					escapeCode = "";
					globalEscaped = false;
					globalDisplay = display;
                    globalBuffer = new Uint8Array(http.response);
                   
                } else {
                    throw ("Could not retrieve: " + url);
                }
            }
        };

        http.setRequestHeader("Content-Type", "application/octet-stream");
        http.responseType = "arraybuffer";
        http.send();

		
    }

