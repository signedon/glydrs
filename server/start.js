var forever = require('forever');

var child = new (forever.Monitor)(__dirname + '/app.js', {
  'silent': false,
  'options': [],
  'watch': true,
  'watchDirectory': __dirname + '/',
  'killTree': true,
  'logFile': __dirname + '/logs/forever.log',
  //'outFile': __dirname + '/logs/forever.stdout.log',
  'errFile': __dirname + '/logs/forever.stderr.log',
});

//child.on('exit', function(){});
child.start();
