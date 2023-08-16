const Array = {
locationArray: [],

//For Saving...

getLocation(location) {
const rect = location.getBoundingClientRect();
const left = parseFloat(location.style.left);
const top = parseFloat(location.style.top);
const width = parseFloat(location.style.width);
const height = parseFloat(location.style.height);
const divId = location.id;

return {
left,
top,
width,
height,
divId,
};
},

exportArray(projectName) {
// Convert the locationArray to JSON format
const json = JSON.stringify(this.locationArray, null, 2); // Use 2 spaces for formatting

// Create a Blob containing the JSON data
const blob = new Blob([json], { type: 'application/json' });

// Create a download link for the Blob
const jsonLink = document.createElement('a');
jsonLink.href = URL.createObjectURL(blob);
jsonLink.download = projectName + '.json'; // Use the provided project name for the JSON file name
jsonLink.textContent = 'Download JSON';

// Append the JSON download link to the body
document.body.appendChild(jsonLink);

// Programmatically trigger a click event on the JSON link to start the download
jsonLink.click();

// Remove the JSON download link after the download is initiated
jsonLink.remove();
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
        reader.onload = (e) => Array.handleFileLoad(e.target.result); // Use "Array" here
        reader.readAsText(file);
}
},

handleFileLoad(fileContent) {
try {
        const data = JSON.parse(fileContent);
        this.displayLoadedLocations(data);
} catch (error) {
        console.error('Error loading file:', error);
}
},

createLocationElement(locationData) {
const { left, top, width, height, divId } = locationData;

// Create a new location element with the specified properties
const newLocation = document.createElement('div');
newLocation.className = 'position-div selection';
newLocation.style.left = left + 'px';
newLocation.style.top = top + 'px';
newLocation.style.width = width + 'px';
newLocation.style.height = height + 'px';
newLocation.id = divId;

// Create a label element for the div ID
const labelElement = document.createElement('div');
labelElement.className = 'div-id-label';
labelElement.textContent = divId;
newLocation.appendChild(labelElement);

return newLocation;
},

displayLoadedLocations(data) {
const imageContainer = document.querySelector('.image-container');

// Add the loaded locations to the array
data.forEach((locationData) => {
        const newLocation = this.createLocationElement(locationData);
        imageContainer.appendChild(newLocation);
        this.locationArray.push(newLocation);
});
},


};

export default Array;
    
    