import load from "./load.js";
import map from "./map.js";
import Storyteller from "./storyteller.js";
import helper from "./helper.js";
import ref from "./ref.js";

const Add = {

//Add button; adding locations to the map. 

mapElement: document.getElementById('mapElement'),
addMode: false,
isDragging: false,
moveMode: false,
moveObj: [],

startX: 0, 
startY: 0,
endX  : 0,
endY  : 0,

previewDiv: '',

//Need to change from a dragging system to a two-click system.

reDrawLocation(location){

Add.moveMode = true
Add.moveObj = location

// Add the event listeners next time click on Map
ref.mapContainer.addEventListener('click',() => {
    mapElement.addEventListener('mousedown', Add.handleMouseDown);
    mapElement.addEventListener('mousemove', Add.handleMouseMove);   
    ref.mainToolbar.style.pointerEvents = 'none';
    ref.locationDivs.forEach((selection) => {
    selection.style.pointerEvents = 'none';
    });
})


},

handleMouseDown(e) {

// check if isDragging is true.
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

//Adding a New Location
if(Add.addMode){

helper.showPrompt('What is the name of the location?', 'input');
this.isDragging = false;
ref.promptBox.focus();

helper.handleConfirm = function(newLocationName, promptBox) {
if (newLocationName !== null) {
location.name = newLocationName; // Set the ID based on user input 

var labelElement = document.createElement('div');
labelElement.textContent = newLocationName;

// Hide the prompt box
promptBox.style.display = 'none';

// Create a label element for the div ID
var labelElement = document.createElement('div');
labelElement.className = 'div-name-label';
labelElement.textContent = name;

location.appendChild(labelElement);

const imageContainer = document.querySelector('.image-container');
const firstChild = imageContainer.firstChild;
imageContainer.insertBefore(location,firstChild);

load.addLocationEvents();
map.addNewLocation(location);
load.displayLocations(load.Data.locations);

//Open new Location in Storyteller
const locations = document.querySelectorAll('.selection');

// Convert NodeList to an array using Array.from() or spread operator
const locationsArray = Array.from(locations);

// Filter the locations to find the one with the specific ID
const thisLoc = locationsArray.find(loc => loc.name === location.name);
Storyteller.changeContent(thisLoc.id);

} else {
// User cancelled
console.log('User cancelled');
// Hide the prompt box
promptBox.style.display = 'none';
}
};

//Close Function
this.previewDiv.remove();
addButton.click();

}

//Moving a Location
else if(Add.moveMode = true){

this.isDragging = false;

const newPoints = {left: left, top: top, width: width, height: height}

const locId = Add.moveObj.getAttribute('id');
const locObj = load.Data.locations.find(entry => parseInt(entry.id) === parseInt(locId));
const toChange = ['left', 'top', 'width', 'height']

toChange.forEach(variable =>{
console.log(locObj, variable)
locObj[variable] = newPoints[variable]

});

mapElement.removeEventListener('mousedown', Add.handleMouseDown);
mapElement.removeEventListener('mousemove', Add.handleMouseMove);
ref.mainToolbar.style.pointerEvents = 'auto';
ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'auto';
});


load.displayLocations(load.Data.locations)

}

}else{

const mapElement = document.getElementById('mapElement');
const imageContainer = document.querySelector('.image-container');
const rect = mapElement.getBoundingClientRect();    

this.isDragging = true;
this.startX = e.clientX - rect.left;
this.startY = e.clientY - rect.top;

//console.log('isDragging: ' + this.isDragging);
//console.log('start: ' + this.endX + ',' + this.endY);

// Create a temporary preview div
this.previewDiv = document.createElement('div');
this.previewDiv.className = 'position-div preview';

const firstChild = imageContainer.firstChild;
imageContainer.insertBefore(this.previewDiv,firstChild);

}

},

handleMouseMove(e) {
const mapElement = document.getElementById('mapElement');
const rect = mapElement.getBoundingClientRect();

e.preventDefault();

if (this.isDragging) {
this.endX = e.clientX - rect.left;
this.endY = e.clientY - rect.top;

//console.log('start: ' + this.startX + ',' + this.startY)
//console.log('end: ' + this.endX + ',' + this.endY)

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


}

};

export default Add;
