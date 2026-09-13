# Fix refresh 404 on aaPanel / nginx

Frontend and admin use HashRouter. New links are `https://chalakgo.com/#/about`
and `https://admin.chalakgo.com/#/jaipur-tour`.

1. Run `npm run build` separately in frontend and admin.
2. Upload the **contents** of frontend/dist to the chalakgo.com website root,
   and admin/dist to the admin.chalakgo.com website root. Include index.html,
   hash-route.js and assets together.
3. In aaPanel, open each website's nginx configuration and replace its existing
   `location /` with the block in backend/deploy/website-nginx.conf. Preserve
   the site root and SSL settings. Do not apply this to the API domain.
4. Validate with `nginx -t`, then reload nginx in aaPanel. Clear any CDN HTML
   cache and hard-refresh the browser.
5. Open `/about`: nginx serves index.html, then hash-route.js changes the URL
   to `/#/about` before React starts. Refresh and confirm About stays open.
   Check admin `/jaipur-tour` similarly. Booking hashes and query strings are
   preserved when converting old links.

JavaScript cannot repair nginx's own 404 before index.html is served. Uploading
the new build fixes new hash links; the nginx fallback also supports old
bookmarks. These local files do not apply the configuration to the VPS.
