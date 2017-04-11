'use strict';

import buildChart from './stepChart';
import onDocumentReady from './utils/on-document-ready';
import debounce from './utils/debounce'

onDocumentReady(makeDots);
onDocumentReady(buildChart);
window.addEventListener("resize", debounce(makeDots, 200));
window.addEventListener("resize", debounce(buildChart, 300));

//makes dots the same height as width
function makeDots() {
    var width = document.getElementsByClassName('dose-dot')[0].clientWidth;
    var elements = document.getElementsByClassName('dose-dot');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.height=(width+"px");
    }
}
