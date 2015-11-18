var express = require('express');
var router = express.Router();

var options = {
  root: __dirname + '/../public/',
  dotfiles: 'deny',
  headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
  }
};

/* GET home page. */
router.get('/c', function(req, res, next) {
  res.sendFile('cooperform.html',options, function(err){
    if (err) res.status(err.status).end();
  });
});

router.get('/t', function(req, res, next) {
  res.sendFile('transform.html',options, function(err){
    if (err) res.status(err.status).end();
  });
});

router.get('/p', function(req, res, next) {
  res.sendFile('polyform.html',options, function(err){
    if (err) res.status(err.status).end();
  });
});

module.exports = router;
