// Import the necessary module
import load from "./load.js";
import ref from "./ref.js";
import editor from "./editor.js";
import NPCs from "./npcs.js";
import helper from "./helper.js";

const expandable = {

    miscArray: [],
    monsterArray:[],

getMisc(locationText, comboArray, color) {
const squareBrackets = /\[([^\]]+)\]\{([^}]+)\}/g;

const matches = [...locationText.matchAll(squareBrackets)];
let updatedText = locationText;

for (const match of matches) {
const square = match[1];
const curly = match[2];

const replacement = `<span class="float" style="color:${color}" data-content-type="misc" divId="${square}">${this.getQuotes(square)}</span>`;

updatedText = updatedText.replace(match[0], replacement);

// Store the square curly combo in the provided array
comboArray.push({ square, curly });

}

return updatedText;
},

getMonsters(locationText) {
const asteriskBrackets = /\*([^*]+)\*/g;
return locationText.replace(asteriskBrackets, (match, targetText) => {
const monster = load.Data.monsters.find(monster => monster.name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return `<span class="expandable monster" data-content-type="monsters" divId="${targetText}">${targetText}</span>`;
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},

getItems(locationText) {
const hashBrackets = /#([^#]+)#/g;

return locationText.replace(hashBrackets, (match, targetText) => {
const item = Object.values(load.Data.items).find(item => item.name.toLowerCase() === targetText.toLowerCase());
if (item) {
return `<span class="expandable" style="color:${item.color}" data-content-type="items" divId="${item.name}">${item.name}</span>`;
} else {
console.log(`Item not found: ${targetText}`);
return match;
}
});
},

getSpells(locationText) {
const tildeBrackets = /~([^~]+)~/g;

return locationText.replace(tildeBrackets, (match, targetText) => {
const spell = Object.values(load.Data.spells).find(spell => spell.name.toLowerCase() === targetText.toLowerCase());
if (spell) {
return `<span class="expandable spell" data-content-type="spells" divId="${spell.name}">${spell.name}</span>`;
} else {
console.log(`Spell not found: ${targetText}`);
return match;
}
});
},

getQuotes(locationText) {
const quotationMarks = /"([^"]+)"/g;

return locationText.replace(quotationMarks, (match, targetText) => {
return `<span class="hotpink">"${targetText}"</span>`;
});
},

addIteminfo(contentId, target) {

//Search for Item in the Array   
const item = Object.values(load.Data.items).find(item => item.name.toLowerCase() === contentId.toLowerCase());
const newCost = helper.standardizeCost(item.cost) + 'Gold Pieces';


if (item) {

//`<span class="expandable" data-content-type="rule" divId="Money"">${foundNPC.class} Skills:</span><br>`

const itemStats = [
`<h2><span class="misc">${contentId}</span></h2>`,
`<h3><span class="expandable" data-content-type="rule" divId="Money">${item.cost ? `(${newCost})` : ''}</span><hr>`,
`<span class="cyan">${item.type}</span>.<br>`,

`${item.size ? `<span class="lime">Size:</span> ${item.size}<br>` : ''}`,
`${item.weight ? `<span class="lime">Weight:</span> ${item.weight} lbs<br>` : ''}`,
`${item.damage ? `<span class="lime">Damage:</span> ${item.damage}<br>` : ''}`,
`${item.range ? `<span class="lime">Range:</span> ${item.range}<br>` : ''}`,
`${item.ac ? `<span class="lime">Armour Class:</span> ${item.ac}<br><br>` : ''}`,
`${item.tags ? `<span class="hotpink">Assigned to:</span> ${item.tags}<br>` : ''}<hr></h3>`,
`${item.description ? ` ${item.description} ` : ''}`,
];


const formattedItem = itemStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

target.innerHTML = formattedItem;


return formattedItem;

} else {
console.log(`Monster not found: ${contentId}`);

}

},

addRulesInfo(contentId, target) {

const rulesItem = this.rulesArray.find(rule => rule.name === contentId);

if (rulesItem) { 
const showRule = [ 

`<h3><span class="misc">${rulesItem.name}</span></h3>
<span class="withbreak">${rulesItem.body}</span>`]

target.innerHTML = showRule;

} else {
console.log(`Rule with name "${contentId}" not found in the rulesArray.`);
}
},

addMiscInfo(contentId, contentStyle, target) {
// console.log('adding...')
const MiscItem = this.miscArray.find(item => item.square === contentId);
const miscDiv = document.createElement('div');

if (MiscItem) {
const withMonsters = expandable.getMonsters(MiscItem.curly);
const withItems = expandable.getItems(withMonsters);
const withSpells = expandable.getSpells(withItems);
const title = helper.proper(MiscItem.square); 
const miscInfo = `
<h2>
<span style=${contentStyle}>
${title}
<hr>
</span>
</h2>
<span class="withbreak">
${withSpells}
<br>
</span>`;

miscDiv.innerHTML = miscInfo;
target.appendChild(miscDiv);
//Ref.Left.style.display = 'none';

} else {
console.log(`Square curly combo with square "${contentId}" not found in the comboArray.`);
}
},

addLocationItems(locationObject){

let locationItems = '';

// Filter itemsArray based on location Name and Tags
const filteredItems = load.Data.items.filter(item => {
const itemTags = item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : [];

// Check if the item matches the criteria
return (
(itemTags.includes(locationObject.divId)) ||
(locationObject.tags && locationObject.tags.split(',').map(tag => tag.trim()).some(tag => itemTags.includes(tag)))
);
});

// Format each item and add to this.inventory
locationItems = filteredItems.map(item => ({
Name: item.Name,
Type: item.Type,
Tag: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).find(tag => 
tag === locationObject.divId || 
(locationObject.tags && locationObject.tags.split(',').map(tag => tag.trim()).some(locTag => locTag === tag))
) : ''
}));

// Sort the inventory alphabetically by item.Tag and then by item.Name
locationItems.sort((a, b) => {
// Compare item.Tag first
if (a.Tag > b.Tag) return 1;
if (a.Tag < b.Tag) return -1;

// If item.Tags are the same, compare item.Type
if (a.Type > b.Type) return 1;
if (a.Type < b.Type) return -1;

// If item.Type are the same, compare item.Name
if (a.Name > b.Name) return 1;
if (a.Name < b.Name) return -1;

return 0; // Both item.Tag and item.Name are equal

});

// Log the names of the items
//console.log(locationItems)
//console.log(locationItems.length !== 0 ? "Location Items:" + JSON.stringify(locationItems) : 'No location Items found.');

return locationItems;
},

