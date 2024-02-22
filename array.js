import Events from "./events.js";
import editor from "./editor.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Ref from "./ref.js";
import Items from "./items.js";
import Spells from "./spells.js";

const Array = {
locationArray: [],

//for removing keys from .json objects

extractValues(inputObject) {
const valuesArray = [];

for (const key in inputObject) {
if (Object.hasOwnProperty.call(inputObject, key)) {
const value = inputObject[key];
valuesArray.push(value);
}
}

return valuesArray;
},

//For Saving...

addNewLocation(location) {
const rect = location.getBoundingClientRect();
const left = parseFloat(location.style.left);
const top = parseFloat(location.style.top);
const width = parseFloat(location.style.width);
const height = parseFloat(location.style.height);
const divId = location.id;
const description = "";
const tags = ""

return {
left,
top,
width,
height,
divId,
tags,
description,
};
},

saveFile(content, filename, mimeType) {
const blob = new Blob([content], { type: mimeType });
saveAs(blob, filename);
},

exportArray: function () {

// Create the main object to be exported
const exportData = {
eventsArray: Events.eventsArray,
locations: this.locationArray,                
npcArray: NPCs.npcArray,
monsters: Monsters.monstersArray,
items: Items.itemsArray,
spells: Spells.spellsArray,
};

const json = JSON.stringify(exportData, null, 2);
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


//For Loading...




generateUniqueId(array, scope) {

if(scope === 'array'){
    
const largestId = array.reduce((maxId, entry) => (entry.id && entry.id > maxId) ? entry.id : maxId, 0);
//console.log(largestId);
let newId = largestId + 1;

for (const entry of array) {

if (!entry.id) {
entry.id = newId;
newId++;
}
}}

else if(scope === 'entry'){

const largestId = array.reduce((maxId, entry) => (entry.id && entry.id > maxId) ? entry.id : maxId, 0);

return largestId + 1;

}},

loadDataArray(data, object, arrayName) {
    try {
      if (data[arrayName]) {
        object[arrayName] = data[arrayName];
      } else {
        console.log(`${arrayName} data is not available.`);
      }
    } catch (error) {
      console.error(`Error loading ${arrayName} information:`, error);
      throw error;
    }
  },

  loadSaveFile: async (event) => {
    const file = event.target.files[0];
    if (file) {
    const reader = new FileReader();
    
    // Wrap the file reading logic in a Promise
    const readFile = () => {
    return new Promise((resolve, reject) => {
    reader.onload = (e) => {
    const fileContent = e.target.result;
    
    if (fileContent) {
    resolve(fileContent);
    } else {
    reject('Error: File content is empty.');
    }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
    });
    };
    
    try {
    // Wait for the file reading process to complete
    const fileContent = await readFile();
    
    // Now you can call loadAndBuild safely
    await NPCs.loadAndBuild(fileContent);
    } catch (error) {
    console.error('Error handling file input:', error);
    }
    }
    },

handleFileLoad(fileContent) {
    return new Promise((resolve, reject) => {
        try {
            if (fileContent) {
                const data = JSON.parse(fileContent);

        try {
            this.displayLoadedLocationsOnMap(data.locations);
        } catch (error) {
            console.error('Error loading file:', error);
            reject(error);
        }

        try {
            this.generateUniqueId(data.monstersArray, 'array');
            this.generateUniqueId(data.itemsArray, 'array');
            this.generateUniqueId(data.spellsArray, 'array');
            this.generateUniqueId(data.eventsArray, 'array');
            this.generateUniqueId(data.npcArray, 'array');
        } catch (error) {
            // Handle the error if needed
            console.error('Error generating ID;s:', error);
            reject(error);
        }

        try {
            this.loadDataArray(data, Monsters, 'monstersArray');
            this.loadDataArray(data, Items, 'itemsArray');
            this.loadDataArray(data, Spells, 'spellsArray');
            this.loadDataArray(data, Events, 'eventsArray');
            this.loadDataArray(data, NPCs, 'npcArray');
        } catch (error) {
            // Handle the error if needed
            console.error('Error loading data:', error);
            reject(error);
        }

        resolve();
            } else {
                console.error('Error: File content is empty.');
                reject('File content is empty.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            reject(error);
        }
    });
},


displayLoadedLocationsOnMap(data) {
//  // Clear the existing content
var oldData = document.getElementsByClassName('selection');

while(oldData[0]) {
oldData[0].parentNode.removeChild(oldData[0]);
}

this.locationArray=[];

//Set Colour
const colorList = ["lime", "orange", "cyan", "hotpink", "gold"];

// Add the loaded locations to the map and the array
data.forEach((locationData) => {
const newLoc = this.addSaveLocation(locationData);

// Choose a random color from the colorList
const randomColorIndex = Math.floor(Math.random() * colorList.length);
const randomColor = colorList[randomColorIndex];

// Set the chosen random color as the background color
newLoc.style.backgroundColor = randomColor;

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
const imageContainer = document.querySelector('.image-container');
const labelElement = document.createElement('div');
labelElement.className = 'div-id-label';
labelElement.textContent = divId;
newLoc.appendChild(labelElement);

return newLoc;
},   

addLocationToArray(locationData) {
const { left, top, width, height, divId, tags, description } = locationData;

// Create a new location object with the specified properties
const newLocation = {
left,
top,
width,
height,
divId,
tags,
description,
};

this.locationArray.push(newLocation);
//console.log("Adding to Array: " + JSON.stringify(newLocation, null, 2));
},

//Add Events to Divs when created or loaded. 

addLocationEvents() {
const locations = document.querySelectorAll('.selection');

locations.forEach((location) => {
if (!location.dataset.hasListener) {


location.addEventListener('click', () => {
Storyteller.changeContent(location);
NPCs.clearForm(Ref.npcForm);

});

location.dataset.hasListener = true;
}
});
},


}

export default Array;

