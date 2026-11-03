import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SiteLayout from './components/SiteLayout.jsx';
import { BlogList, BlogPost } from './components/Blog.jsx';
import { blogSeo } from './utils/blogSeo.js';

export function renderBlog({ pathname, post, posts, settings }) {
  return {
    body: renderToString(<HelmetProvider><MemoryRouter initialEntries={[pathname]}><SiteLayout showFooterReviews={false}>{post ? <BlogPost post={post} relatedPosts={posts} /> : <BlogList posts={posts} loading={false} />}</SiteLayout></MemoryRouter></HelmetProvider>),
    seo: blogSeo(post, settings),
  };
}
