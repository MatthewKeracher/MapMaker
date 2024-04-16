// Import the necessary module
import editor from "./editor.js";

import ref from "./ref.js";

import expandable from "./expandable.js";

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

//console.log(this.Data);
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

// Remove the file extension from the name
const fileNameWithoutExtension = name.replace(/\.[^/.]+$/, "")

// Now you can call loadAndBuild safely
await NPCs.loadAndBuild(content);

// Return the file name
load.fileName = fileNameWithoutExtension;
ref.locationLabel.textContent = load.fileName;
//load.locationLabelEvents();

} catch (error) {
console.error('Error reading file:', error);
// Handle the error appropriately, e.g., display an error message to the user
}
}
},

locationLabelEvents(){

ref.locationLabel.addEventListener('click', function() {
editor.createForm()

});

},

handleFileLoad(fileContent) {
return new Promise((resolve, reject) => {

try {
if (fileContent) {

load.Data = JSON.parse(fileContent);

//Helpers
// load.Data.tags = [];
// this.generateTags(load.Data, 'npcs');
// this.generateTags(load.Data, 'locations');
this.sortData(load.Data);

Storyteller.townText = load.Data.townText.description;
load.fileName = load.Data.townText.name;
locationLabel.textContent = load.Data.townText.name;
Storyteller.showTownText();
console.log(load.Data)

try {
load.displayLocations(load.Data.locations);
} catch (error) {
console.error('Error loading file:', error);
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

sortData(data){

// //let ambience = [];

// for (const key in data) {
//     let obj = data[key];

//     if (key === 'subLocations') {
//         obj = obj.map(subLocation => {
//             // Remove some fields
//             delete subLocation.npc;
//             delete subLocation.target;
//             delete subLocation.location;
//             delete subLocation.npc;

//             // Add new fields
//             subLocation.subGroup = '';
            

//             // Return the modified object
//             return subLocation;
//         });
//     }

//     data[key] = obj;
// }


},

displayLocations(data) {

// 1. Clear the existing content
var oldData = document.getElementsByClassName('selection');

while(oldData[0]) {
oldData[0].parentNode.removeChild(oldData[0]);
}

// 2. Create Location Object.
data.forEach((location) => {
const newLoc = this.createLocationObj(location);

// 3. Set the color.
newLoc.style.backgroundColor = location.color;

//4. Append Location to Map.
const imageContainer = document.querySelector('.image-container');
const firstChild = imageContainer.firstChild;
imageContainer.insertBefore(newLoc,firstChild);

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
id,
name, 
tags, 
description,
group,
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

location.addEventListener('click', () => {
Storyteller.changeContent(location);
// ref.Centre.style.display !== "none" || 
if (editor.editMode === true){
//console.log(location)
const obj = load.Data.locations.find(obj => parseInt(location.id) === parseInt(obj.id));
editor.createForm(obj);
}
});

location.dataset.hasListener = true;
}
});
},


}

export default load;