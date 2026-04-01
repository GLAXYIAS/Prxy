const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Serve a nice frontend page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Proxy - Unblock Anything</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; background: #f4f4f4; padding: 50px; }
        h1 { color: #333; }
        input { width: 60%; padding: 12px; font-size: 18px; border: 2px solid #ccc; border-radius: 8px; }
        button { padding: 12px 30px; font-size: 18px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .info { margin-top: 40px; color: #666; }
      </style>
    </head>
    <body>
      <h1>🚀 My Simple Web Proxy</h1>
      <p>Enter any website URL below to browse through the proxy</p>
      
      <form action="/proxy" method="get" style="margin: 30px 0;">
        <input type="text" name="url" placeholder="https://www.youtube.com" required autocomplete="off">
        <button type="submit">Go →</button>
      </form>

      <div class="info">
        <p>Powered by Render • Free & Simple</p>
        <p>Tip: Add https:// at the start if needed</p>
      </div>
    </body>
    </html>
  `);
});

// The actual proxy route - this handles everything after you submit the URL
app.use('/proxy', createProxyMiddleware({
  target: '', // target will be dynamic
  changeOrigin: true,
  selfHandleResponse: true, // important for full pages
  onProxyReq: (proxyReq, req) => {
    const url = req.query.url;
    if (url) {
      proxyReq.url = url.startsWith('http') ? url : 'https://' + url;
      proxyReq.host = new URL(proxyReq.url).host;
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // This helps with many sites
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));

// Fallback
app.get('*', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Browser Proxy running on port ${PORT}`);
});
