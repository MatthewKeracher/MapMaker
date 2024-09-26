// Import the necessary module
import load from "./load.js";
import ref from "./ref.js";
import editor from "./editor.js"; 
import form from "./form.js";
import NPCs from "./npcs.js";
import helper from "./helper.js";
import party from "./party.js";
import Storyteller from "./storyteller.js";
import events from "./events.js";


const expandable = {

expandExtend(source) {

this.expand(source);
this.extend(source);
this.showInventory();
this.goToEdit();

Storyteller.addImagestoStory()

},

extend(source){

const extendableElements = source.querySelectorAll('.extendable');

extendableElements.forEach(div => {div.addEventListener('mouseover', () => {

this.showTag(div);

})})},


showFloatingExpandable() {
const expandableElements = document.querySelectorAll('.float');
const expandableElementsCentre = ref.Centre.querySelectorAll('.float');
// const expandableElements = [...expandableElementsLeft, ...expandableElementsCentre];


expandableElements.forEach(element => {

element.addEventListener('click', (event) => {

const contentType = event.target.getAttribute('key');
const contentId = event.target.getAttribute('divId');
const contentStyle = element.getAttribute('style');

// Create a floating box div
let floatingBox = document.createElement('div');
floatingBox.classList.add('floating-box');
const divId = "floatingBox";
floatingBox.setAttribute('id', divId);

// Append the floating box to the document body
const dupCheck = document.getElementById(divId);
if(dupCheck){
floatingBox = document.getElementById(divId);
}else{
document.body.appendChild(floatingBox);
}

// Remove the floating box when leaving the element
floatingBox.addEventListener('click', () => {

try{
document.body.removeChild(floatingBox);
}catch{

}

});

switch (contentType) {
case 'monster':
expandable.addMonsterInfo(contentId, contentStyle, floatingBox); // Handle Monsters
break;
case 'item':
Items.addIteminfo(contentId,contentStyle, floatingBox); // Handle Items
break;
case 'spell':
editor.addInfo(contentId,contentStyle, floatingBox); // Handle Spells
break;
case 'misc':
this.addMiscInfo(contentId,contentStyle, floatingBox); //Handle Misc
break;
case 'rule':
this.addRulesInfo(contentId,contentStyle, floatingBox); //Handle Rule
console.log('rule')
break;
default:
console.log('Unknown content type');
}  



});
});
},

findKeywords(text, keywords, omit) {
const regex = new RegExp(
keywords.map(keyword => `\\b${keyword.name}\\b`).join("|"), 
"gi"
);

return text.replace(regex, match => {
const keyword = keywords.find(kw => kw.name.toLowerCase() === match.toLowerCase());

if (keyword && keyword.name !== omit) {

return `<span 
class="extendable"
showHide="hide"
id="${keyword.id}" 
key="${keyword.key}"
style='font-family: SoutaneBlack; color:${keyword.color}'>${match}</span>`;

}else{
return match;
}
});

},

generateKeyWords(data) {

let allKeywords = [];

for (const key in data) {

let obj = data[key];

if (key === 'tags') {

obj.forEach(entry => {

allKeywords.push({name: entry.name, key: entry.key, id: entry.id, color: entry.color})

})

}};

return allKeywords;

},

expand(source){

const expandableElements = source.querySelectorAll('.expandable');
expandableElements.forEach(element => {

element.addEventListener('click', (event) => {
const key = event.target.getAttribute('key');
const id = event.target.getAttribute('id');
const index = helper.getIndex(key, id);
const obj = load.Data[key][index];

if(event.shiftKey){
if(key === 'npcs' && ref.leftParty.style.display === 'block'){
load.Data.miscInfo.party.push({key, id});
party.loadParty();
Storyteller.refreshLocation();
}

else{
form.createForm(obj);         
}}
});

});

},

showInventory(){

const inventories = document.querySelectorAll('.inventory');

inventories.forEach(div => {div.addEventListener('click', (event) => {

let id = div.getAttribute('id');
let key = div.getAttribute('key');
let obj = helper.getObjfromTag({key: key, id: id}); 
let existingDiv = ref.leftExpand.querySelector(`[key="inventory"][id="${obj.id}"]`)

ref.leftExpand.innerHTML = ``;

if (existingDiv === null) {

// Gather data on NPC's Inventory
const itemsTags = obj.tags.filter(tag => tag.key === 'items' || tag.key === 'spells');

//Add tags from Tags of same key, so an item or spell gained through a Tag.
let keyTags = obj.tags.filter(entry => entry.key === "tags");
keyTags.forEach(tag => {

const tagObj = helper.getObjfromTag(tag);
let associatedTags = tagObj.tags.filter(tag => tag.key === 'items' || tag.key === 'spells');

associatedTags.forEach(tag => {

//Add into NPC's tags
itemsTags.push(tag);

}) })

ref.leftExpand.style.display = 'block';
events.makeDiv('inventory', obj, ref.leftExpand)
Storyteller.addImagestoStory()

//If there is an Inventory to show...
if(itemsTags.length > 0){

//Loop for Inventory
itemsTags.forEach(tag => {

//Exclude metaTags
let iCheck = tag.id.toString().charAt(0); 
if(iCheck === 'i'){return}

//Resolve Chance of Appearing
const chance = parseInt(tag.chance)
const roll = helper.rollDice(100)

if(roll > chance){return}

//Add Item
let item = helper.getObjfromTag(tag)
let itemObj = helper.makeIteminfo(item, tag);
events.makeDiv("item", itemObj, ref.leftExpand);
})
}

}else {

ref.leftExpand.style.display = 'none'

}

const inventoryHeader = document.querySelectorAll(".inventoryHeader");
const itemNames = document.querySelectorAll(".story-name-cell");


const divs = [
...itemNames, 
...inventoryHeader
];

divs.forEach(div => {

// Then, add new listeners using the named functions
div.addEventListener('click', expandable.addClickToEdit);
div.addEventListener('mouseover', expandable.addHighlight);
div.addEventListener('mouseout', expandable.removeHighlight);

});

})});

},

showTag(div){

let id = div.getAttribute('id');
let key = div.getAttribute('key');
let obj = helper.getObjfromTag({key: key, id: id}); 

ref.leftExpand.style.display = 'block';

//Remove Old Tag Entries.
ref.leftExpand.innerHTML = ``;
ref.leftExpand.innerHTML += `<br>`
events.makeDiv("header", obj, ref.leftExpand, "color");
ref.leftExpand.innerHTML += `<br>`
events.makeDiv("child ", obj, ref.leftExpand);

const hyperlinks = ref.leftExpand.querySelectorAll('.extendable');

hyperlinks.forEach(div => {

div.addEventListener('mouseover', expandable.addHighlight);
div.addEventListener('mouseout', expandable.removeHighlight);
div.addEventListener('click', () => expandable.showTag(div));

Storyteller.addImagestoStory()
});

const tagHeader = ref.leftExpand.querySelector(".tagHead");

    tagHeader.addEventListener('click', expandable.addClickToEdit);
    tagHeader.addEventListener('mouseover', expandable.addHighlight);
    tagHeader.addEventListener('mouseout', expandable.removeHighlight);
    
},

goToEdit(){

const locDescriptions = ref.Storyteller.querySelectorAll(".description");
const npcNames = ref.Storyteller.querySelectorAll(".npcName");
const npcDialogue = ref.Storyteller.querySelectorAll(".npcDialogue");
const npcActions = ref.Storyteller.querySelectorAll(".npcActionSpan");
const ambience = ref.Storyteller.querySelectorAll(".ambience");
const backstories = ref.Storyteller.querySelectorAll(".backstory");
const itemNames = document.querySelectorAll(".story-name-cell");

const divs = [
...npcDialogue, 
...npcActions, 
...ambience, 
...backstories, 
...npcNames, 
...itemNames,
...locDescriptions]

divs.forEach(div => {

// First, remove existing listeners
div.removeEventListener('click', expandable.addClickToEdit);
div.removeEventListener('mouseover', expandable.addHighlight);
div.removeEventListener('mouseout', expandable.removeHighlight);

// Then, add new listeners using the named functions
div.addEventListener('click', expandable.addClickToEdit);
div.addEventListener('mouseover', expandable.addHighlight);
div.addEventListener('mouseout', expandable.removeHighlight);

});


},

addHighlight() {
this.classList.add('highlight');
},

removeHighlight() {
this.classList.remove('highlight');
},

extendBackstory(div){

let id = div.getAttribute('id');
let key = div.getAttribute('key');
let obj = helper.getObjfromTag({key: key, id: id});
let keywords = expandable.generateKeyWords(load.Data);
let hyperDesc = expandable.findKeywords(obj.description, keywords, obj.name);

div.setAttribute("extended", "true");

div.innerHTML = hyperDesc;
},

addClickToEdit() {
const id = this.getAttribute('id');
const key = this.getAttribute('key');
let index = load.Data[key].findIndex(entry => parseInt(entry.id) === parseInt(id));

if(key === 'npcs'){
const isExtended = this.getAttribute('extended');

if(isExtended === 'false'){
expandable.extendBackstory(this)
return
};

}

form.createForm(load.Data[key][index]);
},

};

export default expandable;

