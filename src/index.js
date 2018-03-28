import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

Promise = require('bluebird');

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(
	cors({
		exposedHeaders: config.corsHeaders
	})
);

app.use(
	bodyParser.json({
		limit: config.bodyLimit
	})
);

// Mongoose
var mongoDB =
	'mongodb://pediu-backend:senhadobackend@ds121189.mlab.com:21189/pediu-chegou';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

initializeDb(db => {
	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
