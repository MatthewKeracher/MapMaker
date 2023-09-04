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
console.log(this.itemsArray)
return data //.monsters;
} catch (error) {
console.error('Error loading items array:', error);
return [];
}

},   

// Add to Storyteller
addPredictiveMonsters() {

Ref.textLocation.addEventListener('input', (event) => {
const text = event.target.value;
const cursorPosition = event.target.selectionStart;

const openBraceIndex = text.lastIndexOf('*', cursorPosition);
if (openBraceIndex !== -1) {
const searchText = text.substring(openBraceIndex + 1, cursorPosition);

const filteredMonsters = Object.keys(this.monstersArray).filter(monsterName =>
monsterName.toLowerCase().includes(searchText.toLowerCase())
);

//Show ExtraContent      
Ref.itemList.style.display = 'block';
Ref.itemList.innerHTML = ''; // Clear existing content

//fixDisplay()
const imageContainer = document.querySelector('.image-container');
const radiantDisplay = document.getElementById('radiantDisplay');
imageContainer.style.width = "45vw";
radiantDisplay.style.width = "45vw";

filteredMonsters.forEach(monsterName => {
const option = document.createElement('div');
option.textContent = monsterName;
option.addEventListener('click', () => {
const replacement = `*${monsterName}*`;
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

getMonsters(locationText) {
const asteriskBrackets = /\*([^*]+)\*/g;

return locationText.replace(asteriskBrackets, (match, monsterName) => {
console.log(monsterName)
if (this.monstersArray[monsterName]) {
return `<span class="expandable monster" data-content-type="monster" divId="${monsterName}">${monsterName.toUpperCase()}</span>`;
} else {
console.log(`Monster not found: ${monsterName}`);
return match;
}
});
},

extraMonsters(contentId) {
const asteriskBrackets = /\*([^*]+)\*/g;

return contentId.replace(asteriskBrackets, (match, monsterName) => {
if (this.monstersArray[monsterName]) {
return this.addMonsterInfo(monsterName);
} else {
console.log(`Monster not found: ${monsterName}`);
return match;
}
});
},

addMonsterInfo(contentId) {

const extraContent = document.getElementById('extraContent');

//Search for Monster in the Array   
const monster = this.monstersArray[contentId]; 

if (monster) {

const monsterStats = [

`<h2><span class="hotpink">${contentId.toUpperCase()}</span></h2><br>`,
`${monster.Type}<br><br>`,

`<span class="hotpink"># App:</span> ${monster.Appearing};<br>`,
`<span class="hotpink">Morale:</span> ${monster.Morale};<br>`,
`<span class="hotpink">Movement:</span> ${monster.Mvmt};<br>`,
`<span class="hotpink">Armour Class:</span> ${monster.AC};<br>`,
`<span class="hotpink">Hit Dice:</span> ${monster.HD};<br>`,
`<span class="hotpink">Hit Dice Range:</span> ${monster.HDSort};<br>`,
`<span class="hotpink">No. Attacks:</span> ${monster.Attacks};<br>`,
`<span class="hotpink">Damage:</span> ${monster.Damage};<br>`,          
`<span class="hotpink">Special:</span> ${monster.Special || "None"};<br>`,
`<span class="hotpink">Save As:</span> ${monster["Save As "]};<br>`,
`<span class="hotpink">Treasure:</span> ${monster.Treasure || "None"};<br>`,
`<span class="hotpink">Experience Points:</span> ${monster.XP};<br><br> `,
`<span class="hotpink">Description:</span> <br><br> ${monster.Description.replace(/\./g, '.<br><br>')}`,

];

const formattedMonster = monsterStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the extraContent element
extraContent.innerHTML = formattedMonster;

return formattedMonster;

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

