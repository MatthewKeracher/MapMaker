import Array from "./array.js";

const Add = {

//Add button; adding locations to the map. 

mapElement: document.getElementById('mapElement'),
addMode: false,
isdragging: false,

startX: 0, 
startY: 0,
endX  : 0,
endY  : 0,

previewDiv: '',
    
handleMouseDown(e) {

const mapElement = document.getElementById('mapElement');
const imageContainer = document.querySelector('.image-container');
const rect = mapElement.getBoundingClientRect();    

this.isDragging = true;
this.startX = e.clientX - rect.left;
this.startY = e.clientY - rect.top;

// console.log('isDragging: ' + this.isDragging);
console.log('start: ' + this.endX + ',' + this.endY);

// Create a temporary preview div
this.previewDiv = document.createElement('div');
this.previewDiv.className = 'position-div preview';
       
const firstChild = imageContainer.firstChild;
imageContainer.insertBefore(this.previewDiv,firstChild);

},

handleMouseMove(e) {
const mapElement = document.getElementById('mapElement');
const rect = mapElement.getBoundingClientRect();

// const imageContainer = document.querySelector('.image-container');
// const rect = imageContainer.getBoundingClientRect();

e.preventDefault();

if (this.isDragging) {
    this.endX = e.clientX - rect.left;
    this.endY = e.clientY - rect.top;

    // console.log('start: ' + this.startX + ',' + this.startY)
    // console.log('end: ' + this.endX + ',' + this.endY)

    // Calculate position and size for the preview div
    const left = Math.min(this.startX, this.endX);
    const top = Math.min(this.startY, this.endY);
    const width = Math.abs(this.endX - this.startX);
    const height = Math.abs(this.endY - this.startY);

    // Update styles for the preview div
    this.previewDiv.style.left = left + 'px';
    this.previewDiv.style.top = top + 'px';
    this.previewDiv.style.width = width + 'px';
    this.previewDiv.style.height = height + 'px';

       
}

},

handleMouseUp(e) {

if (this.isDragging) {

// Calculate position and size for the selection div     
const left = Math.min(this.startX, this.endX);
const top = Math.min(this.startY, this.endY);
const width = Math.abs(this.endX - this.startX);
const height = Math.abs(this.endY - this.startY);

// Create and style the selection div
var location = document.createElement('div');
location.className = 'position-div selection';
location.style.left = left + 'px';
location.style.top = top + 'px';
location.style.width = width + 'px';
location.style.height = height + 'px';

    // Prompt the user for input to set the div ID
    const divId = prompt('What is the name of this location?');
    location.id = divId; // Set the ID based on user input 

    // Create a label element for the div ID
    var labelElement = document.createElement('div');
    labelElement.className = 'div-id-label';
    labelElement.textContent = divId;
       

    // Append the label to the location -switch around?
    location.appendChild(labelElement);

const imageContainer = document.querySelector('.image-container');
const firstChild = imageContainer.firstChild;
imageContainer.insertBefore(location,firstChild);


//console.log(left + ',' + top + ' ; ' + width + ',' + height);

// Create an object with the location information
const locationInfo = Array.getLocation(location);

// Add the locationInfo to the locationArray
Array.locationArray.push(locationInfo);
console.log("Adding new entry: " + JSON.stringify(Array.locationArray, null, 2));

this.isDragging = false;
this.previewDiv.remove();
addButton.click();

    
    }

}, 


};

export default Add;
