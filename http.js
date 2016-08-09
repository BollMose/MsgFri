//Lets require/import the HTTP module
var express = require('express');
var app = express();
//var http = require('http');
//var py = require('python-shell');
var bodyParser = require("body-parser");

// static files, such as js/html/css
app.use(express.static('public'));
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
  
// const
const PORT=8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connection URL
var DBURL = 'mongodb://localhost:27017/msgfri';


// Use connect method to connect to the Server
MongoClient.connect(DBURL, function(err, db) {
  	assert.equal(null, err);
  	console.log("Connected correctly to server");
  	findDocuments(db, function(docs) { db.close(); });
});

function index(request, response){
	var fs = require('fs');
	var path = require('path');
	var filePath = path.join(__dirname, "public/index.html");
    
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
		if (!err){
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(data);
			response.end();
		}else{
			console.log(err);
		}
	});
}


var findDocuments = function(db, callback) {
	var collection = db.collection('msg');
	collection.find({}).toArray(function(err, docs) {
    	assert.equal(err, null);
    	console.log("Found the following records");
    	console.dir(docs);
    	callback(docs);
    });
}


var insertDocuments = function(db, req, callback) {
  	// Get the documents collection
 	var collection = db.collection('msg');
  	// Insert some documents
  	collection.insertMany([req.body], function(err, result) {
    	assert.equal(err, null);
    	callback(result);
  });
}

app.get('/', function(req, res){
	index(req, res);
});

// we do not use get
app.get('/feed', function(req,res){
	console.log(req.query);
	
	MongoClient.connect(DBURL, function(err, db) {
	  	assert.equal(null, err);
	  	findDocuments(db, function(docs) {
			db.close();
			res.type('application/json');
			res.write(JSON.stringify({"msgs":docs}));
			res.end();
	   	});
	});
});

app.post('/feed', function(req,res){
	console.log(req.body);
	
	MongoClient.connect(DBURL, function(err, db) {
	  	assert.equal(null, err);
	  	insertDocuments(db, req, function(docs) {
			db.close();
			res.type('application/json');
			res.write(JSON.stringify({"event": "success"}));
			res.end();
	   	});
	});
});


app.listen(PORT);
