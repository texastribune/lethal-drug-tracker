import { h } from 'preact';

const Story = ({ seo_headline, short_summary, url, lead_art, readable_pub_date }) => {
  return (
    <article class="story">
      <a class="story-link dim" href={url}>
        <div class="story-media">
          <div class="story-art">
            <img src={lead_art.thumbnails.letterbox} />
          </div>
          <div class="story-text">
            <header class="story-header">
              <h4 class="story-headline">{seo_headline}</h4>
              <p class="story-byline">{readable_pub_date}</p>
            </header>
          </div>
        </div>
      </a>
    </article>
  );
};

export default Story;
