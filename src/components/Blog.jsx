import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock3, MapPin, Search, ChevronRight, Check, CarFront } from 'lucide-react'
import { siteFetch } from '../utils/siteFetch.js'
import { API_BASE } from '../utils/api.js'
import { assetUrl } from '../utils/assets.js'
import { useLiveEffect } from './LiveSite'
import { usePageSeo } from './Seo.jsx'
import SiteImage from './SiteImage.jsx'
import './Blog.css'
import { blogSeo } from '../utils/blogSeo.js'
import { servicePath } from '../utils/serviceRoutes.js'
import { blogTextParts } from '../utils/blogLinks.js'

export function BlogText({ children }) {
  return blogTextParts(children).map((part, index) => part.href
    ? part.href.startsWith('/') ? <Link key={index} to={part.href}>{part.text}</Link>
      : <a key={index} href={part.href}>{part.text}</a>
    : <span key={index}>{part.text}</span>)
}

function cover(post) {
  if (post.coverImage) return assetUrl(post.coverImage)
  const key = /india-tour/.test(post.slug) ? 'roadtrip' : /jaipur-tour/.test(post.slug) ? 'jaipur' : /airport|cab-chauffeur/.test(post.slug) ? 'airport' : 'chauffeur'
  return assetUrl(`/uploads/blog-${key}-v1.webp`)
}
function topic(post) {
  if (/tour/i.test(`${post.category} ${post.slug}`)) return 'Tours & travel'
  if (/Jaipur$/.test(post.category || '') && post.category !== 'Permanent Driver') return 'Local guides'
  return 'Driver services'
}
function minutes(post) { return post.readingMinutes || Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200)) }
function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
}
function PostMeta({ post }) {
  return <div className="journal-meta"><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time><span aria-hidden="true">/</span><span><Clock3 size={13} /> {minutes(post)} min read</span></div>
}
export default function Blog() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const initial = typeof window !== 'undefined' && window.__CHALAKGO_BLOG__?.pathname === window.location.pathname ? window.__CHALAKGO_BLOG__ : null
  const [posts, setPosts] = useState(initial?.posts || [])
  const [post, setPost] = useState(initial?.post || null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(!initial)
  const metadata = slug && post?.slug === slug ? post : null
  const seo = useMemo(() => blogSeo(metadata, initial?.settings), [metadata, initial?.settings])
  usePageSeo({ title: error ? 'Blog Unavailable' : seo.title, description: seo.description, keywords: metadata?.seoKeywords, canonical: seo.canonical, image: seo.image, structuredData: seo.structuredData, type: metadata ? 'article' : 'website', noindex: Boolean(error || seo.noindex) })
  useLiveEffect(() => {
    const controller = new AbortController()
    setError(''); if (!initial) { setLoading(true); setPost(null) }
    siteFetch(`${API_BASE}${slug ? `/api/blogs/${encodeURIComponent(slug)}` : '/api/blogs'}`, { signal: controller.signal })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Unable to load articles.')
        if (slug && data.slug && data.slug !== slug) { navigate('/blog/' + data.slug, { replace: true }); return }
        if (!controller.signal.aborted) {
          if (slug) setPost(data)
          else setPosts(data)
          setLoading(false)
        }
      }).catch(error => { if (!controller.signal.aborted) { setError(error.message); setLoading(false) } })
    return () => controller.abort()
  }, [slug])
  useLiveEffect(() => {
    if (!slug) return
    const controller = new AbortController()
    siteFetch(API_BASE + '/api/blogs', { signal: controller.signal })
      .then(response => response.ok ? response.json() : [])
      .then(items => { if (!controller.signal.aborted && Array.isArray(items)) setPosts(items) })
      .catch(() => {})
    return () => controller.abort()
  }, [slug])
  if (error) return <BlogMessage title={slug ? 'Article not found' : 'Unable to load the journal'} message={error} />
  if (slug) return metadata ? <BlogPost post={metadata} relatedPosts={posts} /> : <BlogMessage title="Loading article..." />
  return <BlogList posts={posts} loading={loading} />
}
export function BlogList({ posts, loading }) {
  const [active, setActive] = useState('All articles')
  const [query, setQuery] = useState('')
  const featured = posts.find(post => post.isFeatured) || posts.find(post => post.slug === 'jaipur-tour-by-car-sightseeing-guide') || posts[0]
  const filtered = active !== 'All articles' || query.trim()
  const visible = posts.filter(post => (filtered || post !== featured) && (active === 'All articles' || topic(post) === active) && `${post.title} ${post.excerpt || ''} ${post.category || ''} ${(post.tags || []).join(' ')} ${post.content || ''} ${post.seoKeywords || ''}`.toLowerCase().includes(query.trim().toLowerCase()))
  return <main className="journal">
    <section className="journal-intro journal-container">
      <div><div className="journal-eyebrow"><span /> THE CHALAKGO JOURNAL</div><h1>Your next journey.<br /><span>A little better planned.</span></h1><p>Local know-how, thoughtful travel guides and practical advice for every journey in Jaipur and beyond.</p></div>
      <div className="journal-location"><MapPin size={17} /><span>ROOTED IN JAIPUR.<br /><strong>MADE FOR YOUR JOURNEY.</strong></span></div>
    </section>
    <div className="journal-container">
      {loading ? <div className="journal-skeleton" role="status">Loading the latest stories...</div> : featured && !filtered && <article className="journal-feature">
        <Link to={`/blog/${featured.slug}`} className="journal-feature-image" aria-label={`Read ${featured.title}`}><SiteImage priority src={cover(featured)} alt={featured.coverAlt || featured.title} sizes="(max-width: 760px) 100vw, 65vw" /><span className="journal-image-label">THE EDITOR'S PICK</span></Link>
        <div className="journal-feature-copy"><div className="journal-eyebrow">{featured.category || topic(featured)}</div><h2><Link to={`/blog/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><PostMeta post={featured} /><Link className="journal-read" to={`/blog/${featured.slug}`}>Explore the story <ArrowUpRight size={19} /></Link></div>
      </article>}
      <section className="journal-stories" aria-labelledby="stories-heading">
        <div className="journal-section-heading"><div><div className="journal-eyebrow">GOOD READS. BETTER JOURNEYS.</div><h2 id="stories-heading">Explore the journal</h2></div><span>{loading ? 'Loading articles' : `${posts.length} stories & local guides`}</span></div>
        <div className="journal-toolbar"><div className="journal-filters" role="group" aria-label="Filter articles by topic">{['All articles', 'Local guides', 'Driver services', 'Tours & travel'].map(item => <button type="button" aria-pressed={active === item} key={item} onClick={() => setActive(item)}>{item}</button>)}</div><label className="journal-search"><Search size={17} /><input type="search" aria-label="Search articles" placeholder="Find your next read" value={query} onChange={e => setQuery(e.target.value)} /></label></div>
        <div aria-live="polite" className="journal-results">{filtered && `${visible.length} ${visible.length === 1 ? 'article' : 'articles'} found`}</div>
        {!loading && visible.length ? <div className="journal-grid">{visible.map(post => <BlogCard key={post._id || post.slug} post={post} />)}</div> : !loading && <div className="journal-empty"><h3>{posts.length ? 'No stories found' : 'New stories are on the way'}</h3><p>{posts.length ? 'Try another topic or search for a Jaipur area.' : 'Come back soon for our latest travel guides.'}</p>{filtered && <button onClick={() => { setQuery(''); setActive('All articles') }}>Clear filters</button>}</div>}
      </section>
      <JourneyCta />
    </div>
  </main>
}
function BlogCard({ post }) {
  return (
    <article className="journal-card">
      <Link className="journal-card-image" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        <SiteImage src={cover(post)} alt={post.coverAlt || post.title} sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
        <span className="journal-card-topic">{post.category || topic(post)}</span>
        <span className="journal-card-arrow"><ArrowUpRight size={20} /></span>
      </Link>
      <div className="journal-card-body">
        <PostMeta post={post} />
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt || post.content}</p>
        <div className="journal-card-footer">
          <div className="journal-card-author"><span aria-hidden="true">CG</span><span>{post.author || 'ChalakGo Team'}</span></div>
          <Link to={`/blog/${post.slug}`} className="journal-card-read">Read story <ArrowRight size={16} /></Link>
        </div>
      </div>
    </article>
  )
}
function JourneyCta() {
  return <aside className="journal-cta"><div><div className="journal-eyebrow">LET'S GET YOU THERE</div><h2>A good journey starts<br />with the right driver.</h2><p>Your car or ours. A local ride or a longer escape.</p></div><Link to="/services">Find your service <ArrowUpRight size={20} /></Link></aside>
}
function articleSections(content) {
  const sections = []
  for (const block of content.split(/\n\s*\n/).filter(block => block.trim())) {
    if (block.startsWith('## ')) sections.push({ title: block.slice(3), id: `section-${sections.length}`, blocks: [] })
    else {
      if (!sections.length) sections.push({ title: '', id: 'section-introduction', blocks: [] })
      sections.at(-1).blocks.push(block)
    }
  }
  return sections
}
function ArticleBlock({ block }) {
  if (block.startsWith('### ')) return <h3><BlogText>{block.slice(4)}</BlogText></h3>
  if (block.startsWith('> ')) return <blockquote><BlogText>{block.slice(2)}</BlogText></blockquote>
  if (block.split('\n').every(line => /^[-*] /.test(line))) return <ul>{block.split('\n').map((line, index) => <li key={index}><BlogText>{line.slice(2)}</BlogText></li>)}</ul>
  return <p><BlogText>{block}</BlogText></p>
}
export function BlogPost({ post, relatedPosts = [] }) {
  const sections = articleSections(post.content)
  const headings = sections.filter(section => section.title)
  const related = relatedPosts.filter(item => item.slug !== post.slug).sort((a, b) => Number(topic(b) === topic(post)) - Number(topic(a) === topic(post))).slice(0, 3)
  return (
    <main className="journal journal-article">
      <div className="journal-container">
        <nav className="journal-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><Link to="/blog">Journal</Link><ChevronRight size={13} /><span>{post.category || 'Article'}</span></nav>
        <header className="journal-article-hero">
          <div className="journal-article-heading">
            <div className="journal-eyebrow"><span /> THE CHALAKGO JOURNAL</div>
            <span className="journal-hero-category">{post.category || topic(post)}</span>
            <h1>{post.title}</h1>
            {post.excerpt && <p>{post.excerpt}</p>}
            <div className="journal-byline"><span className="journal-avatar" aria-hidden="true">CG</span><div><strong>{post.author || 'ChalakGo Team'}</strong><PostMeta post={post} />{post.updatedAt && <span className="journal-updated">Updated {formatDate(post.updatedAt)}</span>}</div></div>
          </div>
          <figure className="journal-article-cover"><SiteImage priority src={cover(post)} alt={post.coverAlt || post.title} sizes="(max-width: 760px) 100vw, 50vw" />{post.coverCaption && <figcaption>{post.coverCaption}</figcaption>}</figure>
        </header>
        <div className="journal-reading-layout">
          <aside className="journal-contents">
            <div className="journal-toc-card"><span className="journal-eyebrow">IN THIS GUIDE</span><nav aria-label="Article sections">{headings.map((heading, index) => <a href={`#${heading.id}`} key={heading.id}><span>{String(index + 1).padStart(2, '0')}</span>{heading.title}</a>)}</nav><span className="journal-toc-duration"><Clock3 size={14} /> {minutes(post)} minute read</span></div>
            <div className="journal-booking-card"><span className="journal-booking-icon"><CarFront size={22} /></span><h2>Let's plan<br />your next journey.</h2><p>A driver for your car, a private cab or time to explore Jaipur.</p><Link to="/services">Explore services <ArrowUpRight size={17} /></Link><Link to="/contact" className="journal-booking-contact">Have a question? Talk to us</Link></div>
          </aside>
          <article className="journal-prose">
            <div className="journal-reading-note"><span className="journal-eyebrow">A LITTLE LOCAL KNOW-HOW</span><p>Thoughtful planning. Clear choices. A more comfortable journey.</p></div>
            {sections.map((section, index) => <section className="journal-prose-section" key={section.id}>{section.title && <div className="journal-section-title"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h2 id={section.id}>{section.title}</h2></div>}{section.blocks.map((block, index) => <ArticleBlock key={index} block={block} />)}</section>)}
            {!!post.faqs?.length && <section className="journal-faqs"><h2>Frequently asked questions</h2>{post.faqs.map((faq, index) => <details key={index}><summary>{faq.question}</summary><p><BlogText>{faq.answer}</BlogText></p></details>)}</section>}
            {!!post.relatedServices?.length && <aside className="journal-service-links"><h2>Explore services for this journey</h2>{post.relatedServices.map(slug => <Link key={slug} to={servicePath(slug)}>{({ 'driver-only': 'Book a Personal Driver in Jaipur', 'car-driver': 'Cab with Driver', 'permanent-driver': 'Permanent Driver Booking', 'jaipur-tour': 'Jaipur Sightseeing Tour' })[slug] || 'Explore service'} <ArrowUpRight size={15} /></Link>)}</aside>}
            <aside className="journal-checklist"><div className="journal-eyebrow">BEFORE YOU BOOK</div><h2>A few details make all the difference.</h2><ul>{['Your exact pickup address and preferred time', 'Your vehicle or car-with-driver preference', 'Your planned stops, waiting time and return journey'].map(item => <li key={item}><Check size={16} /><span>{item}</span></li>)}</ul><Link to="/contact" className="journal-read">Discuss your requirements <ArrowUpRight size={17} /></Link></aside>
            {!!post.tags?.length && <div className="journal-tags">{post.tags.filter(Boolean).map((tag, index) => <span key={`${tag}-${index}`}>{tag}</span>)}</div>}
            <aside className="journal-author"><span className="journal-avatar" aria-hidden="true">CG</span><div><div className="journal-eyebrow">WRITTEN BY</div><h3>{post.author || 'ChalakGo Team'}</h3>{post.authorBio && <p>{post.authorBio}</p>}</div></aside>
            <Link className="journal-read" to="/blog">Back to all articles <ArrowRight size={17} /></Link>
          </article>
        </div>
        {!!related.length && <section className="journal-related" aria-labelledby="related-heading"><div className="journal-section-heading"><div><div className="journal-eyebrow">KEEP EXPLORING</div><h2 id="related-heading">A little more inspiration</h2></div><Link className="journal-read" to="/blog">View all stories <ArrowRight size={17} /></Link></div><div className="journal-grid">{related.map(item => <BlogCard key={item.slug} post={item} />)}</div></section>}
        <JourneyCta />
      </div>
    </main>
  )
}
function BlogMessage({ title, message }) {
  return <main className="journal journal-empty" role="status"><h1>{title}</h1>{message && <p>{message}</p>}<Link className="journal-read" to="/blog">Back to journal <ArrowRight size={17} /></Link></main>
}
