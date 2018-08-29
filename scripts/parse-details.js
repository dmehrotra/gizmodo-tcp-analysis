var _ = require('underscore')
var promise = require('bluebird')
var fs = require('fs');
var rawtcp = fs.readFileSync(process.argv[2]);
var tcpflow= JSON.parse(rawtcp)
var stringify = require('csv-stringify');
var ips = _.keys(tcpflow)
var whois = require('whois')
var whoDis= {}
let data = {
  "rows": [
    [ "device",
      "ip",
      "timestamp",
      "host"
    ]
  ]
}
function lookup(net,ip){
	return new Promise(function(resolve,reject){
		console.log('looking up: '+ip)
		
		whois.lookup(ip, function(err, data) {
			if (err){
				console.log(ip)
				console.log(err)
			}

			try{
				org = data.split("Organization:")[1].split("\n")[0].trim()
				whoDis[net]=org
				resolve(org)
			}catch(error){
				try{
					org = data.split("Company:")[1].split("\n")[0].trim()
					whoDis[net]=org
					resolve(org)
				}catch(error){
					try{
						org = data.split("descr:")[1].split("\n")[0].trim()
						whoDis[net]=org
						resolve(org)
					}catch(err){
						whoDis[net]=ip		
						resolve(ip)
					}
				
				}

			}

		})

	})
}
function subnet(ip){
	net = ip.split('.')
	net.splice(-3,3)
	net = net.join('.')
	return net
}
function whoDat(ips){
    var promises = _.map(ips, function(ip) {
    	return new Promise(function(resolve,reject){
    		net = subnet(ip)
			if(!whoDis.hasOwnProperty(net)){
				whoDis[net]="pending"
				lookup(net,ip).then(function(org){
					resolve(org)
				})
			}else{
				resolve('cool')
			}

		})
	})
	return Promise.all(promises);
}
function associate(){
	promises =[]
	for (var key in tcpflow) {
		promises.push(
			new Promise(function(resolve,reject){
				sn=subnet(key)
				tcpflow[key].host=whoDis[sn]
				resolve(key)	
			})
		)
	}
	return Promise.all(promises);
}

function buildCSV(){
	promises =[]
	for (var key in tcpflow) {
		promises.push(
			new Promise(function(resolve,reject){
				tcpflow[key].times.forEach(function(time){
    				row=[time["device"],key,time["ts"],tcpflow[key].host]
    				data.rows.push(row)
    				resolve(row)
  				})
			})
		)
	}
	return Promise.all(promises);
}


whoDat(ips).then(function(known){
	associate().then(function(x){
		buildCSV().then(function(c){
			setTimeout(function(args) {
				stringify(data.rows, function(err, output) {
				  fn = process.argv[2].split('/')
				  fn = fn[fn.length-1].split('.pcap')[0]
				  fs.writeFile('../../data/csv/'+fn+'.csv', output, 'utf8', function(err) {
				    if (err) {
				      console.log('Some error occured - file either not saved or corrupted file saved.');
				    } else {
				      console.log('It\'s saved!');
				    }
			 	 });
				})
			},5000)


		})
	})

})


