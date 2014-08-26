"""
Finds characters outside the Unicode BMP (Basic Multilingual Plane)
and applies a transformation. In this case, prepends the hexadecimal
value of the character.

REQUIRES Python3.3+!
"""

def map2string(map):
    return "".join(list(map))

def editExtraBMP(string, func):
    UTF16 = 2**16-1
    news = map(lambda ch: func(ch) if ord(ch) > UTF16 else ch, s)
    return map2string(news)

def prependHex(ch):
    return "(" + hex(ord(ch)) + ch + ")"

with open("ids.html", "r", encoding="utf8") as fid:
    s = fid.read()
with open("newids.html", "w", encoding="utf8") as fid:
    fid.write(editExtraBMP(s, prependHex))
