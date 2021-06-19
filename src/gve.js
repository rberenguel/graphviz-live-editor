import { example } from "./dots.js";
import { getAllImages, toDataURLs, zippy, saveBlob } from "./downloader.js";

let gv, cm;
var changed = true;
var width,
  height = 0;

const t = d3.transition()
    .duration(300)
    .ease(d3.easeLinear);
  
const render = () => {
  gv.width(width)
    .height(height)
    .fit(true)
    .zoom(true)
    .scale(0.8)
    .transition(t).renderDot(cm.getValue());
};

const init = () => {
  document.addEventListener("keydown", (d) => (changed = true));
  const graph = d3.select("#graph");
  const graphBb = graph.node().getBoundingClientRect();
  width = graphBb.width;
  height = graphBb.height;
  gv = graph.graphviz();
  for (let img of fontawesome.concat(aws)) {
    gv.addImage(img.text.replace('"', ""), "100px", "100px");
  }
  for (let img of oss) {
    gv.addImage(img.text.replace('"', ""), "100px", "100px");
  }
  
  document.getElementById("single-svg").addEventListener("click", (e) => {
    const allImages = getAllImages(cm.getValue());
    const replaced = toDataURLs(allImages, toDataURLs, "image/png", [], document.getElementById("graph").innerHTML, saveBlob(b => saveAs(b, "graph.svg")))
    //
  });
  document.getElementById("zippy").addEventListener("click", (e) => {
    const dot = cm.getValue()
    const allImages = getAllImages(dot);
    const replaced = toDataURLs(allImages, toDataURLs, "image/png", [], document.getElementById("graph").innerHTML, saveBlob( b => zippy(b, dot)))
    
  });
  document.getElementById("info-menu").addEventListener("click", () => {
    document.getElementById("info").classList.toggle("hidden")
  })
  document.getElementById("get-example").addEventListener("click", () => {
    cm.getDoc().setValue(example)
    document.getElementById("menu-open").checked = false
  })
  document.getElementById("close").addEventListener("click", () => {
    document.getElementById("info").classList.toggle("hidden")
  })
};

const initCM = () => {
  let initialText = window.localStorage.getItem("gve")
  if(!initialText){
    initialText = example
  }
  cm = CodeMirror(document.getElementById("editor"), {
    value: initialText,
    mode: "dot",
    lineWrapping: true,
    lint: true,
    tabSize: 2,
    indentUnit: 2,
    matchBrackets: true,
  });

  cm.setSize("95%", "95%");

  cm.on("update", (cm) => {
    if (changed) {
      try {
        render();
      } catch (err) {
      } finally {
      }
      changed = false;
    }
  });

  cm.on("keyup", function (cm, event) {
    const tokenTypes = ["tag", "variable"];
    const keyCode = event.keyCode;
    const returnOrSpace = keyCode == 13 || keyCode == 32
    console.log(returnOrSpace)
    const noReturnOrSpace = !returnOrSpace;
    const cursor = cm.getDoc().getCursor();
    const token = cm.getTokenAt(cursor);
    const tokenControl = tokenTypes.includes(token.type) || token.string == " ";
    if (returnOrSpace) {
      window.localStorage.setItem("gve", cm.getValue())
    }
    
    if (!cm.state.completionActive && noReturnOrSpace && tokenControl) {
      CodeMirror.commands.autocomplete(cm, CodeMirror.hint.dot, {
        completeSingle: false,
      });
      
    }
  });
};

init();
initCM();
render();


