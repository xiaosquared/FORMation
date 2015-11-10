var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: ' F L A T L A N D' });
});

router.get('/r', function(req, res, next) {
  res.render('remote', { title: 'F L A T L A N D - Remote' });
});

module.exports = router;
