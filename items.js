import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Array from "./array.js";

const Items = {

itemsArray: [],
itemsSearchArray: [],

//Load the Array
async loadItemsArray() {

try {
const response = await fetch('items.json'); // Adjust the path if needed
const data = await response.json();
this.itemsArray = data;

const noKeys = Array.extractValues(data);
this.itemsArray = noKeys;

return data //.monsters;
} catch (error) {
console.error('Error loading items array:', error);
return [];
}

},   

//Add to Storyteller

//addPredictive Items is now with addPredictive Monsters

getItems(locationText) {
const hashBrackets = /#([^#]+)#/g;

return locationText.replace(hashBrackets, (match, targetText) => {
const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === targetText.toLowerCase());
if (item) {
return `<span class="expandable item" data-content-type="item" divId="${item.Name}">${item.Name}</span>`;
} else {
console.log(`Item not found: ${targetText}`);
return match;
}
});
},

extraItem(contentId) {
const hashBrackets = /#([^#]+)#/g;

return contentId.replace(hashBrackets, (match, targetText) => {
const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === targetText.toLowerCase());
if (item) {
//console.log(item.Name);
return this.addIteminfo(item.Name, Ref.Left);
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
const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === contentId.toLowerCase());
const newCost = this.standardizeCost(item.Cost) + 'Gold Pieces';


if (item) {

//`<span class="expandable" data-content-type="rule" divId="Money"">${foundNPC.class} Skills:</span><br>`

const itemStats = [
`<h2><span class="misc">${contentId}</span></h2>`,
`<h3><span class="expandable" data-content-type="rule" divId="Money">${item.Cost ? `(${newCost})` : ''}</span><hr>`,
`<span class="cyan">${item.Type}</span>.<br>`,

`${item.Size ? `<span class="lime">Size:</span> ${item.Size}<br>` : ''}`,
`${item.Weight ? `<span class="lime">Weight:</span> ${item.Weight} lbs<br>` : ''}`,
`${item.Damage ? `<span class="lime">Damage:</span> ${item.Damage}<br>` : ''}`,
`${item.Range ? `<span class="lime">Range:</span> ${item.Range}<br>` : ''}`,
`${item.AC ? `<span class="lime">Armour Class:</span> ${item.AC}<br><br>` : ''}`,
`${item.Tags ? `<span class="hotpink">Assigned to:</span> ${item.Tags}<br>` : ''}<hr></h3>`,
`${item.Description ? ` ${item.Description} ` : ''}`,
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

showHide: function (section, subsection) {

     if (section && subsection){

        if (subsection === 'header'){

        const sectionItems = document.querySelectorAll(`[section="${section}"]`);

        sectionItems.forEach((item, index) => {
        const displayStyle = sectionItems[1].style.display;
        item.style.display = index === 0 ? 'block' : 
        (index === 1 ? (displayStyle === 'block' ? 'none' : 'block') : displayStyle);

        })

        }else{

        const subSectionItems = document.querySelectorAll(`[section="${section}"][subsection="${subsection}"]`);
        
        subSectionItems.forEach((item, index) => {
            item.style.display = index === 0 ? 'block' : item.style.display === 'none' ? 'block' : 'none';
        });

        }} else if(!subsection){

        const sectionItems = document.querySelectorAll(`[section="${section}"]`);
    
        sectionItems.forEach((item, index) => {
            item.style.display = index === 0 ? 'block' : item.style.display === 'none' ? 'block' : 'none';
        });


        }
},

loadItemsList: function(data) {
Ref.Centre.innerHTML = '';
Ref.Centre.style.display = 'block'; 

// 1. Sort the items by item type alphabetically.
data = data.slice().sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));

// 2. Attach Section Heads.
data = data.reduce((result, currentItem, index, array) => {
const reversedArray = array.slice(0, index).reverse();
const lastItemIndex = reversedArray.findIndex(item => item.Type === currentItem.Type);

if (lastItemIndex === -1 || currentItem.Type !== reversedArray[lastItemIndex].Type) {
result.push({name: currentItem.Type, sectionHead: true});
}
result.push(currentItem);
return result;
}, []);

let currentSection = 0; // Keep track of the current section.

// 3. Iterate through the sorted items.
for (const item of data) {
const itemNameDiv = document.createElement('div');

if(item.sectionHead){

itemNameDiv.id = item.name;
currentSection++

itemNameDiv.innerHTML = `<hr><span section=${currentSection} class="cyan">${item.name}</span>`;
Ref.Centre.appendChild(itemNameDiv);

itemNameDiv.addEventListener('click', ((section) => {
    return () => {
        this.showHide(section);
    };
})(currentSection));

}else if(item.Type){

itemNameDiv.id = item.Name;

// Check if item.Tags is included in Ref.itemSearch.value
const tagsIncluded = item.Tags ? item.Tags.toLowerCase().includes(Ref.itemSearch.value.toLowerCase()) : false;

// Apply lime or gray class based on the result
const className = tagsIncluded ? 'lime' : 'gray'
itemNameDiv.innerHTML = `<span section=${currentSection} class="${className}" style="display: none;">&nbsp;&nbsp;${item.Name}</span>`;

Ref.Centre.appendChild(itemNameDiv);

//Set div behaviours.
this.fillItemsForm(item, itemNameDiv);

itemNameDiv.addEventListener('mouseover', () => {
Ref.Left.classList.add('showLeft');
this.addIteminfo(itemNameDiv.id, Ref.Left);
});

} else{

    itemNameDiv.id = item.Name;
    
    // Check if item.Tags is included in Ref.itemSearch.value
    const tagsIncluded = item.Tags ? item.Tags.toLowerCase().includes(Ref.itemSearch.value.toLowerCase()) : false;
    
    // Apply lime or gray class based on the result
    const className = tagsIncluded ? 'lime' : 'gray'
    itemNameDiv.innerHTML = `<span section=${currentSection} class="${className}">&nbsp;&nbsp;${item.Name}</span>`;
    
    Ref.Centre.appendChild(itemNameDiv);
    
    //Set div behaviours.
    this.fillItemsForm(item, itemNameDiv);
    
    itemNameDiv.addEventListener('mouseover', () => {
    Ref.Left.classList.add('showLeft');
    this.addIteminfo(itemNameDiv.id, Ref.Left);
    });
    
    }}},

fillItemsForm: function(item, itemNameDiv){

// Add click item listener to each NPC name
itemNameDiv.addEventListener('click', () => {

//itemNameDiv.innerHTML = `[${item.Type}]<span class="cyan">${item.Name}</span>`;

Ref.itemId.value = item.id;
Ref.itemName.value = item.Name;
Ref.itemType.value = item.Type;
Ref.itemTags.value = item.Tags;
Ref.itemSize.value = item.Size;
Ref.itemWeight.value = item.Weight;
Ref.itemCost.value = item.Cost;
Ref.itemDamage.value = item.Damage;
Ref.itemRange.value = item.Range;
Ref.itemAC.value = item.AC;
Ref.itemDescription.value = item.Description;

Ref.itemForm.style.display = 'flex'; // Display the itemForm
});

},

saveItem: function() {

const existingItemIndex = this.itemsArray.findIndex(item => item.Name === Ref.itemName.value);

const item = {

id: Ref.itemId.value,
Name: Ref.itemName.value,
Type: Ref.itemType.value,
Tags: Ref.itemTags.value,
Size: Ref.itemSize.value,
Weight: Ref.itemWeight.value,
Cost: Ref.itemCost.value,
Damage: Ref.itemDamage.value,
Range: Ref.itemRange.value,
AC: Ref.itemAC.value,
Description: Ref.itemDescription.value

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
if (item.Tags) {
// Split existing Tags into an array
const existingTags = item.Tags.split(',').map(tag => tag.trim());

// Check if the new tag is not already present
if (!existingTags.includes(itemTags)) {
// If not present, append the new tag value
item.Tags += `, ${itemTags}`;
}
} else {
// If Tags is empty, set it to the new tag value
item.Tags = itemTags;
}
});

},

addItemSearch: function(){

Ref.itemSearch.addEventListener('input', (item) => {
let searchText = item.target.value.toLowerCase();

// Call the searchItem function
this.searchItem(searchText);

});

},

searchItem: function(searchText) {
this.itemsSearchArray = [];

this.itemsSearchArray = this.itemsArray.filter((item) => {
const itemName = item.Name.toLowerCase();
const itemType = item.Type.toLowerCase();
const itemTags = item.Tags ? item.Tags.toLowerCase() : '';

// Check if either the name or tags contains the search text
return itemName.includes(searchText.toLowerCase()) || itemType.includes(searchText.toLowerCase()) || itemTags.includes(searchText.toLowerCase());
});
//console.log('searching for... ' + searchText)
this.loadItemsList(this.itemsSearchArray);
},


};

export default Items;

