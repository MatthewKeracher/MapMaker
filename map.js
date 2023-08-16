const Map = {

mapElement: document.getElementById('mapElement'),
addMode: false,
isdragging: false,

startX: 0, 
startY: 0,
endX  : 0,
endY  : 0,

previewDiv: '',

locationArray : [],

async fetchAndProcessImage() {
    var imageUrl = "https://i.redd.it/z6m7wtth36y51.png";
    
    // Fetch the image and convert the response to a Blob
    var response = await fetch(imageUrl);
    var imageBlob = await response.blob();
    
    // Do something with the imageBlob, such as displaying it or further processing
    var blobUrl = URL.createObjectURL(imageBlob);
    var mapElement = new Image();
    mapElement.src = blobUrl;
    mapElement.id = "mapElement";

    // Add a class to the <img> element for styling
    mapElement.className = "map-image";

    document.body.appendChild(mapElement);
},



handleMouseDown(e) {
const mapElement = document.getElementById('mapElement');
const rect = mapElement.getBoundingClientRect();

this.isDragging = true;
this.startX = e.clientX - rect.left;
this.startY = e.clientY - rect.top;

// console.log('isDragging: ' + this.isDragging);
// console.log('start: ' + this.startX + ',' + this.startY);

// Create a temporary preview div
this.previewDiv = document.createElement('div');
this.previewDiv.className = 'position-div preview';
document.body.appendChild(this.previewDiv);

},

handleMouseMove(e) {
const mapElement = document.getElementById('mapElement');
const rect = mapElement.getBoundingClientRect();

e.preventDefault();
            
if (this.isDragging) {
    this.endX = e.clientX - rect.left;
    this.endY = e.clientY - rect.top;

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

    // Append the label to the location
    location.appendChild(labelElement);

document.body.appendChild(location);
console.log(left + ',' + top + ' ; ' + width + ',' + height);

this.isDragging = false;
this.previewDiv.remove();
addButton.click();

console.log(location);
console.log(this.getLocation(location));

// this.locationArray.push(this.getLocation(location));

// // Convert the array to JSON string
// const jsonString = JSON.stringify(this.locationArray);
// console.log(jsonString);

}

}, 

getLocation(location) {
    const rect   = location.getBoundingClientRect();
    const left   = parseFloat(location.style.left);
    const top    = parseFloat(location.style.top);
    const width  = parseFloat(location.style.width);
    const height = parseFloat(location.style.height);
    const divId  = location.id;

    return {
        left,
        top,
        width,
        height,
        divId
    };
},




};

export default Map;

