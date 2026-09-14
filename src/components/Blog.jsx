import { PageText } from "./PageCopy.jsx";
import { useLiveEffect } from './LiveSite'
import { usePageSeo } from './Seo.jsx'
import { assetUrl } from '../utils/assets.js'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_BASE } from '../utils/api.js'

const fallbackImage =
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=85'

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

async function fetchJson(path, signal) {
  const response = await fetch(`${API_BASE}${path}`, { signal })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Unable to load blog posts.')
  return data
}

export default function Blog() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const metadata = slug && post?.slug === slug ? post : null
  usePageSeo({ title: error ? 'Blog Unavailable' : metadata?.seoTitle || metadata?.title, description: metadata?.seoDescription || metadata?.excerpt || metadata?.content, image: metadata?.socialImage || metadata?.coverImage ? assetUrl(metadata.socialImage || metadata.coverImage) : undefined, type: metadata ? 'article' : 'website', noindex: Boolean(error || metadata?.noindex) })

  useLiveEffect(() => {
    const controller = new AbortController();
    setError('');
    setPost(null);
    const path = slug ? `/api/blogs/${encodeURIComponent(slug)}` : "/api/blogs";

    fetchJson(path, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setError("");
        return slug ? setPost(data) : setPosts(data);
      })
      .catch((requestError) => { if (!controller.signal.aborted) setError(requestError.message); });
    return () => controller.abort();
  }, [slug])

  if (error)
    return (
      <BlogMessage title={slug ? 'Article not found' : 'Blog is unavailable'} message={error} />
    )
  if (slug) return post ? <BlogPost post={post} /> : <BlogMessage title="Loading article…" />

  return <BlogList posts={posts} />
}

function BlogList({ posts }) {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-5 py-16 text-[#101a31] sm:py-24">
      <section className="mx-auto max-w-6xl">
        <p className="font-bold text-blue-600"><PageText id="text_3">CHALAKGO BLOG</PageText></p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl"><PageText id="text_4">
          Better journeys start with better information.
        </PageText></h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-500"><PageText id="text_5">
          Practical driving, travel, and safety insights from the ChalakGo team.
        </PageText></p>
        {posts.length === 0 ? (
          <p className="mt-14 rounded-2xl border bg-white p-8 text-slate-500"><PageText id="text_6">
            No blog posts have been published yet.
          </PageText></p>
        ) : (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function BlogCard({ post }) {
  return (
    <article className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <img src={assetUrl(post.coverImage || fallbackImage)} alt={post.coverAlt || post.title} className="h-48 w-full object-cover" />
      <div className="p-7">
        <p className="text-sm font-semibold text-blue-600">
          {formatDate(post.publishedAt)} · {post.author || 'ChalakGo Team'}
        </p>
        <h2 className="mt-3 text-2xl font-extrabold">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-slate-500">{post.excerpt || post.content}</p>
        <Link to={`/blog/${post.slug}`} className="mt-6 inline-block font-bold text-blue-600"><PageText id="text_7">
          Read article →
        </PageText></Link>
      </div>
    </article>
  )
}

function BlogPost({ post }) {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#101a31]">
      <article className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
        <Link to="/blog" className="font-bold text-blue-600"><PageText id="text_8">
          ← All articles
        </PageText></Link>
        <p className="mt-10 font-semibold text-blue-600">
          {formatDate(post.publishedAt)} · {post.author || 'ChalakGo Team'}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">{post.title}</h1>
        {post.category && <p className="mt-4 font-semibold text-blue-600">{post.category}</p>}
        {post.excerpt && <p className="mt-6 text-xl leading-8 text-slate-500">{post.excerpt}</p>}
        {post.coverImage && (
          <img
            src={assetUrl(post.coverImage)}
            alt={post.coverAlt || post.title}
            className="mt-10 h-72 w-full rounded-3xl object-cover sm:h-[440px]"
          />
        )}
        {post.coverCaption && <p className="mt-3 text-sm text-slate-500">{post.coverCaption}</p>}
        <div className="mt-10 whitespace-pre-wrap text-lg leading-8 text-slate-600">
          {post.content.split(/\n\s*\n/).map((block, index) => block.startsWith("## ") ? <h2 key={index} className="mt-8 text-2xl font-bold">{block.slice(3)}</h2> : <p key={index} className="mb-5">{block}</p>)}
        </div>
        {!!post.tags?.length && <div className="mt-8 flex flex-wrap gap-2">{post.tags.map(tag => <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{tag}</span>)}</div>}
        {post.authorBio && <aside className="mt-8 rounded-xl bg-white p-6"><h2 className="font-bold">About {post.author}</h2><p className="mt-2 text-slate-600">{post.authorBio}</p></aside>}
      </article>
    </main>
  )
}

function BlogMessage({ title, message }) {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-5 py-28 text-center">
      <h1 className="text-4xl font-extrabold">{title}</h1>
      {message && <p className="mt-4 text-slate-500">{message}</p>}
    </main>
  )
}
