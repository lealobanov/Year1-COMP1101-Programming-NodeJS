//Run server

const app = require('./app');
var port = process.env.PORT || 8090;
app.listen(port);
console.log('Listening on port 8090...');
 
