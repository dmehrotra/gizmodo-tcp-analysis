var promise = require('bluebird');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(process.argv[2])
});
var ips={}

function readLine(){
    return new Promise(function(resolve,reject){
		lineReader.on('line', function (line) {
			try{
				device = line.split('>')[0].split('IP')[1].trim().split('.')
				if (device.length == 5){
					device.splice(-1,1)
				}
				device = device.join('.')
				dst = line.split('>')[1].split(':')[0].trim().split('.')
				if (dst.length == 5){
					dst.splice(-1,1)
				}
				dst = dst.join('.')
				
				length = line.split("length")[1]
				time = line.split("IP")[0]
				time = new Date(time)

				if (dst != process.argv[3]){
					if(!ips.hasOwnProperty(dst)){
						if(isNaN(parseInt(length))){length=0}
						ips[dst] = {"count":1,"bytes":parseInt(length),"times":[{"ts":time,"device":device}]};

					}else{
						if(isNaN(parseInt(length))){length=0}
						ips[dst].count++
						
						ips[dst].bytes = ips[dst].bytes + parseInt(length)
						ips[dst].times.push({"ts":time,"device":device})
					}
				}
			}catch(err){}
		});
		lineReader.on('close', function() {
        	resolve(ips)
    	});
  	})
}


readLine().then(function(v){
	
	console.log(JSON.stringify(v))
})

  // whois.lookup('31.13.71.3', function(err, data) {
  // 	eval(require('locus'))
  // })