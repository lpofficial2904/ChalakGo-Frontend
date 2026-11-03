const origin = 'https://chalakgo.com';
function publicImage(value) {
  if (typeof value !== 'string' || !value || /[\s\\]/.test(value)) return undefined;
  try {
    const url = new URL(value, value.startsWith('/uploads/') ? 'https://api.chalakgo.com' : origin);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}
export function blogSeo(post, settings = {}) {
  const canonical = post?.canonicalUrl || `${origin}/blog${post ? '/' + post.slug : ''}`;
  const rawTitle = post?.seoTitle || post?.title || 'Driver & Travel Guides in Jaipur';
  const title = rawTitle.includes('ChalakGo') ? rawTitle : `${rawTitle} | ChalakGo`;
  const description = (post?.seoDescription || post?.excerpt || 'Explore practical personal driver, cab, Jaipur sightseeing and outstation travel guides from ChalakGo. Plan your journey and request a booking.').replace(/\s+/g, ' ').trim().slice(0, 180);
  const imageUrl = publicImage(post?.socialImage) || publicImage(post?.coverImage) || publicImage(settings.logo);
  const organization = { '@type': 'Organization', '@id': `${origin}/#organization`, name: settings.siteName || 'ChalakGo', url: origin + '/', ...(publicImage(settings.logo) ? { logo: publicImage(settings.logo) } : {}) };
  const iso = value => value && Number.isFinite(new Date(value).getTime()) ? new Date(value).toISOString() : undefined;
  return {
    title, description, canonical, image: imageUrl,
    noindex: Boolean(post?.noindex || post?.isPublished === false),
    structuredData: { '@context': 'https://schema.org', '@graph': [organization,
      ...(post ? [{ '@type': 'BlogPosting', '@id': `${canonical}#article`, headline: post.title, description, mainEntityOfPage: canonical, url: canonical, ...(imageUrl ? { image: [imageUrl] } : {}), datePublished: iso(post.publishedAt), dateModified: iso(post.updatedAt), author: { '@type': 'Organization', name: post.author || 'ChalakGo Team' }, publisher: { '@id': organization['@id'] }, inLanguage: 'en-IN', keywords: [post.primaryKeyword, ...(post.secondaryKeywords || [])].filter(Boolean).join(', ') }] : []),
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
        { '@type': 'ListItem', position: 2, name: 'Journal', item: origin + '/blog' },
        ...(post ? [{ '@type': 'ListItem', position: 3, name: post.title, item: canonical }] : []),
      ] },
    ] },
  };
}
