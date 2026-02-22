const express = require('express');
const app = express();
const port = 8080;

// Respond to GET request on the root route
app.get('/', (req, res) => {
  res.send('GET request to the homepage');
});

// Respond to POST request on the root route
app.post('/', (req, res) => {
  res.send('POST request to the homepage');
});

// Respond to GET request on the /about route
app.get('/about', (req, res) => {
  res.send('About page');
});

// Catch all other routes
app.all('*', (req, res) => {

 var  x= Math.floor(Math.random() *1000);


  res.status(404).send('http://127.0.0.1:8080/'+x);
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});