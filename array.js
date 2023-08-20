import Edit from "./edit.js";
import Storyteller from "./storyteller.js";

const Array = {
locationArray: [],

//If there are problems with the load dialog freezing, try deleting unneccesary .json files in downloads folder.

//For Saving...

addNewLocation(location) {
const rect = location.getBoundingClientRect();
const left = parseFloat(location.style.left);
const top = parseFloat(location.style.top);
const width = parseFloat(location.style.width);
const height = parseFloat(location.style.height);
const divId = location.id;
const player = "";
const gm = "";
const misc = "";

return {
left,
top,
width,
height,
divId,
player,
gm,
misc,
};
},

saveFile(content, filename, mimeType) {
const blob = new Blob([content], { type: mimeType });
saveAs(blob, filename);
},

exportArray() {
const json = JSON.stringify(this.locationArray, null, 2);
const mimeType = 'application/json';

// Prompt the user to enter a filename
const filename = prompt('Enter the filename for the JSON file:', 'default.json');

if (filename) {
        // Call the function to save the JSON string as a file
        this.saveFile(json, filename, mimeType);
} else {
        console.log('Filename not provided, file not saved.');
}
},  

handleFileSave(event, blob, blobUrl) {
const file = event.target.files[0];
if (file) {
// Create an anchor element for the download link
const downloadLink = document.createElement('a');
downloadLink.href = blobUrl;

// Set the filename for the download
downloadLink.download = file.name; // Use the chosen filename

// Programmatically trigger a click event on the anchor element to start the download
downloadLink.click();

// Clean up: remove the anchor element and revoke the Blob URL
downloadLink.remove();
URL.revokeObjectURL(blobUrl);
}

// Clean up: remove the file input element
event.target.remove();
},

downloadImage(filename) {
const mapElement = document.getElementById('mapElement'); // Get the map element
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to match the image dimensions
canvas.width = mapElement.width;
canvas.height = mapElement.height;

// Draw the image onto the canvas
ctx.drawImage(mapElement, 0, 0);

// Convert the canvas content to a data URL (imageDataUrl)
const imageDataUrl = canvas.toDataURL();

// Create a download link for the image
const imageLink = document.createElement('a');
imageLink.href = imageDataUrl;
imageLink.download = filename || 'image.png'; // Specify the desired image filename
imageLink.textContent = 'Download Image';

// Append the image download link to the body
document.body.appendChild(imageLink);

// Programmatically trigger a click event on the image link to start the download
imageLink.click();

// Remove the image download link after the download is initiated
imageLink.remove();
},

//For Loading...

handleFileInputChange: (event) => {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (e) => Array.handleFileLoad(e.target.result);
reader.readAsText(file);
}
},  

handleFileLoad(fileContent) {
try {
        const data = JSON.parse(fileContent);
        this.displayLoadedLocationsOnMap(data);
} catch (error) {
        console.error('Error loading file:', error);
}
},

        displayLoadedLocationsOnMap(data) {
        //  // Clear the existing content
        // imageContainer.innerHTML = '';

        // Add the loaded locations to the map and the array
        data.forEach((locationData) => {
        const newLoc = this.addSaveLocation(locationData);

        const imageContainer = document.querySelector('.image-container');
        const firstChild = imageContainer.firstChild;
        imageContainer.insertBefore(newLoc,firstChild);

        //imageContainer.appendChild(newLoc);
        
        this.addLocationToArray(locationData);
        //console.log("Adding to Map and Array: " + JSON.stringify(newLoc, null, 2));
    
        //Add Events to Divs
        this.addLocationEvents()

        });
        },

                addSaveLocation(locationData) {
                const { left, top, width, height, divId} = locationData;

                // Create a new location element with the specified properties
                const newLoc = document.createElement('div');
                newLoc.className = 'position-div selection';
                newLoc.style.left = left + 'px';
                newLoc.style.top = top + 'px';
                newLoc.style.width = width + 'px';
                newLoc.style.height = height + 'px';
                newLoc.id = divId;

                // Create a label element for the div ID
                const labelElement = document.createElement('div');
                labelElement.className = 'div-id-label';
                labelElement.textContent = divId;
                newLoc.appendChild(labelElement);

                //console.log("Created: " + JSON.stringify(newLoc, null, 2));

                return newLoc;
                },   
                
                        addLocationToArray(locationData) {
                        const { left, top, width, height, divId, player, gm, misc } = locationData;

                        // Create a new location object with the specified properties
                        const newLocation = {
                                left,
                                top,
                                width,
                                height,
                                divId,
                                player,
                                gm,
                                misc,
                        };

                        this.locationArray.push(newLocation);
                        //console.log("Adding to Array: " + JSON.stringify(newLocation, null, 2));
                        },

//Add Events to Divs when created or loaded. 

addLocationEvents() {
const locationName = document.querySelector('.locationLabel');
const locations = document.querySelectorAll('.selection');

locations.forEach((location) => {
if (!location.dataset.hasListener) {


location.addEventListener('click', () => {
Storyteller.changeContent(location);
Edit.moveLocation(location);

});

location.dataset.hasListener = true;
}
});
},

};

export default Array;
    
    