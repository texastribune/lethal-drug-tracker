'use strict';

import buildChart from './stepChart';
import onDocumentReady from './utils/on-document-ready';
import debounce from './utils/debounce'

onDocumentReady(buildChart);
window.addEventListener("resize", debounce(buildChart, 300));
