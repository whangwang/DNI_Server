var express = require('express');
var router = express.Router();
var firebase = require("firebase-admin");
var nodeHtmlToImage = require('node-html-to-image'); 
var ejs = require("ejs");

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

router.get('/genImg', async function(req, res) {
  const HR_MIN = 50
  const TMP_MIN = 35
  const GSR_MIN = 50
  const BO_MIN = 80
  const HR_MAX = 160
  const TMP_MAX = 40
  const GSR_MAX = 800
  const BO_MAX = 100

  const image = await nodeHtmlToImage({
    html: await ejs.renderFile('views/index.ejs', {
      HR: num2Color(req.query.HR, HR_MAX, HR_MIN),
      TMP: num2Color(req.query.TMP, TMP_MAX, TMP_MIN),
      GSR: num2Color(req.query.GSR, GSR_MAX, GSR_MIN),
      BO: num2Color(req.query.BO, BO_MAX, BO_MIN),
      HR_LOC : randomLocation(),
      TMP_LOC : randomLocation(),
      GSR_LOC : randomLocation(),
      BO_LOC : randomLocation(),
    })
  });
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image, 'binary');
})

router.get('/genImgTest', async function(req, res) {
  const HR_MIN = 50
  const TMP_MIN = 35
  const GSR_MIN = 50
  const BO_MIN = 80
  const HR_MAX = 120
  const TMP_MAX = 40
  const GSR_MAX = 800
  const BO_MAX = 100
  res.render('index.ejs', {
    HR: num2Color(req.query.HR, HR_MAX, HR_MIN),
    TMP: num2Color(req.query.TMP, TMP_MAX, TMP_MIN),
    GSR: num2Color(req.query.GSR, GSR_MAX, GSR_MIN),
    BO: num2Color(req.query.BO, BO_MAX, BO_MIN),
    HR_LOC : randomLocation(),
    TMP_LOC : randomLocation(),
    GSR_LOC : randomLocation(),
    BO_LOC : randomLocation(),
  })
})

function num2Color(num, max, min){
  num = Math.max(Math.min(num, max), min)
  var per = (num - min) / (max - min)
  var n = per * 360;
  return `hsl(${parseInt(n)}, 100%, 50%)`
}

function randomLocation(){
  const min = -20
  const max = 20
  return [`${Math.floor(Math.random() * (max - min)) + min}%`, `${Math.floor(Math.random() * (max - min)) + min}%`];
}


module.exports = router;
