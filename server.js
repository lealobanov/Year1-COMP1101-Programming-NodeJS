//Run server

const app = require('./app');
let port = process.env.PORT || 8090;
app.listen(port);
console.log('Listening on port 8090...');
 
