IDSJoyoPlus
===========

IDSgrep ([overview](http://tsukurimashou.sourceforge.jp/idsgrep.php.en), [manual](http://tsukurimashou.sourceforge.jp/idsgrep.pdf), [academic paper](http://arxiv.org/abs/1404.5585)) is a tool for running "grep"-like text searches in databases of Chinese characters. This repository contains the (heavily-processed) output of IDSgrep looking up the IDS decompositions of 3,028 "essential" Japanese kanji (the 2200 jōyō kanji plus a few hundred more), ordered according to James Heisig's *Remembering the Kanji,* 6th edition. Each character is linked to a more visual, indented tree-like representation of its IDS decomposition, also generated by IDSgrep. Finally, this repository contains a plain-text file with the same data as the HTML file.

"IDS" here refers to Unicode's ideographic description sequences, a comprehensive analysis of which is given in the IDSgrep documentation.

This use of IDSgrep barely exercises its features. IDSgrep is essentially being used to look up characters in the [CJKVI Project](https://github.com/cjkvi/cjkvi-data)'s database of Chinese character components, which is included in IDSgrep.

**Recommendation** Getting a font like [HanaMin](http://fonts.jp/hanazono/) with good support for obscure CJK Han Unicode points is advised, but not required since for characters outside the Unicode Basic Multilingual Plane, an SVG image is provided, courtesy of GlyphWiki.

**Acknowledgements** Besides IDSgrep and CJKVI, as well as James Heisig's books for a sensible sorting order, I use SVGs from the free [GlyphWiki](http://en.glyphwiki.org) database to render Unicode characters frequently unavailable on standard fontpacks, as well as CDP (Chinese Document Processing Lab) characters which are apparently not available in Unicode.