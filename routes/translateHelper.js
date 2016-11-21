var translateHelper = {};

var translate = require('@google-cloud/translate')({
  key: ''
});

translateHelper.detectLanguage = function (input, callback) {
  // Detects the language. "input" can be a string for detecting the language of
  // a single piece of text, or an array of strings for detecting the languages
  // of multiple texts.
  translate.detect(input, (err, result) => {
    if (err) {
      callback(err);
      return;
    }

    console.log('Detected: %j', result);
    callback();
  });
}

translateHelper.listLanguages = function (callback) {
  // Lists available translation language with their names in English (the default).
  translate.getLanguages((err, languages) => {
    if (err) {
      callback(err);
      return;
    }

    console.log('Languages:');
    languages.forEach((language) => console.log(language));
    callback();
  });
}

translateHelper.translateText = function (input, target, callback) {
  // Translates the text into the target language. "input" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  translate.translate(input, target, (err, translation) => {
    if (err) {
      callback(err, null);
      console.log(err);
      return;
    }
    callback(null, translation);
  });
}

module.exports = translateHelper