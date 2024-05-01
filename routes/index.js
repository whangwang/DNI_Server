var express = require('express');
var router = express.Router();
var firebase = require("firebase-admin");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res) {
  var db = firebase.database();
  var ref = db.ref(req.query.mac);
  ref.once('value', function(snapshot){
    var result = snapshot.val();
    res.status(200).json({
      status: true,
      message: "success",
      data: result
    })
  })
})

router.post('/test', function(req, res) {
  var db = firebase.database();
  var ref = db.ref("/");
  ref.once('value', function(snapshot){
    var ref2 = db.ref("/");
    ref2.set(Object.assign({}, snapshot.val(), req.body)).then(() => {
      res.status(200).json({
        status: true,
        message: "updated"
      })
    })
  })
})
module.exports = router;
