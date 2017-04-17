import './utils/polyfills';
import { h, render } from 'preact';
import buildChart from './stepChart';
import onDocumentReady from './utils/on-document-ready';
import debounce from './utils/debounce'
import RelatedStories from './related-stories';

onDocumentReady(makeDots);
onDocumentReady(buildChart);

document.getElementById('more-log').addEventListener('click', showLog);
window.addEventListener('resize', debounce(makeDots, 200));
window.addEventListener('resize', debounce(buildChart, 300));
const relatedStories = document.querySelector('#related-stories-container');
onDocumentReady(loadRelatedStories);

//makes dots the same height as width
function makeDots() {
    var width = document.getElementsByClassName('dose-dot')[0].clientWidth;
    var margin = 10;

    var elements = document.getElementsByClassName('dose-dot');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.height=(width+margin+'px');
    }
}

//show more past log
function showLog() {
  var logs = document.getElementsByClassName('log--item')
  var logLength = logs.length
  var moreButton = document.getElementById('more-log')
  //get first hidden ID and start from there?

  //how to get to show only some more?
  for(var i=1; i <= logLength; i++) {
    document.getElementById('loop-'+i).classList.remove('hidden')
  }

  moreButton.classList.add('hidden')
}

function loadRelatedStories () {
  const url = 'https://www.texastribune.org/api/content/?content_type=story,audio,video,pointer&amp;tag=subject-death-penalty&amp;tag!=object-tribcast&amp;fields=id,url,readable_pub_date,seo_headline,short_summary,lead_art&amp;limit=4&amp;format=json';

  console.log(url);
  render(
    <RelatedStories
      src={url}
      numStories=2
      isColumn
    />,
    relatedStories
  );
}
