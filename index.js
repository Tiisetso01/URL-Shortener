const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const dns = require("dns");
const URL = require("url").URL

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// connecting to the Database (MONGODB)
const mySecret = process.env['MONGO_URI']
mongoose.connect(mySecret, { useNewUrlParser: true}).then(()=>{console.log("connected")}).catch((e)=>{console.log("error",e)})


// Your first API endpoint
let shortUrlSchema = new mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: {type:Number}
})
var newShortUrl = mongoose.model("newShortUrl", shortUrlSchema)

app.post('/api/shorturl', function(req, res) {
  let {url} = req.body;
  
  //check if the URL is valid if not return error
  const urlObj = new URL(url);
 
 
  // check if the URL is valid
  dns.lookup(urlObj.hostname,(err)=>{
    if (err){
      res.json({ error: 'invalid url' })
     
    }else{
      newShortUrl.findOne({}).
        sort({short_url:-1})
        .select('short_url').
        limit(1)
        .exec((err, data) => {
            if(data){
               var short_url = data.short_url + 1
                
            }else{
              
               var short_url = 1
            }
            let newUrl = new newShortUrl({original_url: url, short_url: short_url})
            newUrl.save((error,data)=>{
              console.log(data)
              res.json({original_url: data.original_url,short_url: data.short_url})
            })
        })
   
    }
  })
});
app.get("/api/shorturl/:id", (req, res)=>{
  var {id} = req.params;
  
  newShortUrl.findOne({short_url: id},(err, data)=>{
    if(!(err) && (data)){
       
      res.redirect(data.original_url)
    }else{
      res.json({ error: 'invalid url' })
    }
  });
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
