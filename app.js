/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var watson = require('watson-developer-cloud');
var fs = require('fs');
var visualRecognition = watson.visual_recognition({
  version: 'v2-beta',
  username: '', //copy-paste from environmental variables of your buemix application
  password: '', //copy-paste from environmental variables of your buemix application
  version_date:'2015-12-02'
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

//start main program
app.get('/',routes.index);

var ck;
var im;

app.post('/', multer({ dest: './public/uploads/'}).single('upl'), function(req,res){
  var pt=req.file.destination+req.file.filename;
  im = "../uploads/"+req.file.filename+".jpg";
  //console.log(req.file);
  fs.rename(pt,pt+".jpg");
  ck=pt+".jpg";

  var ht="<html style='width=100%; height:100%;'><body background='../images/bg.jpg' style='background-size:100% 100%;'><center><img src='../uploads/"+im+"' width='400' height='300'/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<u><a href='/table' target='_blank'>Classifier data--Table</a></u>";
  ht=ht+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u><a href='/json' target='_blank'>Classifier data--JSON</a></u>";
  ht=ht+"<br/><br/>&nbsp;<u><a href='/' target='_self'>Click here to upload different image</a></u></center></body></html>";
  res.write(ht);
  //res.status(204).end();
});

app.get('/json',function(req,res){
  var readStream=fs.createReadStream(ck);
  var params = { images_file: readStream};
  visualRecognition.classify(params,
    function(err, response) {
      if (err)
         console.log(err);
      else{
         var result=JSON.stringify(response, null, 2);
         //console.lo=g(result);
         res.write(result);
       }
     });

   });



app.get('/table',function(req,res){
  var readStream=fs.createReadStream(ck);
  var params = { images_file: readStream};
  visualRecognition.classify(params,
   function(err, response) {
        if (err)
           console.log(err);
        else{
          var obj=response.images[0].scores;
          var names="<html><p>";
          var string = "<style>table{border-collapse: collapse;}th,td{text-align: left;padding: 1px;}tr:nth-child(even){background-color: #f2f2f2}th{background-color: #4CAF50;color: white;}</style>";
          string=string+"<table id='result' border='1' width='100' height='200'><tr><th>Name</th><th>Confidence Score</th></tr>";
          for( var i in obj){
            string = string +
            "<tr><td>" + response.images[0].scores[i].name+
            "</td><td>" + response.images[0].scores[i].score+
            "</td></tr>";
          }
        string = string + "</table>";
        res.write(string);
       }
   });
});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});
