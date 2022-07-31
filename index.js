require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const mySecret = process.env.MONGO_URI;
// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({extended: false}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/', (req, res, next) => {
res.json({response : 'Hi'})
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
