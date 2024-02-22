import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Array from "./array.js";
import Spells from "./spells.js";
import load from "./load.js";

const Items = {

itemsArray: [],
itemsSearchArray: [],

//addPredictive Items is now with addPredictive Monsters

getItems(locationText) {
const hashBrackets = /#([^#]+)#/g;

return locationText.replace(hashBrackets, (match, targetText) => {
const item = Object.values(load.Data.items).find(item => item.name.toLowerCase() === targetText.toLowerCase());
if (item) {
return `<span class="expandable item" data-content-type="item" divId="${item.name}">${item.name}</span>`;
} else {
console.log(`Item not found: ${targetText}`);
return match;
}
});
},

extraItem(contentId) {
const hashBrackets = /#([^#]+)#/g;

return contentId.replace(hashBrackets, (match, targetText) => {
const item = Object.values(this.itemsArray).find(item => item.name.toLowerCase() === targetText.toLowerCase());
if (item) {
//console.log(item.name);
return this.addIteminfo(item.name, Ref.Left);
} else {
console.log(`Item not found: ${targetText}`);
return match;
}
});
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

addIteminfo(contentId, target) {

//Search for Item in the Array   
const item = Object.values(load.Data.items).find(item => item.name.toLowerCase() === contentId.toLowerCase());
const newCost = this.standardizeCost(item.cost) + 'Gold Pieces';


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

showHide: function (section, subsection, nameDivId) {

   
    
    let items
    
    if (subsection === 'header'){ //has clicked on a sectionHeading
    
    items = document.querySelectorAll(`[section="${section}"]`);

    items.forEach((item, index) => {

    if(index > 0){ 

        const sectionShow = item.getAttribute('sectionShow');
    
        const newSectionShow = sectionShow === 'true'? 'false' : 'true';
        item.setAttribute('sectionShow', newSectionShow); 
       
        const sectionDisplay = newSectionShow === 'true'? 'block' : 'none';
        item.style.display = sectionDisplay;

        //if(newSectionShow === 'true'){console.log('Now Showing')}else{console.log('Now Hiding.')};

        //reset all subSectionShows

        item.setAttribute('subSectionShow', "true");

}})}
    
    else if(subsection){ //has clicked on a subSection
   
    items = document.querySelectorAll(`[section="${section}"][subsection="${subsection}"]`);

    items.forEach((item, index) => {

        if(index > 0){ 

            const subSectionShow = item.getAttribute('subSectionShow');
            
            const newSubShow = subSectionShow === 'true'? 'false' : 'true'; 
            item.setAttribute('subSectionShow', newSubShow);
    
            const subSectionDisplay = newSubShow === 'true'? 'block' : 'none';
            item.style.display = subSectionDisplay;

            //if(newSubShow === 'true'){console.log('Now Showing')}else{console.log('Now Hiding.')};

    
        }})}   
    
},


fillItemsForm: function(item, itemNameDiv){

// Add click item listener to each NPC name
itemNameDiv.addEventListener('click', () => {

//itemNameDiv.innerHTML = `[${item.Type}]<span class="cyan">${item.Name}</span>`;

Ref.itemId.value = item.id;
Ref.itemName.value = item.name;
Ref.itemType.value = item.type;
Ref.itemTags.value = item.tags;
Ref.itemSize.value = item.size;
Ref.itemWeight.value = item.weight;
Ref.itemCost.value = item.cost;
Ref.itemDamage.value = item.damage;
Ref.itemRange.value = item.range;
Ref.itemAC.value = item.ac;
Ref.itemDescription.value = item.description;

Ref.itemForm.style.display = 'flex'; // Display the itemForm
});

},

saveItem: function() {

const existingItemIndex = this.itemsArray.findIndex(item => item.name === Ref.itemName.value);

const item = {

id: Ref.itemId.value,
name: Ref.itemName.value,
type: Ref.itemType.value,
tags: Ref.itemTags.value,
size: Ref.itemSize.value,
weight: Ref.itemWeight.value,
cost: Ref.itemCost.value,
damage: Ref.itemDamage.value,
range: Ref.itemRange.value,
ac: Ref.itemAC.value,
description: Ref.itemDescription.value

};

if (existingItemIndex !== -1) {
// Update the existing NPC entry
this.itemsArray[existingItemIndex] = item;
//this.itemsSearchArray[existingItemIndex] = item;
//console.log('Item updated:', item);
} else if (existingItemIndex === -1 && Ref.itemName.value === '' && Ref.itemTags !== ''){
console.log('Change all Selected Items Tags')
this.bulkAddTag(Ref.itemTags.value)
} else {
this.itemsArray.push(item);
//this.itemsSearchArray.push(item);
}

},

bulkAddTag(itemTags){

// Iterate over itemsSearchArray and update Tags
this.itemsSearchArray.forEach(item => {
if (item.tags) {
// Split existing Tags into an array
const existingTags = item.tags.split(',').map(tag => tag.trim());

// Check if the new tag is not already present
if (!existingTags.includes(itemTags)) {
// If not present, append the new tag value
item.tags += `, ${itemTags}`;
}
} else {
// If Tags is empty, set it to the new tag value
item.tags = itemTags;
}
});

},

addItemSearch: function(){

// Ref.itemSearch.addEventListener('input', (item) => {
// let searchText = item.target.value.toLowerCase();

// // Call the searchItem function
// this.searchItem(searchText);

// });

},

searchItem: function(searchText) {
this.itemsSearchArray = [];

this.itemsSearchArray = this.itemsArray.filter((item) => {
const itemName = item.name.toLowerCase();
const itemType = item.type.toLowerCase();
const itemTags = item.tags ? item.Tags.toLowerCase() : '';

// Check if either the name or tags contains the search text
return itemName.includes(searchText.toLowerCase()) || itemType.includes(searchText.toLowerCase()) || itemTags.includes(searchText.toLowerCase());
});
//console.log('searching for... ' + searchText)
editor.loadList(this.itemsSearchArray, "Items");
},


};

export default Items;

