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
console.log("exportArray: " + JSON.stringify(Array.locationArray, null, 2));
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
        const imageContainer = document.querySelector('.image-container');

        // Add the loaded locations to the map and the array
        data.forEach((locationData) => {
        const newLoc = this.createLocation(locationData);
        imageContainer.appendChild(newLoc);
        this.addLocationToArray(locationData);
        //console.log("Adding to Map and Array: " + JSON.stringify(newLoc, null, 2));
        });
        },

                createLocation(locationData) {
                const { left, top, width, height, divId } = locationData;

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
                        const { left, top, width, height, divId } = locationData;

                        // Create a new location object with the specified properties
                        const newLocation = {
                                left,
                                top,
                                width,
                                height,
                                divId,
                        };

                        this.locationArray.push(newLocation);
                        //console.log("Adding to Array: " + JSON.stringify(newLocation, null, 2));
                        },


};

export default Array;
    
    