const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Example: Proxy everything that starts with /api/ to another site
// Change the target to whatever you want to proxy
app.use('/api', createProxyMiddleware({
  target: 'https://api.example.com',   // ←← Change this to the real site/API you want to forward to
  changeOrigin: true,                  // Important for many APIs
  pathRewrite: {
    '^/api': ''                        // Removes /api from the forwarded request
  }
}));

// Optional: Simple homepage so you can test the proxy is alive
app.get('/', (req, res) => {
  res.send(`
    <h1>Simple Proxy is Running! 🚀</h1>
    <p>Try going to: <code>https://your-proxy-url.onrender.com/api/some-endpoint</code></p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
