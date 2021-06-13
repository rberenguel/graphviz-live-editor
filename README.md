# Graphviz live editor

This is a quick-and-dirty (very dirty if you check the code) mash-up of a live editor (CodeMirror) with d3-graphviz to be able to edit DOT diagrams dynamically.

Future improvements (I may or may not apply):

- Improve autocompletion (it has several gotchas currently)
- Add more FontAwesome assets
- Add open source logo assets
- I'd love to export to PNG, but so far canvg does not render dotted correctly. It's also extremely tricky to get right.

Use/try it [here](http://rberenguel.github.io/graphviz-live-editor/).

---

This is a live editor for [Graphviz graphs](https://graphviz.org), based on [d3-graphviz](https://github.com/magjac/d3-graphviz) (which is based on [hpcc-js-wasm's port of Graphviz](https://github.com/hpcc-systems/hpcc-js-wasm) to WASM.

* Use the "image" menu button to download the canvas as an SVG, with any icons you use (and the Monoid font) embedded in the file

* Use the "archive" menu button to download the whole "project" as a ZIP archive. That is, any image assets you use, a DOT file you can compile locally and the image exported in SVG format

* The editor offers some primitive autocomplete for Graphviz [attributes](https://graphviz.org/doc/info/attrs.html), [node shapes](https://graphviz.org/doc/info/shapes.html) and some other properties, as well as for the AWS diagram assets and and FontAwesome glyphs.

* You can't add your own images (yet? If it's ever possible, it won't be easy), but can use [HTML style labels](https://graphviz.org/doc/info/shapes.html#html) and add remote images, but those can't be exported as SVG, but only as DOT file (with the archive option).

* Before exporting make sure all the diagram is visible, it will make things easier. Once exported you can tweak it with any SVG editor (like [Affinity Designer](https://affinity.serif.com/en-gb/designer/) or [Inkscape](https://inkscape.org))

* Sometimes the live preview will ignore some style or shape attribute (like changing from solid to dotted, has happened several times). The best way to get out of it is to copy the DOT code, refresh the page and pasting it again.

------------------------------------------------------------------------

This project would not be possible without other available assets or code:

-   AWS's [diagram assets](https://aws.amazon.com/architecture/icons/)
-   [FontAwesome](http://fontawesome.com)
-   [Lucas Bebbler's](http://lbebber.github.io/public/) [Gooey Menu](https://codepen.io/lbebber/pen/LELBEo)
-   The [CodeMirror](http://codemirror.net) editor
-   The [work done](https://github.com/codemirror/CodeMirror/issues/3638) by [AlgyTaylor](https://github.com/AlgyTaylor) for DOT syntax for CodeMirror
-   client-zip
-   file-saver

