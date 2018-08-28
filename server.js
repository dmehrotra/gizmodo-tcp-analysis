var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var Promise = require('bluebird')
app.set('view engine', 'pug')
app.use('/data', express.static(__dirname + '/data'));
app.use('/js', express.static(__dirname + '/js'));

function getFiles(){
	csv = []
	return new Promise(function(resolve,reject){
		fs.readdir("data/csv", function(err, files) {
		    for (var i=0; i<files.length; i++) {
		        console.log(files[i])
		        f = files[i].split('trace-')[1].split('.csv')[0]
		        csv.push(f)
		    }
		    resolve(csv)
		});
		
	})
}
app.get('/', function (req, res) {

	getFiles().then(function(data){
		res.render('index', { data: data })
	})
  
})
app.get('/:date', function (req, res) {

	
	res.render('graph', { data: "data/csv/trace-"+req.params.date+".csv" })
	
  
})

app.listen(8080);
