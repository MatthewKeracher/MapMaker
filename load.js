// Import the necessary module
import editor from "./editor.js"; 
import form from "./form.js";
import helper from "./helper.js";
import ref from "./ref.js";
import toolbar from "./toolbar.js";
import expandable from "./expandable.js";
import Add from "./add.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

const load = {

Data : [],
fileName : '',

loadDefault(){
const url = 'data.json';

fetch(url)
.then(response => response.json())
.then(data => {
// Here, 'data' will be your JSON array
this.Data = data
ref.Storyteller.style.display = 'block';
load.fileName = "Untitled Project"
toolbar.showMasterLocation();

//console.log(load.Data)
})
.catch(error => {
console.error('Error fetching data:', error);
});

},

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

try{
const largestId = array.reduce((maxId, entry) => (entry.id && entry.id > maxId) ? entry.id : maxId, 0);
//console.log(largestId)
return largestId + 1;
}

catch{
//if Array is empty, this is first entry!
return 1
}

}},
    
loadSaveFile: async (event, action) => {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();

// Wrap the file reading logic in a Promise
const readFile = () => {
return new Promise((resolve, reject) => {
reader.onload = (e) => {
const fileContent = e.target.result;
if (fileContent) {
    resolve({ content: fileContent, name: file.name });
} else {
    reject(new Error('Error: File content is empty.'));
}
};
reader.onerror = (error) => reject(error);
reader.readAsText(file);
});
};

try {
// Wait for the file reading process to complete
const { content, name } = await readFile();

if(action === 'whole'){ //We are loading a whole file.
// Remove the file extension from the name
//const fileNameWithoutExtension = name.replace(/\.[^/.]+$/, "")

// Now you can call loadAndBuild safely
await NPCs.loadAndBuild(content);
//toolbar.showMasterLocation();

}else if(action === 'part'){ //We are loading data into the file.

load.importData(content);

}

} catch (error) {
console.error('Error reading file:', error);

}
}

},

locationLabelEvents(){

ref.locationLabel.addEventListener('click', function() {
form.createForm()

});

},

importData(fileContent) {

try {
if (fileContent) {

    const data = JSON.parse(fileContent);
    const chosenKeys = ["items"]



    for (const key in data) {
        if (key !== 'miscInfo' && chosenKeys.includes(key)) {
            data[key].forEach(entry => {

                //Avoid Duplicate
                const check = load.Data[key].find(copy => copy.name === entry.name)
                if(check !== undefined){return}

                // Push each entry into load.Data
                entry.id = load.generateUniqueId(load.Data[key], 'entry');
                entry.tags = [];
                load.Data[key].push(entry);
            });
        }
    }

console.log('Importing Data...')
editor.loadList(load.Data);
    

} else {
console.error('Error: File content is empty.');
}
} catch (error) {
console.error('Error parsing JSON:', error);
}

},
    
