// Import the necessary module
import load from "./load.js";
import ref from "./ref.js";
import editor from "./editor.js"; 
import form from "./form.js";
import NPCs from "./npcs.js";
import helper from "./helper.js";
import party from "./party.js";
import Storyteller from "./storyteller.js";
import save from "./save.js";


const expandable = {

expandExtend(source) {

this.expand(source);
this.extend(source);

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

//Logic for extending elements in the Storyteller to show more information.
extend(source){

const extendableElements = source.querySelectorAll('.extendable');

extendableElements.forEach(element => {element.addEventListener('click', (event) => {

const key = event.target.getAttribute('key');
const id = event.target.getAttribute('id');
const index = helper.getIndex(key, id);
const obj = load.Data[key][index];
const keywords = expandable.generateKeyWords(load.Data);
const hyperDesc = expandable.findKeywords(obj.description, keywords, "nested");

// Insert first sentence of Backstory
let firstPeriodIndex = hyperDesc.indexOf('.');
let firstSentence = hyperDesc.slice(0, firstPeriodIndex + 1);

if (event.shiftKey) {
form.createForm(obj);

//EXPAND NPC ENTRY IN STORYTELLER
} else if(key === 'npcs'){

// Define booleon.
const showHide = element.getAttribute("showHide");
// console.log(element.getAttribute("showHide"));

//Show expanded NPC entry.
if (showHide === 'hide') {

//obj == NPC
console.log(obj)

//Blank Element
element.setAttribute('showHide', 'show')
//element.innerHTML = ``

//Add whole backstory.
element.innerHTML = `${hyperDesc}`

// //Gather data on NPC's spells.
// const spellsTags = obj.tags.filter(tag => tag.key === 'spells');
// let spellsHTML = ''

// //If there is spells to show...
// if(spellsTags.length > 0){spellsHTML = `<br><br><h3 style="color:${obj.color}">Spells:</h3><hr name="blank" style="background-color:${obj.color}">`;

// //Loop for Inventory
// spellsTags.forEach(tag => {
//     let item = helper.getObjfromTag(tag)
//     let itemInfo = helper.makeIteminfo(item, tag);
//     spellsHTML += `${itemInfo}`;
//     })
    
//     //Format inventory items.
//     spellsHTML += `<br>`;

//     element.innerHTML += `${spellsHTML} <hr name="blank" style="background-color:${obj.color}">` //Add breaker line.
// }

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

let itemsHTML = ''

//If there is an Inventory to show...
if(itemsTags.length > 0){itemsHTML = `<br><br><h3 style="color:${obj.color}">Inventory:</h3><hr name="inventHR" style="background-color:${obj.color}">`;

//Loop for Inventory
itemsTags.forEach(tag => {

//Resolve Chance of Appearing
const chance = parseInt(tag.chance)
const roll = helper.rollDice(100)

if(roll > chance){return}

//Add Item
let item = helper.getObjfromTag(tag)
let itemInfo = helper.makeIteminfo(item, tag);
itemsHTML += `${itemInfo}`;
})

//Format inventory items.
itemsHTML += `<br>`;

//Title for Expanded Backstory Entry.
//<h3 style="color:${obj.color}">${obj.name}'s Backstory.</h3><hr name="tagHR" style="background-color:${obj.color}">

element.innerHTML += `${itemsHTML} <hr name="blank" style="background-color:${obj.color}">` //Add breaker line.

}} else {
// Show only the first sentence.
element.setAttribute('showHide', 'hide')
element.innerHTML = `${firstSentence}`;
this.expand(element)
}

}else if (event.target.classList.contains("nested")){
// Tags within tagEntries: Show tagged entry after the element.

const toDelete = source.querySelectorAll('.deleteMe');
toDelete.forEach(element => {
element.remove();
});

element.setAttribute('showHide', 'show')
const tagEntry = document.createElement('tagEntry');
tagEntry.classList.add('deleteMe')

tagEntry.innerHTML = 
`<h3 class="nested deleteMe"
showHide="hide"
id="${obj.id}" 
key="${obj.key}"
style="color:${obj.color}">
${obj.name}:</h3><hr name="tagHR" style="background-color:${obj.color}">
<span class="nested deleteMe" style="font-family:monospace; color: lightgray; font-size: 1.9vh; ">${hyperDesc}</span>

<hr name="blank" style="background-color:${obj.color}">`;

element.appendChild(tagEntry);
Storyteller.addImagestoStory();
console.log(element)
//this.extend(element)

}else if (key === 'tags'){
console.log('Body')
//Tags within body. 
const toDelete = source.querySelectorAll('.deleteMe');
toDelete.forEach(element => {
element.remove();
});

element.setAttribute('showHide', 'show')
const tagEntry = document.createElement('tagEntry');
tagEntry.classList.add('deleteMe')

tagEntry.innerHTML = 
`<h3 class="nested deleteMe"
showHide="hide"
id="${obj.id}" 
key="${obj.key}"
style="color:${obj.color}">
${obj.name}:</h3><hr name="tagHR" style="background-color:${obj.color}">
<span class="nested deleteMe" style="font-family:monospace; color: lightgray; font-size: 1.9vh; ">${hyperDesc}</span>

<hr name="blank" style="background-color:${obj.color}">`;

const parent = event.target.parentNode;
parent.appendChild(tagEntry);
Storyteller.addImagestoStory();
console.log(element)
// this.extend(parent)

};

Storyteller.addImagestoStory()

});

})


},


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

findKeywords(text, keywords, nested) {
const regex = new RegExp(
keywords.map(keyword => `\\b${keyword.name}\\b`).join("|"), 
"gi"
);

return text.replace(regex, match => {
const keyword = keywords.find(kw => kw.name.toLowerCase() === match.toLowerCase());

if (keyword && nested === undefined) {

return `<span 
class="extendable"
showHide="hide"
id="${keyword.id}" 
key="${keyword.key}"
style='font-family: SoutaneBlack; color:${keyword.color}'>${match}</span>`;

} else if(keyword && nested === "nested"){

return `<span 
class="nested"
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

};

export default expandable;

