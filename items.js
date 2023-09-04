import Ref from "./ref.js";
import NPCs from "./npcs.js";

const Items = {

itemsArray: [],
itemsSearchArray: [],

async loadItemsArray() {

try {
const response = await fetch('items.json'); // Adjust the path if needed
const data = await response.json();
this.itemsArray = data;

return data //.monsters;
} catch (error) {
console.error('Error loading items array:', error);
return [];
}

},   

// Add to Storyteller
addPredictiveObjects() {

Ref.textLocation.addEventListener('input', (event) => {
const text = event.target.value;
const cursorPosition = event.target.selectionStart;

const openBraceIndex = text.lastIndexOf('#', cursorPosition);
if (openBraceIndex !== -1) {
const searchText = text.substring(openBraceIndex + 1, cursorPosition);

const filteredItems = this.itemsArray.filter(item =>
    item.Name.toLowerCase().includes(searchText.toLowerCase())
  );

//Show ExtraContent      
Ref.itemList.style.display = 'block';
Ref.itemList.innerHTML = ''; // Clear existing content

//fixDisplay()
const imageContainer = document.querySelector('.image-container');
const radiantDisplay = document.getElementById('radiantDisplay');
imageContainer.style.width = "45vw";
radiantDisplay.style.width = "45vw";

filteredItems.forEach(item => {
const option = document.createElement('div');
option.textContent = item.Name;
option.addEventListener('click', () => {
const replacement = `#${item.Name}#`;
const newText = text.substring(0, openBraceIndex) + replacement + text.substring(cursorPosition);
event.target.value = newText;
Ref.itemList.style.display = 'none'; // Hide Ref.optionsList
});
Ref.itemList.appendChild(option);
});
} else {

Ref.itemList.style.display = 'none';
Ref.itemList.innerHTML = '';

//fixDisplay()
imageContainer.style.width = "70vw";
radiantDisplay.style.width = "70vw";

}
});

},

getItems(locationText) {
    const hashBrackets = /#([^#]+)#/g;

    return locationText.replace(hashBrackets, (match, itemName) => {
        const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === itemName.toLowerCase());
        if (item) {
            return `<span class="expandable item" data-content-type="item" divId="${item.Name}">${item.Name.toUpperCase()}</span>`;
        } else {
            console.log(`Item not found: ${itemName}`);
            return match;
        }
    });
},
 

extraItem(contentId) {
const hashBrackets = /#([^#]+)#/g;

return contentId.replace(hashBrackets, (match, itemName) => {
const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === itemName.toLowerCase());
if (item) {
console.log(item.Name);
return this.addIteminfo(item.Name);
} else {
console.log(`Item not found: ${itemName}`);
return match;
}
});
},

addIteminfo(contentId) {

const extraContent = document.getElementById('extraContent');

//Search for Item in the Array   
const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === contentId.toLowerCase());

if (item) {

const itemStats = [

`<h2><span class="lime">${contentId.toUpperCase()}</span></h2><br>`,
`${item.Type}<br><br>`,

`<span class="lime">Size:</span> ${item.Size || "None"};<br>`,
`<span class="lime">Weight:</span> ${item.Weight || "None"};<br>`,
`<span class="lime">Cost:</span> ${item.Cost || "None"};<br>`,
`<span class="lime">Damage:</span> ${item.Damage || "None"};<br>`,
`<span class="lime">Range:</span> ${item.Range || "None"};<br>`,
`<span class="lime">Armour Class:</span> ${item.AC || "None"};<br><br>`,
`<span class="lime">Description:</span> <br><br> ${item.Description.replace(/\./g, '.<br><br>')}`,

];

const formattedItem = itemStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the extraContent element
extraContent.innerHTML = formattedItem;

return formattedItem;

} else {
console.log(`Monster not found: ${contentId}`);

}

},

// Edit Items
loadItemsList: function(data) {
const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';

// Get an array of monster names and sort them alphabetically
const itemsNames = Object.keys(data).sort();

// Iterate through the sorted monster names
for (const itemName of itemsNames) {
const item = data[itemName];
const itemNameDiv = document.createElement('div');
itemNameDiv.textContent = `${item.Name} [${item.Type}]`;
itemList.appendChild(itemNameDiv);
this.fillItemsForm(item, itemNameDiv);
}

itemList.style.display = 'block'; // Display the NPC names container

NPCs.fixDisplay();
}, 

fillItemsForm: function(item, itemNameDiv){

// Add click event listener to each NPC name
itemNameDiv.addEventListener('click', () => {

Ref.itemName.value = item.Name;
Ref.itemType.value = item.Type;
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

    const existingItemIndex = this.itemsArray.findIndex(item => item.name === Ref.itemName.value);
    console.log(Ref.itemName.value)

    const item = {

        Name: Ref.itemName.value,
        Type: Ref.itemType.value,
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
    console.log('Item updated:', item);
    } else {
    this.itemsArray.push(item);
    }
    
    },

addItemSearch: function(){

Ref.itemName.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Check if the searchText contains '{'
if (searchText.includes('{')) {
// Remove '{' from the searchText
searchText = searchText.replace('{', '');

// Call the searchMonster function
this.searchItem(searchText);
}
});

},

searchItem: function(searchText){

    this.itemSearchArray = [];
    
    this.itemSearchArray = this.itemsArray.filter((item) => {
    const itemName = item.Name.toLowerCase();
    const itemType = item.Type.toLowerCase();
    
    // Check if either the name or occupation contains the search text
    return itemName.includes(searchText.toLowerCase()) || itemType.includes(searchText.toLowerCase());
    });
    
    this.loadItemsList(this.itemSearchArray);
    
    },


};

export default Items;

