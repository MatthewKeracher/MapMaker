//Helper should not take outside references, except load.Data[...]
import load from "./load.js";
import editor from "./editor.js"; 
import form from "./form.js";
import NPCs from "./npcs.js";
import ref from "./ref.js";

const helper = {

followInstructions(instruction, obj) {

console.log(instruction)

let quantity = instruction.quantity? instruction.quantity : 1;
let madeItems = obj.tags.filter(tag => tag.instruction === instruction.id);
let options = []

if(madeItems.length === quantity){return};

const quantityRemaining = parseInt(quantity) - parseInt(madeItems.length);

if(instruction.group){
options = load.Data[instruction.key].filter(item => item[instruction.type] === instruction.name && item.group === instruction.group)
} else{ 
options = load.Data[instruction.key].filter(item => item[instruction.type] === instruction.name)
}


if(instruction.type === 'subGroup'){

for (let i = quantityRemaining; i > 0; i--) {

const randomIndex = Math.floor(Math.random() * options.length);
const randomObj = options[randomIndex];

const newItemTag = {key: randomObj.key, id: randomObj.id, instruction: instruction.id, quantity: "1", chance: instruction.chance}

const newItem = helper.getObjfromTag(newItemTag)

// obj.tags.push(newItemTag)
// newItem.tags.push({key: obj.key, id: obj.id, quantity: "1", chance: instruction.chance})

madeItems.push({item: newItem, tag: newItemTag})

options.splice(randomIndex, 1)


}

// }else if(instruction.type === 'group'){

// const options = load.Data[tag.key].filter(item => item[tag.type] === tag.name)
// const subGroups = [...new Set(options.map(item => item.subGroup))];

// for (let i = quantityRemaining; i > 0; i--) {

// let randSubGroup = Math.floor(Math.random() * subGroups.length);

// let options = load.Data[tag.key].filter(item => item.subGroup === subGroups[randSubGroup] && item.group === tag.name)

// const randomIndex = Math.floor(Math.random() * options.length);
// const randomObj = options[randomIndex];

// const newTag = {key: randomObj.key, id: randomObj.id, instruction: tag.id}
// madeItems.push(newTag)

// }


}

return madeItems

},

genJewelry(data){

const gemsArray = data.items.filter(item => item.group === "Gem")
const jewelryArray = 

[
{"item": "Anklet", "weight": 0.1, "description": "A delicate metal ornament worn around the ankle."},
{"item": "Earring", "weight": 0.01, "description": "A small, decorative piece of metal jewelry worn on the ear."},
{"item": "Belt", "weight": 0.5, "description": "A sturdy metal belt, often used as a functional and decorative accessory."},
{"item": "Flagon", "weight": 1.5, "description": "A large metal vessel used for drinking or serving beverages."},
{"item": "Bowl", "weight": 1, "description": "A round metal container used for holding food or liquids."},
{"item": "Goblet", "weight": 0.5, "description": "A decorative metal cup used for drinking."},
{"item": "Bracelet", "weight": 0.1, "description": "A simple metal band worn around the wrist."},
{"item": "Brooch", "weight": 0.05, "description": "A decorative metal pin used to fasten garments."},
{"item": "Buckle", "weight": 0.2, "description": "A metal clasp used to fasten a belt or strap."},
{"item": "Chain", "weight": 0.2, "description": "A series of interconnected metal links used as decoration or to hold objects."},
{"item": "Choker", "weight": 0.1, "description": "A close-fitting metal necklace worn around the neck."},
{"item": "Circlet", "weight": 0.25, "description": "A thin metal band worn around the head, often as a decorative crown."},
{"item": "Clasp", "weight": 0.05, "description": "A small metal fastener used to secure jewelry or clothing."},
{"item": "Comb", "weight": 0.1, "description": "A metal grooming tool used to style hair."},
{"item": "Crown", "weight": 0.75, "description": "An ornate metal headpiece worn by royalty."},
{"item": "Cup", "weight": 0.5, "description": "A simple metal vessel used for drinking."},
{"item": "Knife", "weight": 0.3, "description": "A small metal blade used for cutting or as a tool."},
{"item": "Letter Opener", "weight": 0.2, "description": "A slender metal tool used to open envelopes."},
{"item": "Locket", "weight": 0.05, "description": "A small metal pendant that opens to reveal a picture or keepsake."},
{"item": "Medal", "weight": 0.1, "description": "A metal disk awarded as a mark of achievement or honor."},
{"item": "Necklace", "weight": 0.3, "description": "A decorative metal chain or string worn around the neck."},
{"item": "Plate", "weight": 2, "description": "A flat metal dish used for serving food."},
{"item": "Pin", "weight": 0.02, "description": "A small metal fastener used to secure clothing or as a decoration."},
{"item": "Sceptre", "weight": 2.5, "description": "A ceremonial metal staff held by a ruler or dignitary."},
{"item": "Statuette", "weight": 5, "description": "A small metal sculpture, often used as a decorative piece."},
{"item": "Tiara", "weight": 0.6, "description": "An ornate metal headpiece worn by women, similar to a small crown."}
]


const materialArray = [
{name: 'Copper',
color: '#B87333',
value:0.5},
{name: 'Silver',
color: '#C0C0C0',
value: 5},
{name: 'Gold',
color: '#FFD700',
value:50},
{name: 'Platinum',
color: '#E5E4E2',
value:500},
{name: 'Electrum',
color: '#E7C697',
value:25}]

jewelryArray.forEach(piece => {

materialArray.forEach(material => {

const newId = load.generateUniqueId(load.Data.items, 'entry');

const newPiece = {
description: "An unknown entity.",
id: newId,
type: "group",
subType: "subGroup",
name: material.name + ' ' + piece.item,
group: "Jewelry",
subGroup: material.name + ' Jewelry',
order: "",
color: material.color,
weight: piece.weight,
size: "XS",
cost: piece.weight * material.value,
damage: "",
range: "",
armourClass: "",
key: "items",
description: piece.description,
tags: []
}

load.Data.items.push(newPiece)

})

load.Data.items = load.Data.items.filter(entry => entry.name !== piece.item)

})



},

genGems(data){

const gemsArray = data.items.filter(item => item.subGroup === "Gem")
console.log(gemsArray)

const gemQualities = [
{name: "Ornamental",
value: 10,
numberFound: "1d10"},
{name: "Semiprecious",
value: 50,
numberFound: "1d10"},
{name: "Fancy",
value: 100,
numberFound: "1d10"},
{name: "Precious",
value: 500,
numberFound: "1d10"},
{name: "Gem",
value: 1000,
numberFound: "1d10"},
{name: "Jewel",
value: 5000,
numberFound: "1"},
]

const valueAdjustment = [
{result: 2,
adjustment: "Lower Value Row"},
{result: 3,
adjustment: 0.5},
{result: 4,
adjustment: 0.75},
{result: 5,
adjustment: 1},
{result: 6,
adjustment: 1},
{result: 7,
adjustment: 1},
{result: 8,
adjustment: 1},
{result: 9,
adjustment: 1},
{result: 10,
adjustment: 1.5},
{result: 11,
adjustment: 2},
{result: 12,
adjustment: "Next Value Row"},
]

gemsArray.forEach(gemEntry => {

const valueAdjustmentRoll = helper.rollMultipleDice('2d6')
const valueAdjustmentResult = valueAdjustment.find(entry => entry.result === valueAdjustmentRoll)

console.log('Result', valueAdjustmentResult)

gemQualities.forEach(qualEntry => {

const newId = load.generateUniqueId(load.Data.items, 'entry');

const newGem = {
description: "An unknown entity.",
id: newId,
type: "group",
subType: "subGroup",
name: gemEntry.name + " (" + qualEntry.name + ")",
group: "Gems",
subGroup: qualEntry.name,
order: "",
color: gemEntry.color,
weight: "*",
size: "XS",
cost: qualEntry.value,
damage: "",
range: "",
armourClass: "",
key: "items",
tags: []
}

load.Data.items.push(newGem)


})

load.Data.items = load.Data.items.filter(entry => entry !== gemEntry)

})

},

makeHitPointBoxes(npc){

let numberBoxes = npc.hitPoints;
let checkboxesHTML = '';


checkboxesHTML += `<input 
id="${npc.id}CurrentHP" 
type="number" 
class="item-quant-cell item-quant-column"
value="${npc.hitPoints}">`


// Return the generated HTML string
return checkboxesHTML;

},

coinLogic(item,itemQuant){
let itemValue = item.cost.toString()
let costValue = itemValue
let color = ''

if(!itemQuant){itemQuant = 1}

const coinValues = [
{coin: 'cp', value: 0.01},
{coin: 'sp', value: 0.1},
{coin: 'ep', value: 0.5},
{coin: 'gp', value: 1},
{coin: 'pp', value: 100},
]

let matchedCoin = coinValues.find(coinObj => itemValue.includes(coinObj.coin));

if (matchedCoin) {
//As Gold Decimal
costValue = parseFloat(itemValue.replace(matchedCoin.coin, '')) * matchedCoin.value;

//of type 0.00gp now
}

itemValue = (costValue * itemQuant).toFixed(2);

const decimalPlaces = this.getDecimalPlaces(parseFloat(itemValue))

// if(itemQuant === 1){

if(decimalPlaces === 2){
itemValue = (itemValue * 100).toFixed(0) + ' Copper Coins'
color = '#B87333'
}else if(decimalPlaces === 1){
itemValue = (itemValue * 10).toFixed(0) + ' Silver Coins'
color = '#C0C0C0'
} else if(decimalPlaces === 0){
itemValue = (itemValue * 1).toFixed(0) + ' Gold Coins'
color = '#FFD700'
}

// }else{

// itemValue = itemValue * itemQuant

// if(decimalPlaces === 2){
// itemValue = itemValue * 100 + ' Copper Coins'
// color = '#B87333'
// }else if(decimalPlaces === 1){
// itemValue = itemValue * 10 + ' Silver Coins'
// color = '#C0C0C0'
// } else if(decimalPlaces === 0){
// itemValue = itemValue * 1 + ' Gold Coins'
// color = '#FFD700'
// }

// }



// (parseFloat(item.cost) * parseFloat(itemQuant)).toFixed(2).replace(/\.?0+$/, '') + 'gp (' + item.cost + ' gp each)': 
// item.cost + ' gp'
let returnObj = {value: itemValue, color: color}
return returnObj

},

addEventsToStoryteller(){

const storyNameCell = document.querySelectorAll(".story-name-cell")

storyNameCell.forEach(div => {

div.addEventListener('click', () => {

const key = div.getAttribute('key')
const id = div.getAttribute('id')
let index = load.Data[key].findIndex(entry => parseInt(entry.id) === parseInt(id));

//console.log(key, id, index)
form.createForm(load.Data[key][index]);

});

div.addEventListener('mouseover', function() {
this.classList.add('highlight');
});

div.addEventListener('mouseout', function() {
this.classList.remove('highlight');
});

})


},

updateEventContent(){

const npcEvents = document.querySelectorAll(".npcEvent")

npcEvents.forEach(div => {

const eventID = div.getAttribute("eventID")
const eventObj = load.Data.events.find(obj => obj.id === parseInt(eventID))

if(eventObj === undefined){return}

const options = eventObj.description.split('??').filter(Boolean);
const currentOption = options.findIndex(option => option === div.textContent)

//if(div.textContent.includes('"')){

// var i = 0;
// var txt = 'Lorem ipsum dummy text blabla.';
// var speed = 50;

// function typeWriter() {
//   if (i < txt.length) {
//     document.getElementById("demo").innerHTML += txt.charAt(i);
//     i++;
//     setTimeout(typeWriter, speed);
//   }
// }

if(currentOption === options.length - 1){
div.textContent = options[0]
}else{
div.textContent = options[currentOption + 1]
}

//}

})
},

getDecimalPlaces(value) {


if (!isFinite(value) || Math.floor(value) === value) {
// Return 0 if the value is not finite or if it's an integer
return 0;
}

// Convert the value to a string and split it at the decimal point
let valueString = value.toString();
let decimalPart = valueString.split('.')[1];

// Return the length of the decimal part
return decimalPart.length;
},

makeIteminfo(item, tag){
let itemQuant = tag.quantity && tag.quantity > 1? tag.quantity : tag.quantity && tag.quantity.includes('d')? helper.rollMultipleDice(tag.quantity) : '';
let itemBonus = tag.bonus && tag.bonus !== '-'? ' (' + tag.bonus + ')' : '';
let itemName = itemQuant + ' ' + item.name;
let typeInfo = item.damage? 'Weapon' : item.armourClass? 'Armour' : item.key === 'spells'? 'Spell' : 'misc';
let itemInfo = '';
let color = item.color;

if(typeInfo === 'Weapon'){
itemInfo += item.damage + itemBonus + ' Damage' }

if(typeInfo === 'Armour'){
itemInfo += ' Armour Class: ' + item.armourClass + itemBonus}

if(typeInfo === 'Spell'){
itemInfo += item.class + ' ' + item.level}

if(typeInfo === 'misc'){
const returnedObj = helper.coinLogic(item,itemQuant)
const itemValue = returnedObj.value
color = returnedObj.color
itemInfo += itemValue;

}

let itemHTML = `
<div id="${item.name}Row" 
class = "story-item-row"
tagid = ${tag.id} 
tagkey = ${tag.key}>

<label key= ${item.key} id="${item.id}" class="expandable story-name-cell story-name-column" style="color:${item.color}">
${itemName}
</label>

<label 
id="${typeInfo}" 
type="text" 
class="story-data-cell story-data-column" style="color:${typeInfo === 'misc'? color: item.color}">
${itemInfo}</label>

</div>`

return itemHTML

},

sortData(data){

for (const key in data) {
let obj = data[key];

if (key === 'tags'){ //(key !== 'miscInfo' && key!== 'locations') {
obj = obj.map(entry => {
// Remove some fields
// delete entry.key;

// Add new fields
// entry.key = '';
//entry.active = 1;

if(entry.image){
return
}else{
entry.image = ""}

//entry.chance = 100;

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

showPrompt(prompt, type, option1, option2) {
const promptBox = this.createPromptBox(prompt, type, option1, option2); // Assuming you're using "this" to refer to the object containing these functions
document.body.appendChild(promptBox);
},

createPromptBox(prompt, type, option1, option2) {
const promptBox = document.getElementById('promptBox');
promptBox.classList.add('prompt');
promptBox.innerHTML = '';

const promptContent = document.createElement('div');
promptContent.classList.add('prompt-content');

const promptText = document.createElement('p');
promptText.textContent = prompt;
promptContent.appendChild(promptText);

if(type === 'custom'){

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('prompt-button-container');

const option1Button = document.createElement('button');
option1Button.textContent = option1;
option1Button.classList.add('prompt-button');
option1Button.onclick = () => { 
this.handleConfirm(true, promptBox); 
};

const option2Button = document.createElement('button');
option2Button.textContent = option2;
option2Button.classList.add('prompt-button');
option2Button.onclick = () => { 
this.handleConfirm(false, promptBox); 
};

buttonContainer.appendChild(option1Button);
buttonContainer.appendChild(option2Button);


promptContent.appendChild(buttonContainer);
}


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

try{
const index = load.Data[key].findIndex(obj => parseInt(obj.id) === parseInt(id))
return index
}catch{ console.error(key, id)}


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

if (options.length > 1) {
const randomIndex = Math.floor(Math.random() * options.length);
const selectedOption = options[randomIndex].trim();

returnDesc = `<span class="npcEvent" eventID="${obj.id}"> ${selectedOption} </span>`;
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

console.log(clickObj.name + ' added to ' + currentObj.name)

},

shiftClickItem(item){

//Choice whether to bulk add or random add!
helper.showPrompt('Add all items, or add random item?', 'custom', 'All', 'Random');
ref.promptBox.focus();
helper.handleConfirm = function(confirmation) {
const promptBox = document.querySelector('.prompt');
if (confirmation) { //'Add All Items'

helper.bulkAdd(item);   
promptBox.style.display = 'none';
} else{ //'Add Random Item'

}}



},

//Instead of linking to an Obj, link to an instruction to link to an Obj.
addInstruction(entryName, key, type, sectionName){

const currentId = document.getElementById('currentId').value;
const currentKey = document.getElementById('key').getAttribute('pair');
const currentIndex = load.Data[currentKey].findIndex(item => parseInt(item.id) === parseInt(currentId));

//Make a special 'instruction' tag.
let tag = {special: "instruction", id: "i" + Math.floor(Math.random() * 1000), key: key, type: type, name: entryName, group: sectionName}

load.Data[currentKey][currentIndex].tags.push(tag)

//Finally, Repackage to reflect change.
NPCs.buildNPC();
form.createForm(load.Data[currentKey][currentIndex]);


},

bulkAdd(item){

//Bulk-Add    
//console.log(item)
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

//Instruction Tags
if(tag.special === 'instruction'){

//console.log('Recieved Instructions', tag)

const obj = {
id:tag.id,
special: "instruction",
//color:
key: tag.key,
type: tag.type,
name: tag.name,
group: tag.group
}

return obj

//Normal Tags
}else{
let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
let obj = load.Data[tag.key][index];

if(obj === undefined){console.error("Object does not exist at " + tag.key + ':' + tag.id)}

return obj
}

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

rollMultipleDice(input) {
// Split the input string into the number of dice and the number of sides
let [number, sides] = input.split('d').map(Number);

// If the input is invalid (like "d8" or "1d"), return an error message or handle accordingly
if (isNaN(number) || isNaN(sides)) {
return 'Invalid input format';
}

let results = 0;

// Roll the dice the specified number of times
for (let i = 0; i < number; i++) {
results = results + this.rollDice(sides);
}

return results;
},

rollDice(sides) {

return Math.floor(Math.random() * sides) + 1;
}

}

export default helper;