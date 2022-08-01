require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const mySecret = process.env.MONGO_URI

// Basic Configuration
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })

const port = process.env.PORT || 3000;

const { Schema } = mongoose;

const urlSchema = new Schema({url: {type : String, required: true},
shortUrl : Number })

const Url = new mongoose.model('Url', urlSchema);



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

/* app.post('/api/shorturl/', async (req, res, next) => {
const urlForm = req.body.url;
const url = new Url({url : urlForm, shortUrl: Math.floor(Math.random() * 100)})

try {
  url.save((err, data) => {
    if(err) return console.log(err);
    res.json({url: urlForm, shortUrl})
  })
} catch (error) {
console.log(error)
} 
next()
}) */
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
