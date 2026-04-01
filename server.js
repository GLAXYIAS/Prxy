const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Beautiful dark homepage (similar to your screenshot)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Proxy</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', system-ui, sans-serif;
          background: linear-gradient(135deg, #0f0f1e, #1a1a2e, #16213e);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }

        .container {
          text-align: center;
          z-index: 10;
        }

        h1 {
          font-size: 3.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #a5b4fc, #c4d0ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          font-size: 1.1rem;
          color: #a1a1aa;
          margin-bottom: 2rem;
        }

        .search-bar {
          width: 620px;
          max-width: 90%;
          margin: 0 auto;
          position: relative;
        }

        input {
          width: 100%;
          padding: 18px 24px;
          font-size: 1.15rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          color: white;
          backdrop-filter: blur(12px);
        }

        input::placeholder {
          color: #71717a;
        }

        input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
        }

        .shortcut {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #a1a1aa;
        }

        .footer {
          margin-top: 4rem;
          font-size: 0.95rem;
          color: #52525b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>My Proxy</h1>
        <p>Enter any URL to browse privately</p>
        
        <form action="/proxy" method="get" class="search-bar">
          <input type="text" name="url" placeholder="Search or enter URL..." autocomplete="off" autofocus required>
          <div class="shortcut">⏎</div>
        </form>

        <div class="footer">
          Powered by Render • Free Web Proxy
        </div>
      </div>
    </body>
    </html>
  `);
});

// Proxy logic - handles the actual browsing
app.use('/proxy', createProxyMiddleware({
  target: 'https://example.com', // dummy target
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyReq: (proxyReq, req) => {
    let url = req.query.url;
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    proxyReq.url = url;
    proxyReq.host = new URL(url).host;
  },
  onProxyRes: (proxyRes) => {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['strict-transport-security'];
  }
}));

// Redirect everything else to home
app.get('*', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dark Web Proxy running on port ${PORT}`);
});
