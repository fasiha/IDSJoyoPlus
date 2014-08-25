function getOnline(url) {
    d3.xhr(url, 'text/plain',
           function(err, req) { _response = req.responseText; });
}

// http://stackoverflow.com/a/10615607/500207
function fixedFromCharCode (codePt) {
    if (codePt > 0xFFFF) {
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    else {
        return String.fromCharCode(codePt);
    }
}

// https://github.com/imaya/zlib.js/blob/master/README.en.md
function stringToByteArray(str) {
    var array = new (window.Uint8Array !== void 0 ? Uint8Array : Array)(str.length);
    var i;
    var il;

    for (i = 0, il = str.length; i < il; ++i) {
        array[i] = str.charCodeAt(i) & 0xff;
    }

    return array;
}

// http://stackoverflow.com/a/18729536/500207
function s2a(str) {
    var utf8 = unescape(encodeURIComponent(str));
    var arr = [];
    for (var i = 0; i < utf8.length; i++) {
        arr.push(utf8.charCodeAt(i));
    }
    return arr;
}


var treeDb = {};
var treeArr = [];
var zip1line = new Zlib.Zip();
var zipIndent = new Zlib.Zip();
function pruneTrees() {

    d3.xhr('ids.txt', 'text/plain', function(err, req) {
        if (err) {
            return console.error(err);
        }

        PRIMITIVES = "艹亠聿戈𢦏巛巜⺀䒑儿";
        KANJI = PRIMITIVES + KANJI;

        var divTrees = d3.select("body").append("div").attr("id", "trees");
        // Via http://apps.timwhitlock.info/js/regex
        var massiveHanStr = '[⺀-\\u2efe㇀-\\u31ee㈀-㋾㌀-㏾㐀-\\u4dbe一-\\u9ffe豈-\\ufafe︰-﹎]|[\\ud840-\\ud868\\ud86a-\\ud86c][\\udc00-\\udfff]|\\ud869[\\udc00-\\udede\\udf00-\\udfff]|\\ud86d[\\udc00-\\udf3e\\udf40-\\udfff]|\\ud86e[\\udc00-\\udc1e]|\\ud87e[\\udc00-\\ude1e]';
        var hanRe = XRegExp(massiveHanStr);
        var spacesAnglesHanRe = XRegExp(' +<' + massiveHanStr + '>')

        var processTree = function(k, thisIdx, maxIdx) {
            var idx = KANJI.indexOf(k);
            url = 'tree/' + k + '.txt';
            d3.xhr(url, 'text/plain', function(err, req) {
                var thistree = req.responseText;

                arr =
                    thistree.replace(XRegExp('\\\\x\\{([0-9a-fA-F]+)\\}', 'g'),
                                     function(match, hex) {
                                         return fixedFromCharCode(
                                             parseInt("0x" + hex));
                                     }).split("\n");

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].search(spacesAnglesHanRe) >= 0) {
                        var subKanji = arr[i].match(hanRe)[0],
                            numSpaces = arr[i].search(subKanji) - 1,
                            loc = KANJI.indexOf(subKanji);
                        if (loc >=
                            0 /*&& loc < idx*/) {  // Remove the upper bound:
                                                   // sometimes Heisig uses
                                                   // something as a primitive
                                                   // in RTK1 and then uses it
                                                   // as a real kanji in RTK3.
                            // Prune tree!
                            arr[i] = arr[i].replace(/>./, ">");
                            for (var j = i + 1; j < arr.length; j++) {
                                if (arr[j].search(XRegExp(
                                        ' {' + (numSpaces + 2) + '}')) >= 0) {
                                    arr.splice(j, 1);
                                    j--;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }

                zipIndent.addFile(
                    s2a(arr.join("\n")),
                    {filename : stringToByteArray(thisIdx + '.txt')});

                var s = true ? arr.join("").replace(/ /g, "") : arr.join("\n");
                s = s.replace(/<(.{1,2})>/g, "$1");

                treeDb[k] = s;
                treeArr.push(s);

                zip1line.addFile(s2a(s),
                            {filename : stringToByteArray(thisIdx + '.txt')});

                if (thisIdx + 1 == maxIdx) {
                    console.log(thisIdx + " " + maxIdx);
                    idsDone();
                }

                // divTrees.append("div").text(s).style("white-space", "pre");
            });
        };

        var ids = req.responseText.split("\n")
                      .filter(function(x) { return x.length; });

        var maxKanji = ids.length;
        //maxKanji = 90;
        ids.map(function(line, idx) {
            if (idx < maxKanji) {
                var kanji = line.charAt(1);
                processTree(kanji, idx, maxKanji);
            }
        });
    });
}
pruneTrees();

var compressedIndent, compressed1line;
function idsDone() {
    //editMarkdown();
    compressed1line = zip1line.compress();
    
    // https://developer.mozilla.org/en-US/docs/Web/API/Blob
    var blob1line = new Blob([compressed1line], {type: 'application/octet-binary'}); // pass a useful mime type here
    var url = URL.createObjectURL(blob1line);
    d3.select("body").append("a").attr("href", url).text("DOWNLOAD BLOB 1");

    compressedIndent = zipIndent.compress();
    var blobIndent = new Blob([compressedIndent], {type: 'application/octet-binary'}); // pass a useful mime type here
    url = URL.createObjectURL(blobIndent);
    d3.select("body").append("a").attr("href", url).text("DOWNLOAD BLOB 2");

}

var geditable, gids, gidsdb;
function editMarkdown() {
    d3.xhr('editable.md', 'text/plain', function(err, req) {
        var editable = req.responseText;
        geditable = editable;

        var s2 = XRegExp.replace(
            editable, XRegExp('# (\\p{Han})([^\n]+)\\n\\((.+?)\\)'),
            function(match, k, kw, description) {
                if (k in treeDb) {
                    return "# " + k + kw + "\n(" + description + "; " +
                           treeDb[k] + ')';
                } else {
                    return match;
                }
            },
            'all');

        d3.select("body").append("div").text(s2).style("white-space", "pre");
    });
}