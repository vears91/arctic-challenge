var express = require('express');
var router = express.Router();
var path = require('path');

/* Set up vision and translation helpers */
var visionHelper = require('./visionHelper');
var translateHelper = require('./translateHelper');
var informationHelper = require('./informationHelper')

/* Set up Firebase */
var firebase = require('firebase');
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: "",
    messagingSenderId: ""
  };
firebase.initializeApp(config);

router.get('/test', function(req, res) {
  informationHelper.getAll(firebase, function() {
    res.json({
      "response": "success"
    });
  });

});

router.get('/signin', function(req, res) {
  res.render('signin', {});
});

router.post('/signin', function(req, res) {
    res.render('error');
});

router.get('/signup', function(req, res) {
  res.render('signup', {});
});

router.post('/signup', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      console.log('The password is too weak.');
    } else {
      console.log(errorMessage);
    }
    console.log(error);
  }).then(function(user) {
    console.log(user);
    res.redirect('/');
  });

});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Skellefteall' });
});

/**
* Landing page for marketing
*/
router.get('/landing', function(req, res) {
  res.render('landing', { title: 'Skellefteall' });
});

/**
* Receive a screencap as base64-encoded data in img_data
*/
router.post('/analyze', function(req, res) {
  var base64Data = req.body.img_data;
  var lang = req.body.lang || "en";
  console.log(lang);
  var buf = new Buffer(base64Data, 'base64');
  visionHelper.detect(buf, function(err, detections) {
    informationHelper.match(firebase, lang, detections, function(err, debugInfo, data, translation) {
        res.json({
          'result': 'success',
          debugInfo: debugInfo,
          data: data,
          translation: translation
        });
    })
  });
});

/**
* Render the page for the client
*/
router.get('/play', function(req, res) {
  lang = req.param('lang') || 'en';
  res.render('play', { title: 'Skellefteall', lang: lang});
});

module.exports = router;
