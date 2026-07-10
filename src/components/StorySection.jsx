import Reveal from './Reveal.jsx'
import './story.css'

/*
 * StorySection — the connective tissue that makes the homepage read as one
 * unfolding system rather than separate blocks. Every content section shares
 * the same header: a small stacked-diamond node (echoing the logo), a layer
 * number, a kicker, and the title — threaded together by a faint vertical line
 * running down the page. `thread` draws the connector rising into this section
 * from the one above (omit on the first story section).
 */
function StoryNode() {
  return (
    <span className="story-node" aria-hidden="true">
      <span className="story-node-top" />
      <span className="story-node-mid" />
      <span className="story-node-bot" />
    </span>
  )
}

export default function StorySection({
  id,
  n,
  kicker,
  title,
  sub,
  thread = true,
  className = '',
  children,
}) {
  return (
    <section className={`section story-section ${thread ? '' : 'story-first'} ${className}`} id={id}>
      <div className="container">
        <Reveal className="story-head">
          <StoryNode />
          <div className="story-head-text">
            <p className="story-kicker">
              {n && <b>{n}</b>}
              {kicker}
            </p>
            <h2 className="section-title">{title}</h2>
            {sub && <p className="section-sub story-sub">{sub}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
