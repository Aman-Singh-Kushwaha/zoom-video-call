const express = require('express');
const app = express();
const server = require('http').Server(app);

const ROUTES = require("./routes");

//add static files
app.use(express.static(__dirname + '/views'));

//set view engine
app.set('view engine', 'ejs');

// Routes
app.use(ROUTES);

const PORT = 3000; 
server.listen(PORT);