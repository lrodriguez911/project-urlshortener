require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const mySecret = process.env.MONGO_URI;
const mongoose = require('mongoose')
const dns = require('dns')
const urlPars = require('url')


// Basic Configuration
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })

const { Schema } = mongoose;
const urlSchema = new Schema({
  original_url :{type: String},
  short_url : Number
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
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let urlForm  = req.body.url;
  
  dns.lookup(urlPars.parse(urlForm).hostname , 
    (err, address) => {
    if(!address) return res.json({error : 'invalid url'});
      
    const url = new Url({original_url : urlForm})
      
    url.save((err, data)=> {
    if(err) return console.log(err);
      console.log(data.original_url, data.id)
    res.json({original_url : data.original_url, short_url: data.id})
      
  })
  })

})
app.get('/api/shorturl/:id', (req,res) => {
  
  const urlId = req.params.id;
  
  Url.findById(urlId, (err, data) => {
    
    if(!urlId){
      res.send({ error: 'invalid url' })
    }
    res.redirect(data.original_url)
  })
  
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
