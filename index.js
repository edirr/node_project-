const helmet = require('helmet');
const compression = require('compression');
require("express-async-errors");
const winston = require('winston');
// require('winston-mongodb');
const error = require('./middleware/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const returns = require('./routes/returns');

const express = require('express');
const app = express();

process.on('uncaughtException', (ex)=>{
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on('unhandledRejection', (ex)=>{
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.add(winston.transports.File, { filename: 'logfile.log' });
// winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/node_project' });

// const p = Promise.reject(new Error("BAD BAD FAILED"))

if(!config.get('jwtPrivateKey')){
  throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
}

mongoose.connect(config.get('db'))   
  .then(() => winston.info(`Connected to ${config.get('db')}...`))

// mongoose.connect('mongodb://localhost/node_project', { useNewUrlParser: true})   
//   .then(() => winston.info('Connected to MongoDB...'))
  

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/returns', returns);

app.use(error);
app.use(helmet());
app.use(compression());

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;