import { storyContent } from '../data'
import StatsStrip from './StatsStrip'

function StoryShowcase({ stats }) {
  return (
    <section id="story" className="story-showcase">
      <div className="story-showcase__canvas">
        <img src={storyContent.curve} alt="" className="story-curve story-curve--left" aria-hidden="true" />
        <img src={storyContent.curve} alt="" className="story-curve story-curve--right" aria-hidden="true" />

        {storyContent.foods.map((food) => (
          <img key={food.className} src={food.src} alt="" className={food.className} aria-hidden="true" />
        ))}

        <div className="story-showcase__intro">
          <h2>
            Better food for
            <br />
            more people
          </h2>
          <p>{storyContent.subheading}</p>
        </div>
      </div>

      <StatsStrip stats={stats} />
    </section>
  )
}

export default StoryShowcase
