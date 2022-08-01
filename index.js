require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const mySecret = process.env.MONGO_URI;
const mongoose = require('mongoose')
const dns = require('dns')


// Basic Configuration
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })

const { Schema } = mongoose;
const urlSchema = new Schema({
  url:{type: String},
  shortUrl: Number
})
const Url = mongoose.model('Url', urlSchema)
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  //await Character.create({ name: 'Jean-Luc Picard' })
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  
  let urlForm  = req.body.url;
  let numRandom = Math.floor(Math.random() * 100);
  let url = new Url({url : urlForm, shortUrl : numRandom})
  console.log(dns.lookup(urlForm, cb))
  try {
    await url.save((err, data)=> {
    if(err) return console.log(err);
      
    res.json({url : `${urlForm}`, shortUrl: `${numRandom}`})
  })
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
