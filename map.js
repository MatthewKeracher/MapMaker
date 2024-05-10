
import form from "./form.js";
import helper from "./helper.js";
import load from "./load.js";
import ref from "./ref.js";
import Storyteller from "./storyteller.js";



const Map = {

mapHeight: '',
mapWidth:  '',

async fetchAndProcessImage() {
// Create an input element for file upload
const inputElement = document.createElement("input");
inputElement.type = "file";

// Listen for the 'change' event on the input element
inputElement.addEventListener("change", async (event) => {
const file = event.target.files[0];

if (file) {

// Remove the existing map and its associated elements
const existingMap = document.getElementById('imageContainer');
if (existingMap) {
existingMap.remove();
}


// Create a Blob from the uploaded file
const imageBlob = new Blob([file], { type: file.type });

// Do something with the imageBlob, such as displaying it or further processing
const blobUrl = URL.createObjectURL(imageBlob);
const mapElement = new Image();
mapElement.src = blobUrl;
mapElement.id = "mapElement";

// Add a class to the <img> element for styling
mapElement.className = "map-image";

// Create a container div for the image
const imageContainer = document.createElement('div');
imageContainer.id = "imageContainer"
imageContainer.className = "image-container";
imageContainer.appendChild(mapElement);

// Add the container to the body
ref.mapContainer.appendChild(imageContainer);
}

this.mapHeight = mapElement.naturalHeight;
this.mapWidth  = mapElement.naturalWidth;


if (localStorage.getItem('myData')) {
load.displayLocations(load.Data.locations);
}

});

// Trigger a click event on the input element to open the file dialog
inputElement.click();



},


addNewLocation(location) {
//adds Location to load.Data
const rect = location.getBoundingClientRect();

//Ingredients for a Location

const key = "locations";
const type = "group";
const subType = "color";
const group = "Default"; 
const color = "#f4d50b";
const id = load.generateUniqueId(load.Data.locations, 'entry'); 
const order = id;
const name = location.name;
const tags = []
const left = parseFloat(location.style.left);
const top = parseFloat(location.style.top);
const width = parseFloat(location.style.width);
const height = parseFloat(location.style.height);
const description = "A general description about this location goes here. Click on this text or click the <span class = 'cyan'> [E]dit </span> button to edit information about <span class = 'cyan'> " + location.name + "</span>.";

const locationData = {key,
  type,
  subType,
  group,
  color,
  id,
  order,
  name,
  tags,
  description,
  left,
  top,
  width,
  height,}

//Add Location to load.Data
load.Data.locations.push(locationData);
//Make Default subLocation and tag to Location.
form.makeNewObj(locationData, 'subLocations');

//Open form to edit location.
form.createForm(locationData);


},

increaseOpacity() {
const locations = document.querySelectorAll('.selection');

locations.forEach((location) => {
const computedStyle = getComputedStyle(location);
const currentOpacity = parseFloat(computedStyle.opacity);
const newOpacity = isNaN(currentOpacity) ? 0.1 : currentOpacity + 0.1;
location.style.opacity = newOpacity;
});
},

decreaseOpacity() {
const locations = document.querySelectorAll('.selection');

locations.forEach((location) => {
const computedStyle = getComputedStyle(location);
const currentOpacity = parseFloat(computedStyle.opacity);
const newOpacity = isNaN(currentOpacity) ? 0.1 : currentOpacity - 0.1;
location.style.opacity = newOpacity;
});
},

};

export default Map;
