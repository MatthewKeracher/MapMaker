
import form from "./form.js";
import battleMap from "./battleMap.js";
import load from "./load.js";
import ref from "./ref.js";
import Storyteller from "./storyteller.js";



const Map = {

mapHeight: '',
mapWidth:  '',


async fetchAndProcessImage(url) {
  
//console.log('Receievd URL', url)

// Remove the existing map and its associated elements
const existingMap = document.getElementById('imageContainer');

if (existingMap) {
existingMap.remove();
}

let imageBlob;

if(url){
//console.log('Recieved URL', url)
// Fetch the image from the URL if provided
const response = await fetch(url);
imageBlob = await response.blob();

}else{

// Create an input element for file upload
const inputElement = document.createElement("input");
inputElement.type = "file";


// Listen for the 'change' event on the input element
inputElement.addEventListener("change", async (event) => {
const file = event.target.files[0];

if (file) {
imageBlob = new Blob([file], { type: file.type });
this.processImageBlob(imageBlob);

}
});

// Simulate a click to open the file dialog
inputElement.click();
return; // Exit early as file upload will trigger the rest
}

if (imageBlob) {
  
  this.processImageBlob(imageBlob);
}
},

processImageBlob(imageBlob) {

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

ref.mapContainer.appendChild(imageContainer);

mapElement.onload = () => {
  const canvas = document.createElement('canvas');
  canvas.id = "drawingCanvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  
  // Set canvas dimensions to match the image
  canvas.width = mapElement.width;
  canvas.height = mapElement.height;

  // Append canvas to the container
  imageContainer.appendChild(canvas);

  // Enable pencil tool for drawing on the canvas
  battleMap.enablePencilTool(canvas);
};


if (localStorage.getItem('myData')) {
load.displayLocations(load.Data.locations);
}

},

newMasterLocation(){

  const newId = load.generateUniqueId(load.Data.locations, 'entry')

  const masterLocation = {
    key:'locations',
    image:"https://i.postimg.cc/yNwzct4Y/Aurealm-1.png",
    type: "group",
    subType:"subGroup",
    group: "Default",
    color: "#f4d50b",
    id: newId,
    parentId: newId,
    order: 0,
    name: 'New Master Location', //load.fileName,
    tags: [],
    description: 'This location appears anytime you press the Esc key enough times.',
    }
    
    load.Data.locations.push(masterLocation)

    //Add new Master as parentId on old Master!
    const oldLoc = Storyteller.currentLocationId;
    const oldLocObj = load.Data.locations.find(obj => parseInt(obj.id) === parseInt(oldLoc))
    oldLocObj.parentId = newId;

    Storyteller.changeContent(newId)
    

},


addNewLocation(location) {
//adds Location to load.Data
const rect = location.getBoundingClientRect();

//Ingredients for a Location
console.log(Storyteller.parentLocationId)

const key = "locations";
const type = "group";
const subType = "color";
const group = "Default"; 
const color = "#f4d50b";
const id = load.generateUniqueId(load.Data.locations, 'entry'); 
const parentId = Storyteller.parentLocationId;
const image = "";
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
  parentId,
  image,
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
//form.makeNewObj(locationData, 'subLocations');

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
