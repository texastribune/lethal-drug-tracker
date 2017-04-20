import { Component, h } from 'preact';
import get from './utils/get';

import Story from './story';

class RelatedStories extends Component {
  constructor () {
    super();

    this.state = {
      stories: []
    };
  }

  loadStories () {
    const src = this.props.src;

    get(src).then(JSON.parse).then(({ results }) => {
      this.setState({ stories: results });
    }).catch((err) => {
      throw err;
    });
  }

  componentDidMount () {
    this.loadStories();
  }

  render () {
    const stories = this.state.stories;
    const isColumn = this.props.isColumn;
    const title = this.props.title;
    const numStories = this.props.numStories;

    const pointerUrl = 'https://www.texastribune.org/2017/04/21/heres-how-many-execution-drugs-texas-has-right-now/';
    const currentUrl = `${window.location.protocol}//${window.location.host}/${window.location.pathname}`;

    const renderedStories = stories.filter((story) => story.url !== currentUrl && story.url !== pointerUrl).slice(0, numStories).map((story) => {
      return <Story {...story} />;
    });

    return (
      <div class={`related-stories${isColumn ? ' related-stories--column' : ''}`}>
        {title && <h3 class="section-sub-header">{title}</h3>}
        {renderedStories}
      </div>
    );
  }
}

export default RelatedStories;
