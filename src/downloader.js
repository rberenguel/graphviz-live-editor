export {
  getAllImages,
  toDataURLs,
  zippy,
  saveBlob
};

import {
  monoid
} from "../webfonts/monoid.js";
import {
  downloadZip
} from "../lib/client-zip.js";


async function zippy(svgBlob, dot) {
  const images = getAllImages(dot)
  const replacements = images.map(path => {
    const splat = path.split("/")
    const filename = splat[splat.length - 1]
    return [path, filename]
  })
  let replaced = dot
  for (let replacement of replacements) {
    replaced = replaced.replace(replacement[0], replacement[1])
  }
  const readme = {
    name: "readme.html",
    lastModified: new Date(),
    input: `
    <p>You can compile the dot file by using the graphviz CLI like this:</p>
    <p><code>dot -Tpng graph.dot -Gdpi=300 -o graph.png</code></p>
    <p>from within the uncompressed folder "graph".</p>
    <p>Be sure to attribute asset origin properly:</p>
    <ul>
    <li><a href="https://fontawesome.com">FontAwesome</a></li>
    <li>AWS’s <a href="https://aws.amazon.com/architecture/icons/">diagram assets</a></li>
    <li><a href="https://github.com/rberenguel/graphviz-live-editor">This project</a></li>
    </ul>
`
  }
  const fetched =
    replacements.map(thing => {
      const f = fetch(thing[0]);
      return f
    })

  const bye = "goodbye."
  const blob = await downloadZip([{
      name: "graph.svg",
      lastModified: new Date(),
      input: svgBlob
    },
    {
      name: "graph.dot",
      lastModified: new Date(),
      input: replaced
    },
    ...fetched,
    readme
  ]).blob()
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "graph.zip"
  link.click()
}

function saveBlob(saver) {
  return svgData => {
    var head =
      '<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg">';
    var style = `<style>
  circle {cursor: pointer;stroke-width: 1.5px;}
  text {font: 10px;}
  path {stroke: DimGrey;stroke-width: 1.5px;}
  ${monoid}
  </style>`;
    const clean = svgData.replace(/<svg width[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="touch-action: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">')
    var full = head + style + clean + "</svg>";
    var blob = new Blob([full], {
      type: "image/svg+xml"
    });
    saver(blob)
  }
}

function toDataURLs(imageSrcs, callback, outputFormat, replacements, svg, saver) {
  if (imageSrcs.length == 0) {
    let replacedSVG = svg;
    for (let i = 0; i < replacements.length; i++) {
      let [src, dataURL] = replacements[i];
      replacedSVG = replacedSVG.replace(src, dataURL);
    }
    saver(replacedSVG);
  }
  let img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    replacements.push([imageSrcs[0], dataURL]);
    imageSrcs.shift();
    callback(imageSrcs, callback, outputFormat, replacements, svg, saver);
  };
  img.src = imageSrcs[0];
  if (img.complete || img.complete === undefined) {
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = imageSrcs[0];

  }
}

function getAllImages(dot) {
  const imageMatcher = /image=\"([^\"]+)\"/g;
  const matches = [...dot.matchAll(imageMatcher)].map((e) => e[1]);
  return matches;
}