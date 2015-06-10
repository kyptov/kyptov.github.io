
function map(hex) {
        var r = parseInt(hex.slice(0,2), 16);
        var g = parseInt(hex.slice(2,4), 16);
        var b = parseInt(hex.slice(4,6), 16);
        return [ r, g, b ];
}

function x256(r, g, b) 
{
    var c = [ r, g, b ];
    var best = null;
    
    for (var i = 0; i < ansicolors.length; i++) {
        var mymap = map(ansicolors[i]);
        if ( (mymap[0]==c[0]) && (mymap[1]==c[1]) && (mymap[2]==c[2]) ) return i; // Remove this to have the original sourcecode, which maybe does not work 100%
        var d = distance(mymap, c)
        if (!best || d <= best.distance) {
            best = { distance : d, index : i-1 };
        }
    }
    
    return best.index;
}

function distance (a, b) {
    return Math.sqrt(
        Math.pow(a[0]-b[0], 2)
        + Math.pow(a[1]-b[1], 2)
        + Math.pow(a[2]-b[2], 2)
    )
}
