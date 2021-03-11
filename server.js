// const express = require('express');
// const path = require('path');
// const ngApp = express();
// ngApp.use(express.static('./dist/SEMWEE'));
// ngApp.get('/*', function(request, response) {
//     response.sendFile(path.join(__dirname, '/dist/SEMWEE/index.html'));
// });
// ngApp.listen(process.env.PORT || 8080);
const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);