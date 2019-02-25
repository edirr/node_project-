const winston = require('winston');

module.exports = function(err, req, res, next){
    //log exception
    // winston.log('error', err.message);
    //Or
    winston.error(err.message, err);

    res.status(500).send("Something failed.");
}