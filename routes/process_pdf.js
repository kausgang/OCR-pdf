const path = require('path');
const pdf = require('pdf-poppler');



var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {
  

  var file = req.query.pdf;

  // https://npmjs.com/package/express-fileupload

  console.log(file);

});

module.exports = router;
