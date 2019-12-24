// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
var classifier;

// A variable to hold the image we want to classify
var video = document.querySelector("#videoElement");

var labels = [];

function preload() {
  var modelname = "";
  while (modelname == "") {
    var choice = prompt("Model select:");
    if (choice == "headturn") {
      classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/bcpXKtPU/model.json', video);
      modelname = "Head Turn";
    } else if (choice == "meandphone") {
      classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/ZvelKXOF/model.json', video);
      modelname = "Me And My Phone";
    } else if (choice == "mobilenet") {
      classifier = ml5.imageClassifier('MobileNet', video);
      modelname = "MobileNet";
    } else if (choice == "doodlenet") {
      classifier = ml5.imageClassifier('DoodleNet', video);
      modelname = "DoodleNet";
    } else if (choice == "darknet") {
      classifier = ml5.imageClassifier('Darknet', video);
      modelname = "DarkNet";
    } else {
      alert("Invalid model.");
    }
  }
  document.getElementById('model').innerHTML = ("Model: " + modelname);
  onload();
}

function setup() {
  classifier.classify(gotResult);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  } else {
    // The results are in an array ordered by confidence.
    console.log(results);
    displayResult(results);
  }
}

function displayResult(results) {
  //Create
  if (results[0].label != labels[labels.length - 1].innerHTML) {
    var newlabel = document.createElement("p");
    newlabel.classList = "labels hide-b";
    newlabel.innerHTML = results[0].label;
    labels.push(newlabel);
    document.getElementById('labels-cont').appendChild(newlabel);
    //Display
    setTimeout(function () {
      labels[labels.length - 2].classList = "labels hide-t";
      labels[labels.length - 1].classList = "labels";
      
      //Confidence
      document.getElementById('conf').innerHTML = nf(results[0].confidence*100, 0, 1) + "% confidence";
      document.getElementById('conf').style = ("color: hsl(" + nf(results[0].confidence*100, 0, 1) + ", 100%, 50%); text-shadow: hsl(" + nf(results[0].confidence*100, 0, 1) + ", 100%, 50%) 0px 0px 5px;");

      //Remove old
      setTimeout(function () {
        document.getElementById('labels-cont').removeChild(labels[0]);
        labels.shift();
      }, 300);
    }, 300);
  } else {
    //Only update confidence
    document.getElementById('conf').innerHTML = nf(results[0].confidence*100, 0, 1) + "% confidence";
    document.getElementById('conf').style = ("color: hsl(" + nf(results[0].confidence*100, 0, 1) + ", 100%, 50%); text-shadow: hsl(" + nf(results[0].confidence*100, 0, 1) + ", 100%, 50%) 0px 0px 5px;");
  }
}

function onload() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: true
      })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  var newlabel = document.createElement("p");
  newlabel.classList = "labels";
  newlabel.innerHTML = "...";
  labels.push(newlabel);
  document.getElementById('labels-cont').appendChild(newlabel);

  setInterval(function () {
    classifier.classify(gotResult);
  }, 1000);
}