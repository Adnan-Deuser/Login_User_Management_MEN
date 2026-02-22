const express = require('express');
const app = express();
const port = 8080;

// Route with parameters
app.get('/users/:userId/books/:bookId', (req, res) => {
  // Access parameters using req.params
  res.send(`User ID: ${req.params.userId}, Book ID: ${req.params.bookId}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});