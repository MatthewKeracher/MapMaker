// Import the necessary module
import load from "./load.js";
import ref from "./ref.js";
import editor from "./editor.js"; 
import form from "./form.js";
import NPCs from "./npcs.js";
import helper from "./helper.js";
import party from "./party.js";
import Storyteller from "./storyteller.js";


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

extend(source){

const extendableElements = source.querySelectorAll('.extendable');

extendableElements.forEach(element => {element.addEventListener('click', (event) => {

const key = event.target.getAttribute('key');
const id = event.target.getAttribute('id');
const index = helper.getIndex(key, id);
const obj = load.Data[key][index];
const keywords = expandable.generateKeyWords(load.Data);
const description = expandable.findKeywords(obj.description, keywords);

// Insert first sentence of Backstory
let firstPeriodIndex = description.indexOf('.');
let firstSentence = description.slice(0, firstPeriodIndex + 1);

if (event.shiftKey) {
form.createForm(obj);
} else if(key === 'npcs'){
// Show/Hide NPC Description.
const showHide = element.getAttribute("showHide");
// console.log(element.getAttribute("showHide"));

if (showHide === 'hide') {
// Show full description and items.
const itemsTags = obj.tags.filter(tag => tag.key === 'items');
let itemsHTML = ''

if(itemsTags.length > 0){itemsHTML = 
    `<h3 style="color:${obj.color}">Inventory:</h3>`

itemsTags.forEach(tag => {
let item = helper.getObjfromTag(tag)

const itemHTML = 
`<span 
class="expandable" 
style="color:${item.color}"
id="${item.id}"
key="${item.key}"> ${item.name}</span><br>`

itemsHTML += itemHTML
})


element.setAttribute('showHide', 'show')
element.innerHTML = 
`${itemsHTML}
${description}
`;}else{
element.setAttribute('showHide', 'show')
element.innerHTML = 
`${description}`;
}
this.expand(element)


} else {
// Show only the first sentence.
element.setAttribute('showHide', 'hide')
element.innerHTML = `${firstSentence}`;
this.expand(element)
}

} else if (key === 'tags'){

// Show/Hide Tag Description.
const showHide = element.getAttribute("showHide");

if (showHide === 'hide') {
// Show full description in place of name.
element.setAttribute('showHide', 'show')
element.innerHTML = 
`
<h3 class="extendable"
showHide="hide"
id="${obj.id}" 
key="${obj.key}"
style="color:${obj.color}">${obj.name}:</h3>
<span style="font-family:monospace; color: whitesmoke"> ${description} </span>

<hr>`;

this.extend(element)

} else {
// Show only the tag name.
element.setAttribute('showHide', 'hide')
element.innerHTML = `${obj.name}`;
//this.expand(element)
}


}});

})},


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

findKeywords(text, keywords) {
const regex = new RegExp(keywords.map(keyword => keyword.name).join("|"), "gi");

return text.replace(regex, match => {
const keyword = keywords.find(kw => kw.name.toLowerCase() === match.toLowerCase());
if (keyword) {
return `<span 
class="extendable"
showHide="hide"
id="${keyword.id}" 
key="${keyword.key}"
style='font-family: SoutaneBlack; color:${keyword.color}'>${match}</span>`;
} else {
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

