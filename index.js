const Joi = require('joi');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/genres', genres);
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

