const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const photoPath = path.join(__dirname, 'סודוקו, תה ופרחי בר באור שמש (2).png');

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Photo Gallery</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      padding: 48px 20px;
      color: #23332b;
      background: #f5f3ed;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main { width: min(100%, 960px); margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: clamp(2rem, 5vw, 3.25rem); }
    .intro { margin: 0 0 28px; color: #65746a; }
    figure {
      margin: 0;
      overflow: hidden;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 14px 40px rgb(35 51 43 / 12%);
    }
    figure img { display: block; width: 100%; height: auto; }
    figcaption { padding: 14px 18px; color: #65746a; font-size: 0.95rem; }
  </style>
</head>
<body>
  <main>
    <h1>Photo Gallery</h1>
    <p class="intro">A little collection of things worth slowing down for.</p>
    <figure>
      <img src="/photo.png" alt="Sudoku, tea, and wildflowers in the sunlight" loading="lazy">
      <figcaption>A quiet moment with sudoku, tea, and wildflowers.</figcaption>
    </figure>
  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method not allowed');
  }

  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(req.method === 'HEAD' ? undefined : page);
  }

  if (pathname === '/photo.png') {
    res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
    if (req.method === 'HEAD') return res.end();
    const image = fs.createReadStream(photoPath);
    image.on('error', () => {
      if (!res.headersSent) res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Photo not found');
    });
    return image.pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