handleFileLoad(fileContent) {
return new Promise((resolve, reject) => {

try {
if (fileContent) {

load.Data = JSON.parse(fileContent);
//console.log('Overwriting all Data.')

//Helpers
//----
// load.Data.tags = [];
// this.generateTags(load.Data, 'npcs');
// this.generateTags(load.Data, 'locations');
//helper.sortData(load.Data)
//helper.genGems(load.Data);
//helper.genJewelry(load.Data);
//helper.genPotions();
//----

toolbar.showMasterLocation();

try {
load.displayLocations(load.Data.locations);
} catch (error) {
console.error('No map to display locations.', error);
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

generateTags(data, key) {

let allTags = [];

//Get all tags.
data[key].forEach(obj => {

let tags = obj.tags.split(',').map(tag => tag.trim());

tags.forEach(tag => {
allTags.push({tag: tag, id: obj.id})
})

});

allTags.sort((a, b) => a.tag.localeCompare(b.tag));

// Group tag objects by tag name
const groupedTags = {};
allTags.forEach(tag => {
    if (!groupedTags[tag.tag]) {
        groupedTags[tag.tag] = [];
    }
    groupedTags[tag.tag].push({ key: key, id: tag.id });
});

// Create tag objects for each unique tag
for (const tagName in groupedTags) {
    const tagObj = {
        id: load.generateUniqueId(load.Data.tags, 'entry'),
        key: 'tags',
        type: 'color',
        subType: 'group',
        color: 'cyan',
        name: tagName,
        tags: groupedTags[tagName],
        // target: '',
        group: '',
        // location: '',
        // npc: '',
        description: 'This is a tag.'
    };
    load.Data.tags.push(tagObj);
}


//Now swap out old tags for references to tagObjs.

data[key].forEach(obj => {

obj.tags = [];

load.Data.tags.forEach(tagObj => {

    tagObj.tags.forEach(tag => {

        if(tag.id === obj.id && tag.key === obj.key){obj.tags.push({key: 'tags', id: tagObj.id})}

    })

});


});

},

displayLocations(data) {

// 1. Clear the existing content
var oldData = document.getElementsByClassName('selection');

while(oldData[0]) {
oldData[0].parentNode.removeChild(oldData[0]);
}

data = data.filter(entry => parseInt(entry.parentId) === parseInt(Storyteller.parentLocationId));

// 2. Create Location Object.
data.forEach((location) => {

if(parseInt(location.id) === parseInt(Storyteller.parentLocationId)){return} //Don't draw masterLocation!

const newLoc = this.createLocationObj(location);

// 3. Set the color.
newLoc.style.backgroundColor = location.color;

//4. Append Location to Map.
const imageContainer = document.querySelector('.image-container');

try{
const firstChild = imageContainer.firstChild;
imageContainer.insertBefore(newLoc,firstChild);
}catch{console.log("Cannot insert newLoc to imageContainer")}

//Add Events to Divs
this.addLocationEvents()

});

},

createLocationObj(locationData) {
const {left, top, width, height, name, id} = locationData;

// Create a new location element with the specified properties
const newLoc = document.createElement('div');
newLoc.className = 'position-div selection';
newLoc.style.left = left + 'px';
newLoc.style.top = top + 'px';
newLoc.style.width = width + 'px';
newLoc.style.height = height + 'px';
//newLoc.setAttribute("name", name);
newLoc.name = name;
newLoc.id = id;


// Create a label element for the location name
const imageContainer = document.querySelector('.image-container');
const labelElement = document.createElement('div');
labelElement.className = 'div-name-label';
labelElement.textContent = name;
newLoc.appendChild(labelElement);

return newLoc;
},   

addLocationToArray(locationData) {
const { 
left, 
top, 
width, 
height, 
name, 
tags, 
description,
group,
subGroup,
faction,
type,
subType } = locationData;

// Create a new location object with the specified properties
const newLocation = {
left, 
top, 
width, 
height, 
id,
name, 
tags, 
description,
group,
subGroup,
faction,
type,
subType 
};

load.Data.locations.push(newLocation);
//console.log("Adding to Array: " + JSON.stringify(newLocation, null, 2));
},

addLocationEvents() {
const locations = document.querySelectorAll('.selection');

locations.forEach((location) => {
if (!location.dataset.hasListener) {

location.addEventListener('click', (event) => {


if(event.shiftKey){
//reDraw Location
Add.reDrawLocation(location);

}else{
//load Location
Storyteller.changeContent(location.id);
 
if (editor.editMode === true){
//console.log(location)
const obj = load.Data.locations.find(obj => parseInt(location.id) === parseInt(obj.id));
console.log(obj)
}
}
});

location.dataset.hasListener = true;
}
});
},

checkStoredData(){

if (localStorage.getItem('myData')) {

// helper.showPrompt('Do you want to load autosave?', 'yesNo');

//     helper.handleConfirm = function(confirmation) {
//     const promptBox = document.querySelector('.prompt');
        
//     if (confirmation) {
//     load.getStoredData();
//     promptBox.style.display = 'none';
//     } else{
//     promptBox.style.display = 'none';
//     }}


setTimeout(() => {
    load.getStoredData();
}, 500); // 3000 milliseconds = 3 seconds
    
}
},

getStoredData(){

let storedData = localStorage.getItem('myData');
let parsedData = JSON.parse(storedData);
load.Data = parsedData;
console.log(load.Data)

//Test for stored Data
try{
toolbar.showMasterLocation();
}catch{
console.error('Could not recover data. Hope you have a recent save!')
}

},

saveToBrowser(){

window.addEventListener('beforeunload', function() {
localStorage.setItem('myData', JSON.stringify(load.Data));
});

},

// Function to convert JSON to CSV
convertJsonToCsv(data) {
    // Extract header from the first object's keys
    const header = Object.keys(data[0]);

    // Convert each object to a CSV row
    const rows = data.map(obj => {
        return header.map(key => {
            let value = obj[key];
            // If the value contains commas, enclose it in double quotes
            if (typeof value === 'string' && value.includes(',')) {
                value = `"${value}"`;
            }
            return value;
        }).join(',');
    });

    // Combine header and rows
    return [header.join(','), ...rows].join('\n');
},

downloadCsv(csvData, fileName) {
    // Create a Blob object from the CSV data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Trigger the download
    link.click();
},

exportDataForKey(key) {
    // Example JSON data for the key (replace this with your actual data)
    const jsonData = load.Data[key];

    // Convert JSON data to CSV format
    const csvData = this.convertJsonToCsv(jsonData);

    // Download the CSV file
    this.downloadCsv(csvData, `${key}.csv`);
},


}

export default load;