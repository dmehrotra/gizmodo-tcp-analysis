var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
var bodyParser = require('body-parser');
var multer = require('multer');
var shell = require('shelljs');
var basicAuth = require('basic-auth-connect');

app.set('view engine', 'pug');
app.use('/data', express.static(__dirname + '/data'));
app.use('/js', express.static(__dirname + '/js'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(basicAuth('username', 'password'));


function getFiles(type){
	if (type == "csv"){
		csv = []
		return new Promise(function(resolve,reject){
			fs.readdir("data/csv", function(err, files) {
			    for (var i=0; i<files.length; i++) {
			        console.log(files[i])
			        try{
			        	f = files[i].split('trace-')[1].split('.csv')[0]
			        	csv.push(f)
			        }catch(err){
			        	
			        }

			    }
			    resolve(csv)
			});
			
		})
	}else{
		tcp = []
		return new Promise(function(resolve,reject){
			fs.readdir("data/tcp", function(err, files) {
			    for (var i=0; i<files.length; i++) {
			        console.log(files[i])
			        try{
			        	f = files[i].split('trace-')[1].split('.pcap')[0]
			        	tcp.push(f)

			        }catch(err){
			        	
			        }

			    }
			    resolve(tcp)
			});
			
		})
	}

}
app.get('/', function (req, res) {

	getFiles("csv").then(function(csv_data){
		csv = csv_data
		getFiles("tcp").then(function(tcp_d){
			tcp = tcp_d
			res.render('index', { csv: csv, tcp: tcp })
		})
	})
  
})
app.get('/:file_name', function (req, res) {
	
	res.render('graph', { data: "data/csv/trace-"+req.params.file_name+".csv" })
	
  
})
app.post('/experiment', function (req, res) {
	shell.exec('./scripts/util/tcpdump.sh en0 '+req.body.seconds+' '+req.body.file_name)

	getFiles().then(function(data){
		res.render('index', { data: data })
	})
	
  
})

app.listen(8080);
