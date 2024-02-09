import Events from "./events.js";
import Ref from "./ref.js";

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
        document.body.appendChild(imageContainer);}

        this.mapHeight = mapElement.naturalHeight;
        this.mapWidth  = mapElement.naturalWidth;

        

});

// Trigger a click event on the input element to open the file dialog
inputElement.click();
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
