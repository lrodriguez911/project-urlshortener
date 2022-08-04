require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const mySecret = process.env.MONGO_URI
const dns = require('node:dns')

// Basic Configuration

//connecting to db
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true })

const port = process.env.PORT || 3000;

//creqte schema and model in mongoose
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

app.post('/api/shorturl', (req, res) => {

let urlForm = req.body.url;
let numRamdon = Math.floor(Math.random() * 100);
let url = new Url({url : urlForm})

url.find({url: urlForm}, (err,data) => {
  if(err) return console.log(err);
  console.log(data)
}) 

dns.lookup(urlForm, (err, address, family) =>{
if(err) return console.log(err);
console.log('address: %j family: IPv%s', address, family)}
)



 url.save((err, data) => {
    if(err) return console.log(err);
  console.log(data.url, data.id)
    res.json({url: data.url, shortUrl: data.id})
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
