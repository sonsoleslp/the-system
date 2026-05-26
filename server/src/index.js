/************** DO NOT TOUCH  /**************/
const express = require("express");
const { PrismaClient } = require("@prisma/client");

// Import routers
const usersRouter = require('./routes/users');
const { virusesRouter, virusSearchRouter } = require('./routes/viruses');
const trialsRouter = require('./routes/trials');

const prisma = new PrismaClient();
const app = express();


app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Serve dashboard from /dashboard path
app.use('/dashboard', express.static('public/dashboard'));


// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  res.removeHeader('X-Frame-Options');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://escapp.es"
  );
  next();
});




app.get("/", (req, res) => {
  res.send(atob('PGh0bWw+PGJvZHk+PGgxPlNlcnZlciBVcC4gSW5zZXJ0IHBvcnQgbnVtYmVyIGluIGxhYiBzY3JlZW4gdG8gY29tcGxldGUgY29ubmVjdGlvbi48L2gxPjwvYm9keT48L2h0bWw+'));
});

// Use routers
app.use('/users', usersRouter);
app.use('/viruses', virusesRouter);
app.use('/virus', virusSearchRouter);
app.use('/trials', trialsRouter);

// Handle client-side routing for dashboard (SPA fallback)
app.get('/dashboard/*', (req, res) => {
  res.sendFile('dashboard/index.html', { root: 'public' });
});

app.listen(parseInt(btoa('çÏ|')), () => {
  console.log(atob('U2VydmVyIHJ1bm5pbmcgaW4gbG9jYWxob3N0OjU4OTg='));
});
