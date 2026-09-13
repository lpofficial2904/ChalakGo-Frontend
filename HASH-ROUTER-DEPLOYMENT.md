# Clean URLs and refresh support

Frontend and admin now use BrowserRouter: /about and /jaipur-tour.
Old /#/about bookmarks are converted to /about before React starts.

1. In aaPanel, open the nginx configuration for chalakgo.com and admin.chalakgo.com.
2. Replace each existing location / block with:

    location / {
        try_files $uri $uri/ /index.html;
    }

Keep SSL and the correct website root settings. Do not apply this to api.chalakgo.com.
The complete snippet is backend/deploy/website-nginx.conf.
3. Run nginx -t, then reload nginx in aaPanel.
4. Upload the contents of frontend/dist and admin/dist to their respective website roots.
   Include index.html, hash-route.js and assets. Clear any CDN HTML cache.
5. Test /about and /services/driver-only, then refresh each. Test admin /jaipur-tour too.

IMPORTANT: Deploy the nginx fallback with this build. BrowserRouter alone cannot
prevent a server-generated 404. These local changes do not update the VPS config.
A #booking suffix is an intentional in-page anchor, not HashRouter routing.
