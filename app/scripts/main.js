'use strict';

import gridMaker from './grid'
import onDocumentReady from './utils/on-document-ready';
import debounce from './utils/debounce'

onDocumentReady(gridMaker);
window.addEventListener("resize", debounce(gridMaker, 300));
