const express = require('express');
const app = express();
const port = 8080;

// Route handling query parameters
app.get('/search', (req, res) => {
  // Access query parameters using req.query
  const { q, category } = req.query;
  res.send(`Search query: ${q}, Category: ${category || 'none'}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});