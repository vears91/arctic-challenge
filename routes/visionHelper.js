var visionHelper = {};

var path = require('path');
var vision = require('@google-cloud/vision')({
  projectId: 'ltu-hackaton',
  keyFilename: path.join(__dirname, 'ltu-hackaton-e083d19432a2.json')
});

/* Define the types to detect using the vision API */ 
const types = ['landmarks', 'logos', 'text', 'labels', 'properties']

visionHelper.detectLabels = function (inputFile, callback) {
  // Make a call to the Vision API to detect the labels
  console.log("call detectLabels");
  vision.detectLabels(inputFile, { verbose: true }, function (err, labels) {
    if (err) {
      return callback(err);
    }
    console.log('result:', JSON.stringify(labels, null, 2));
    callback(null, labels);
  });
}

/* Detect all the types defined in the types array */
visionHelper.detect = function (fileName, callback) {
  vision.detect(fileName, types, function(err, detections, apiResponse) {
    if (err) {
      console.log(err);
      console.log(err.errors)
      callback(err, {})
    } else {
    	console.log(detections);
    	callback(null, detections);
    }
  });
}

module.exports = visionHelper;
