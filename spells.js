import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Array from "./array.js";

const Spells = {

spellsArray: [],
spellsSearchArray: [],

//Load the Array
async loadSpellsArray() {

try {
const response = await fetch('spells.json'); // Adjust the path if needed
const data = await response.json();
this.spellsArray = data;

const noKeys = Array.extractValues(data);
this.spellsArray = noKeys;
console.log(this.spellsArray);

return data //.monsters;
} catch (error) {
console.error('Error loading spells array:', error);
return [];
}

},   

//Add to Storyteller

//addPredictive Items is now with addPredictive Monsters


getItems(locationText) {
    const hashBrackets = /#([^#]+)#/g;

    return locationText.replace(hashBrackets, (match, targetText) => {
        const item = Object.values(this.spellsArray).find(item => item.Name.toLowerCase() === targetText.toLowerCase());
        if (item) {
            return `<span class="expandable item" data-content-type="item" divId="${item.Name}">${item.Name.toUpperCase()}</span>`;
        } else {
            console.log(`Item not found: ${targetText}`);
            return match;
        }
    });
},
 

extraItem(contentId) {
const hashBrackets = /#([^#]+)#/g;

return contentId.replace(hashBrackets, (match, targetText) => {
const item = Object.values(this.spellsArray).find(item => item.Name.toLowerCase() === targetText.toLowerCase());
if (item) {
console.log(item.Name);
return this.addIteminfo(item.Name);
} else {
console.log(`Item not found: ${targetText}`);
return match;
}
});
},

addIteminfo(contentId, target) {

let targetLocation = '';

if(target === 'ExtraContent'){
targetLocation = Ref.extraContent
} else {
targetLocation = Ref.extraContent2
}

//Search for Item in the Array   
const item = Object.values(this.spellsArray).find(item => item.Name.toLowerCase() === contentId.toLowerCase());

if (item) {

const itemStats = [

`<hr><h3><span class="lime">${contentId.toUpperCase()}</span></h3>`,
`${item.Type}.<br><br>`,

`<span class="lime">Size:</span> ${item.Size || "None"};<br>`,
`<span class="lime">Weight:</span> ${item.Weight || "None"};<br>`,
`<span class="lime">Cost:</span> ${item.Cost || "None"};<br>`,
`<span class="lime">Damage:</span> ${item.Damage || "None"};<br>`,
`<span class="lime">Range:</span> ${item.Range || "None"};<br>`,
`<span class="lime">Armour Class:</span> ${item.AC || "None"};<br><br>`,
`<span class="lime">Description:</span> <br><br> ${item.Description || "None"}`,

];

const formattedItem = itemStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the extraContent element
targetLocation.innerHTML = formattedItem;

return formattedItem;

} else {
console.log(`Monster not found: ${contentId}`);

}

},

loadSpellsList: function(data) {
    const itemList = document.getElementById('itemList'); // Do not delete!!
  
    // Clear the existing content
    itemList.innerHTML = '';
  
    // Sort the items by item type alphabetically
    //const sortedItems = data.slice().sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));
  
    // Iterate through the sorted spells
    for (const spell of data) {
      const spellNameDiv = document.createElement('div');
      spellNameDiv.innerHTML = `[${spell.Class} ${spell.Level}] <span class="yellow">${spell.Name}</span>`;
      itemList.appendChild(spellNameDiv);
      this.fillSpellsForm(spell, spellNameDiv);
    }
  
    itemList.style.display = 'block'; // Display the container
  
    NPCs.fixDisplay();
  },
  

  fillSpellsForm: function(spell, spellNameDiv){

// Add click event listener to each NPC name
spellNameDiv.addEventListener('click', () => {

Ref.spellName.value = spell.Name;
Ref.spellClass.value = spell.Class;
Ref.spellLevel.value = spell.Level;
Ref.spellDescription.value = spell.Description;
Ref.spellReverse.value = spell.Reverse;
Ref.spellNote.value = spell.Note;
Ref.spellRange.value = spell.Range;
Ref.spellDuration.value = spell.Duration;


Ref.spellsForm.style.display = 'flex'; // Display the itemForm
});

},

saveSpell: function() {

    const existingItemIndex = this.spellsArray.findIndex(spell => spell.Name === Ref.spellName.value);
    console.log(Ref.spellName.value)

    const item = {

        Name: Ref.spellName.value,
        Class: Ref.spellClass.value,
        Level: Ref.spellLevel.value,
        Description: Ref.spellDescription.value,
        Reverse: Ref.spellReverse.value,
        Note: Ref.spellNote.value,
        Range: Ref.spellRange.value,
        Duration: Ref.spellDuration.value       

    };
    
    if (existingItemIndex !== -1) {
    // Update the existing Spell entry
    this.spellsArray[existingItemIndex] = item;
    console.log('Item updated:', item);
    } else {
    this.spellsArray.push(item);
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
    
    this.itemSearchArray = this.spellsArray.filter((item) => {
    const itemName = item.Name.toLowerCase();
    const itemType = item.Type.toLowerCase();
    
    // Check if either the name or occupation contains the search text
    return itemName.includes(searchText.toLowerCase()) || itemType.includes(searchText.toLowerCase());
    });
    
    this.loadItemsList(this.itemSearchArray);
    
    },


};

export default Spells;

