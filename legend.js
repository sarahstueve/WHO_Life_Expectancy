import legendNotebook from "https://api.observablehq.com/@d3/color-legend.js?v=3";
// borrowing legend from observable, need to borrow runtime to ensure dependencies 
// are able to run from the observable notebook.
import {Runtime} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
let mod = new Runtime().module(legendNotebook)
var Legend = await mod.value("Legend");
console.log(Legend)
export {Legend};

// Legend example 
// let legend_div = document.querySelector("#legend");
// let viridis = Legend(d3.scaleSequential([0, 100], d3.interpolateTurbo), {
//     title: "Temperature (°F)"
// })
// let turbo = Legend(d3.scaleSequentialSqrt([0, 1], d3.interpolateTurbo), {
//     title: "Speed (kts)"
// })
// legend_div.node().append(viridis)
// .append(turbo)