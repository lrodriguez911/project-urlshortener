require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const mySecret = process.env.MONGO_URI;
const dns = require('dns')
const urlParse = require('url')

// Basic Configuration

//connecting to db
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })

const port = process.env.PORT || 3000;

//creqte schema and model in mongoose
const { Schema } = mongoose;

const urlSchema = new Schema({original_url: {type : String, required: true},
short_url : Number })

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

app.post('/api/shorturl', (req, res) => {

let urlForm = req.body.url;
//let numRamdon = Math.floor(Math.random() * 100);

dns.lookup( urlParse.parse(urlForm).hostname, (err, address) =>{

if(!address) return res.json({ error: 'invalid url' });

let url = new Url({original_url : urlForm})

url.save((err, data) => {
if(err) return console.log(err);

console.log(data.original_url, data.id)
  res.json({url: data.original_url, short_url: data.id})
})
})
})

app.get('/api/shorturl/:id', (req, res, next) => {
  let urlId = req.params.id;

    Url.findById(urlId, (err, data) => {
    if(err) return console.log(err);
    if(!data){
      return res.json({ error: 'invalid url' })
    }
    res.redirect(data.original_url)
  }) 
  next();
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
