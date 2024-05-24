//Helper should not take outside references, except load.Data[...]
import load from "./load.js";
import editor from "./editor.js"; 
import form from "./form.js";
import NPCs from "./npcs.js";
import ref from "./ref.js";

const helper = {

sortData(data){

for (const key in data) {
let obj = data[key];

if (key === 'events'){ //(key !== 'miscInfo' && key!== 'locations') {
obj = obj.map(entry => {
// Remove some fields
// delete entry.key;

// Add new fields
// entry.key = '';
//entry.active = 1;

entry.chance = 100;

return entry

})
}

data[key] = obj;
console.log(load.Data)
}


},

cssColorToHex(cssColorName) {
const tempElement = document.createElement("div");
tempElement.style.color = cssColorName;
document.body.appendChild(tempElement);
const computedColor = window.getComputedStyle(tempElement).color;
document.body.removeChild(tempElement);
const match = computedColor.match(/\d+/g);
if (!match) return null;
const hex = match.map(x => {
const hexValue = parseInt(x).toString(16);
return hexValue.length === 1 ? "0" + hexValue : hexValue;
});
return `#${hex.join("")}`;
},

showPrompt(prompt, type) {
const promptBox = this.createPromptBox(prompt, type); // Assuming you're using "this" to refer to the object containing these functions
document.body.appendChild(promptBox);
},

createPromptBox(prompt, type) {
const promptBox = document.getElementById('promptBox');
promptBox.classList.add('prompt');
promptBox.innerHTML = '';

const promptContent = document.createElement('div');
promptContent.classList.add('prompt-content');

const promptText = document.createElement('p');
promptText.textContent = prompt;
promptContent.appendChild(promptText);

if(type === 'yesNo'){

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('prompt-button-container');

const yesButton = document.createElement('button');
yesButton.textContent = 'Yes';
yesButton.classList.add('prompt-button');
yesButton.onclick = () => { 
this.handleConfirm(true, promptBox); 
};

const noButton = document.createElement('button');
noButton.textContent = 'No';
noButton.classList.add('prompt-button');
noButton.onclick = () => { 
this.handleConfirm(false, promptBox); 
};

buttonContainer.appendChild(yesButton);
buttonContainer.appendChild(noButton);


promptContent.appendChild(buttonContainer);
}

if(type === 'input'){
const userInput = document.createElement('input');
userInput.placeholder = 'Type here...';
userInput.classList.add('userInput');

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('prompt-button-container');

const confirmButton = document.createElement('button');
confirmButton.textContent = 'Confirm';
confirmButton.classList.add('prompt-button');
confirmButton.onclick = () => { 
this.handleConfirm(userInput.value, promptBox); 
};

const cancelButton = document.createElement('button');
cancelButton.textContent = 'Cancel';
cancelButton.classList.add('prompt-button');
cancelButton.onclick = () => { 
this.handleConfirm(null, promptBox); 
};

buttonContainer.appendChild(confirmButton);
buttonContainer.appendChild(cancelButton);

promptContent.appendChild(userInput);
promptContent.appendChild(buttonContainer);
}

promptBox.appendChild(promptContent);
promptBox.style.display = 'block';

return promptBox;
},

handleConfirm(response, promptBox) {
promptBox.style.display = 'none';

if (response !== null) {
// Do something with the response
console.log('User response:', response);
} else {
// User cancelled
console.log('User cancelled');
}
},

adjustFontSize() {
// Default font size
let fontSize = 3.8; // Set your default font size here

// Set initial font size
ref.locationLabel.style.fontSize = fontSize + 'vh';

// Check if the text overflows
while (ref.locationLabel.scrollWidth > ref.locationLabel.offsetWidth) {
// Reduce font size
fontSize -= 0.1;
ref.locationLabel.style.fontSize = fontSize + 'vh';
}
},

proper(string){
try{
return string.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}catch{
return string;
}
},

convertKeys(keys) {
//console.log(keys)
const properWords = [];
for (const key in keys) {
const words = key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
properWords.push(words);
}
return properWords;
},

getIndex(key, id){

const index = load.Data[key].findIndex(obj => parseInt(obj.id) === parseInt(id))
return index

},

standardizeCost(cost) {
// Use regex to find the figure followed by a space and optional '+'
const match = cost.match(/(\d+)(\s*\+*)/);

if (match) {
// Extract the figure and optional '+'
const figure = match[1];
const plusSign = match[2];

// Divide the figure by 100 and add back the optional '+'
const inGold = figure / 100 + plusSign;

return inGold;
}

return cost; // Return the original cost if no match is found
},

filterRandomOptions(obj){

let returnDesc

//Filter if use of <<??>> in description.
const options = obj.description.split('??').filter(Boolean);

if (options.length > 0) {
const randomIndex = Math.floor(Math.random() * options.length);
const selectedOption = options[randomIndex].trim();

returnDesc = `${selectedOption}`;
} else {
returnDesc = `${obj.description}`;
}

return returnDesc;

},

getSurname(fullName) {
// Split the full name into components
let nameComponents = fullName.split(' ');
// Extract the last component as the surname
let surname = nameComponents[nameComponents.length - 1];
return surname;
},

addTagtoItem(clickArray, currentArray){

const currentObjAddress = {key: currentArray.key, id: currentArray.id};
const currentObj = load.Data[currentArray.key][currentArray.index];
const currentObjTags = currentObj.tags;

const clickObjAddress = {key: clickArray.key, id: clickArray.id};
const clickObj = load.Data[clickArray.key][clickArray.index];
const clickObjTags = clickObj.tags;

//Check for duplicates.
const checkCurrent = currentObjTags.find(obj => clickArray.key === obj.key && clickArray.id === obj.id)? true: false;
const checkClick = clickObjTags.find(obj => currentArray.key === obj.key && currentArray.id === obj.id)? true: false;
const addtoSelfCheck = clickObj === currentObj? true:false;

if(checkCurrent === false && addtoSelfCheck === false){
currentObjTags.push(clickObjAddress)
}

if(checkClick === false && addtoSelfCheck === false){
clickObjTags.push(currentObjAddress);  
}

//Replace current tags with appended tags.
load.Data[currentArray.key][currentArray.index].tags = currentObjTags;
load.Data[clickArray.key][clickArray.index].tags = clickObjTags;

},

bulkAdd(item){

//Bulk-Add    
console.log(item)
//Key-ID pairs and Indexes for both Objs -- clicked and current.
const clickId = item.getAttribute('id')
const clickKey = item.getAttribute('key')
const clickIndex = load.Data[clickKey].findIndex(item => parseInt(item.id) === parseInt(clickId));
const clickArray = {id: clickId, key: clickKey, index: clickIndex}

const currentId = document.getElementById('currentId').value;
const currentKey = document.getElementById('key').getAttribute('pair');
const currentIndex = load.Data[currentKey].findIndex(item => parseInt(item.id) === parseInt(currentId));
const currentArray = {id: currentId, key: currentKey, index: currentIndex}

//Not sure if need this.
editor.addItem = false;

//...add the Tag to the Obj, and vice versa.
helper.addTagtoItem(clickArray, currentArray);

//Finally, Repackage to reflect change.
NPCs.buildNPC();
form.createForm(load.Data[currentKey][currentIndex]);


},

getObjfromTag(tag){

let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
let obj = load.Data[tag.key][index];

if(obj === undefined){console.error("Object does not exist at " + tag.key + ':' + tag.id)}

return obj

},

getChildren(tagObj){

//Take a tag and return all child tags.
if(tagObj.key === 'tags'){

tagObj.tags.filter(tag => tag.key === 'tags');
console.log(tagObj.name, tagObj.tags.filter(tag => tag.key === 'tags'));

}

},

getTagsfromObj(obj){

let array = [];
let tags = obj.tags;

if(tags){   

let tidyTags = helper.tidyTags(tags);

tidyTags.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);
//this.getChildren(tagObj);

array.push(tagObj);

})
}

//console.log(array)
return array;

},

tidyTags(tags) {
// Remove dead tags
tags = tags.filter(tag => {
// Get the tag object
let tagObj = this.getObjfromTag(tag);
// Keep the tag if the tag object is not undefined
return tagObj !== undefined;
});

//return tags;

// Use reduce to create a new array with unique tags
return tags.reduce((uniqueTags, tag) => {
// Check if the tag already exists in uniqueTags based on key and id
let isDuplicate = uniqueTags.some(existingTag =>
existingTag.key === tag.key && parseInt(existingTag.id) === parseInt(tag.id)
);
// If the tag is not a duplicate, add it to uniqueTags
if (!isDuplicate) {
uniqueTags.push(tag);
}
return uniqueTags;
}, []);

},

rollDice(sides){

return Math.floor(Math.random() * sides) + 1;

}

};

export default helper;