'use strict';

import buildChart from './stepChart';
import onDocumentReady from './utils/on-document-ready';

onDocumentReady(buildChart);
window.onresize = buildChart;
