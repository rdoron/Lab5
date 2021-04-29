// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var canvas = document.getElementById("user-image");
const context = canvas.getContext('2d');

img.src='//:0';

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
  
  console.log("now in load event handler\n");
  
   
  context.clearRect(0,0, canvas.width, canvas.height); 

  document.querySelector("[type='submit']").disabled = false; 
  document.querySelector("[type='reset']").disabled = true; 
  document.querySelector("[type='button']").disabled = true; 

  var dict = getDimmensions(canvas.width, canvas.height, img.width, img.height); 

  context.fillStyle = 'black'; 
  context.fillRect(0, 0, canvas.width, canvas.height); 

  context.drawImage(img, dict['startX'], dict['startY'], dict['width'], dict['height']); 

});

document.getElementById("image-input").addEventListener('change', () => {

  console.log("skdjfaskdjfhasdkjfhaskdjf", document.getElementById("image-input"));

  img.src = URL.createObjectURL(document.getElementById("image-input").files[0]); 
  console.log(img.src);
  img.alt = document.getElementById("image-input").files[0]['names'];
  
  console.log("img.alt=", img.alt);

});

document.getElementById("generate-meme").addEventListener('submit', function(event) {

  event.preventDefault();

  let top = document.getElementById("text-top").value; 
  console.log(top);
  let bottom = document.getElementById("text-bottom").value; 
  console.log(bottom);

  context.font = "30px Comic Sans MS";
  context.textAlign = "center"; 
  context.fillStyle = "white";
  context.fillText(top, canvas.width/2, 30); 
  context.fillText(bottom, canvas.width/2, canvas.height - 30); 

  document.querySelector("[type='submit']").disabled = true; 
  document.querySelector("[type='reset']").disabled = false; 
  document.querySelector("[type='button']").disabled = false; 
});

document.querySelector("[type='reset']").addEventListener('click', () => {

  context.clearRect(0,0, canvas.width, canvas.height);

  document.querySelector("[type='submit']").disabled = false; 
  document.querySelector("[type='reset']").disabled = true; 
  document.querySelector("[type='button']").disabled = true; 

});

document.querySelector("[type='button']").addEventListener('click', () => {

  document.getElementById("voice-selection").disabled = false; 

  var voices = [];
  var synth = window.speechSynthesis;
  var voiceSelect = document.querySelector('select');

  let top = document.getElementById("text-top").value; 
  
  let bottom = document.getElementById("text-bottom").value; 

  var topSpeak = new SpeechSynthesisUtterance(top);
  var bottomSpeak = new SpeechSynthesisUtterance(bottom);

  function populateVoiceList() {

    console.log("populateVoicList has been entered"); 

    voices = synth.getVoices();

    for(var i = 0; i < voices.length ; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
  }

  populateVoiceList();

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  document.querySelector("[type='button']").onclick = function(event) {
    event.preventDefault();
    console.log("default has been prevented"); 
  
    

    
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(var i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        topSpeak.voice = voices[i];
        bottomSpeak.voice = voices[i]; 
      }

    }
   

    speechSynthesis.speak(topSpeak);
    speechSynthesis.speak(bottomSpeak);
  
    
  }


});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
