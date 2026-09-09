import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ManagedPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)

  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`https://chalakgo.onrender.com/api/pages/${encodeURIComponent(slug)}`)
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.message)
        setPage(data)
        document.title = data.seoTitle || data.title
      })
      .catch((e) => setError(e.message))
  }, [slug])
  if (error)
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-5 py-28 text-center text-[#101a31]">
        <h1 className="text-4xl font-extrabold">Page not found</h1>
        <p className="mt-4 text-slate-500">
          This page is unavailable or has not been published yet.
        </p>
      </main>
    )

  if (!page)
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-5 py-28 text-center text-slate-500">
        Loading page…
      </main>
    )
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#101a31]">
      <section className="bg-[#0b1c38] px-5 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-bold text-blue-300">{page.navigationLabel || 'CHALAKGO'}</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight sm:text-6xl">
            {page.heroTitle || page.title}
          </h1>
          {page.excerpt && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{page.excerpt}</p>
          )}
        </div>
      </section>
      <article className="mx-auto max-w-4xl whitespace-pre-wrap px-5 py-16 text-lg leading-8 text-slate-600 sm:py-24">
        {page.content}
      </article>
    </main>
  )
}
