var cp = require("child_process"),
         express = require("express"),
         app = express();
app.use(express.static(__dirname));


totals = {}
totals.google = 102124;
totals.amazon=292948;
totals.facebook=15583;
totals.microsoft=0;
totals.apple=0;
sess = {}
sess.google_session = 0;
sess.amazon_session=0;
sess.facebook_session=0;
sess.apple_session=0;
sess.microsoft_session=0;
var spw1 = cp.spawn('tail',['-f','/var/log/syslog'])

var str = "";
spw1.stdout.on('data', function (data) {
    str += data.toString();
    // just so we can see the server is doing something
    // Flush out line by line.

    var lines = str.split("\n");
  for(var i in lines) {
    if(i == lines.length - 1) {
              str = lines[i];
     } else{
        if (lines[i].indexOf('Blocking') != -1){
          if (lines[i].indexOf('Amazon') != -1){
            totals.amazon=totals.amazon+1
            sess.amazon_session=sess.amazon_session+1;
          }
          if (lines[i].indexOf('FACEBOOK') != -1) {
            totals.facebook=totals.facebook+1;
            sess.facebook_session=sess.facebook_session+1;
          }
          if (lines[i].indexOf('GOOGLE') != -1){
            totals.google=totals.google+1
            sess.google_session = sess.google_session+1;
          }
          if (lines[i].indexOf('APPLE') != -1) {
            totals.apple=totals.apple+1
            sess.apple_session=sess.apple_session+1;
          }
          if (lines[i].indexOf('MICROSOFT') != -1) {
            totals.apple=totals.microsoft+1
            sess.apple_session=sess.microsoft_session+1;
          }

        }

  }
    }
})



app.get('/msg', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });

    sess.google_session = 0;
    sess.amazon_session=0;
    sess.facebook_session=0;
    sess.apple_session=0;
   var intervalID = setInterval(function(){
    console.log(totals)
    res.write('data: ' + JSON.stringify(totals) + "\n\n");
    res.write('data: ' + JSON.stringify(sess) + "\n\n");

}, 500);




    spw1.on('close', function (code) {
        res.end(str);
    });

    spw1.stderr.on('data', function (data) {
        res.end('stderr: ' + data);
    });
});

app.listen(4000);