showExpandable(source, target) {

const expandableElements = source.querySelectorAll('.expandable');

expandableElements.forEach(element => {

element.addEventListener('click', (event) => {
//console.log('mouseenter')
const contentType = event.target.getAttribute('data-content-type');
const contentId = event.target.getAttribute('divId');

switch (contentType) {
case 'npc':
NPCs.addNPCInfo(contentId, target); // Handle NPCs
break;
// case 'misc':
// this.addMiscInfo(contentId, target);
// break;
case 'rules':
this.addRulesInfo(contentId, target);
break;
default:
//for monsters, spells, items, etc.
//1. Find the Obj.
const contentIdLowercase = contentId.toLowerCase();
const obj = load.Data[contentType].find(obj => obj.name.toLowerCase() === contentIdLowercase);
editor.createForm(obj);
}          

//target.style.display = "block";
this.showExtraExpandable(ref.Left); 

});

// Ref.Centre.addEventListener('mouseenter', () => {
// Ref.Left.style.display = 'none';

// });
});
},

showExtraExpandable(target) {

const expandableElements = ref.Centre.querySelectorAll('.expandable');

expandableElements.forEach(element => {

element.addEventListener('mouseenter', (event) => {

const contentType = event.target.getAttribute('data-content-type');
const contentId = event.target.getAttribute('divId');

switch (contentType) {
case 'npc':
NPCs.addNPCInfo(contentId, target); // Handle NPCs
break;
case 'monster':
expandable.addMonsterInfo(contentId, target); // Handle Monsters
break;
case 'item':
Items.addIteminfo(contentId, target); // Handle Items
break;
case 'spell':
editor.addInfo(contentId, target); // Handle Spells
break;
// case 'misc':
// this.addMiscInfo(contentId, target); //Handle Misc
// break;
// case 'rule':
// this.addRulesInfo(contentId, target); //Handle Rule
// break;
default:
console.log('Unknown content type');
}        

target.style.display = "block";
this.showFloatingExpandable();

});   

});

},

showFloatingExpandable() {
const expandableElements = document.querySelectorAll('.float');
const expandableElementsCentre = ref.Centre.querySelectorAll('.float');
// const expandableElements = [...expandableElementsLeft, ...expandableElementsCentre];


expandableElements.forEach(element => {

element.addEventListener('click', (event) => {

const contentType = event.target.getAttribute('data-content-type');
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
case 'npc':
NPCs.addNPCInfo(contentId, contentStyle, floatingBox); // Handle NPCs
break;
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




};

export default expandable;

