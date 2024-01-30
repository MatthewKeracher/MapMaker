import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Array from "./array.js";

const Spells = {

spellsArray: [],
spellsSearchArray: [],

async loadSpellsArray() {
    try {
        const response = await fetch('spells.json'); // Adjust the path if needed
        const rawData = await response.json();

        // Store the raw data if needed
        this.rawSpellsArray = rawData;

        // Extract values and assign to this.spellsArray
        const noKeys = Array.extractValues(rawData);
        this.spellsArray = noKeys;

        // Uncomment the following line if you want to log the extracted spellsArray
        // console.log(this.spellsArray);

        return this.spellsArray;
    } catch (error) {
        console.error('Error loading spells array:', error);
        return [];
    }
}, 

//Add to Storyteller

//addPredictive Items is now with addPredictive Monsters

getSpells(locationText) {
const tildeBrackets = /~([^~]+)~/g;

return locationText.replace(tildeBrackets, (match, targetText) => {
const spell = Object.values(this.spellsArray).find(spell => spell.Name.toLowerCase() === targetText.toLowerCase());
if (spell) {
return `<span class="expandable spell" data-content-type="spell" divId="${spell.Name}">${spell.Name}</span>`;
} else {
console.log(`Spell not found: ${targetText}`);
return match;
}
});
},

extraSpell(contentId) {
const tildeBrackets = /~([^~]+)~/g;

return contentId.replace(tildeBrackets, (match, targetText) => {
const spell = Object.values(this.spellsArray).find(spell => spell.Name.toLowerCase() === targetText.toLowerCase());
if (spell) {
console.log(spell.Name);
return this.addSpellInfo(spell.Name);
} else {
console.log(`Spell not found: ${targetText}`);
return match;
}
});
},

addSpellInfo(contentId, target) {

//Search for Spell in the Array   
const spell = Object.values(this.spellsArray).find(spell => spell.Name.toLowerCase() === contentId.toLowerCase());

if (spell) {

const spellStats = [

`<h2><span class="spell">${contentId}</span></h2>`,
`<h3><span class = "cyan">${spell.Class} Level ${spell.Level}.</span><hr>`,

`${spell.Range ?        `<span class="spell">Range:</span>       ${spell.Range}      <br>` : ''}`,
`${spell.Duration ?     `<span class="spell">Duration:</span>    ${spell.Duration}   <br><hr>` : ''} </h3>`,
`${spell.Description ?  `<span class="spell">Description:</span> ${spell.Description} <br><br>` : ''}`,
`${spell.Reverse ?      `<span class="spell">Reverse:</span>     ${spell.Reverse}    <br><br>` : ''}`,
`${spell.Note ?         `<span class="spell">Note:</span>        ${spell.Note}       <br><br>` : ''} `,

// `<span class="spell">Duration:</span>  ${spell.Duration || "None"} <br><br> `,
// `<span class="spell">Description:</span> <br><br> ${spell.Description || "None"};<br><br> `,
// `<span class="spell">Reverse:</span> ${spell.Reverse || "None"};<br><br> `,
// `<span class="spell">Note:</span> ${spell.Note || "None"}; </h3>`,

];

const formattedItem = spellStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the Centre element
target.innerHTML = formattedItem;

return formattedItem;

} else {
console.log(`Monster not found: ${contentId}`);

}

},

loadSpellsList: function(data) {
const Centre = document.getElementById('Centre'); // Do not delete!!

// Clear the existing content
Centre.innerHTML = '';

// Sort the items by item type alphabetically
//const sortedItems = data.slice().sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));

// Iterate through the sorted spells
for (const spell of data) {
const spellNameDiv = document.createElement('div');
spellNameDiv.id = spell.Name
spellNameDiv.innerHTML = `[${spell.Class} ${spell.Level}]<span class="yellow">${spell.Name}</span>`;
Centre.appendChild(spellNameDiv);
this.fillSpellsForm(spell, spellNameDiv);

 //show Item info in Left when hover over Div
 spellNameDiv.addEventListener('mouseover', () => {
    Ref.Left.classList.add('showLeft');
    this.addSpellInfo(spellNameDiv.id, Ref.Left);
    });
}

Centre.style.display = 'block'; // Display the container


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

addSpellSearch: function(){

Ref.spellName.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Check if the searchText contains '{'
if (searchText.includes('{')) {
// Remove '{' from the searchText
searchText = searchText.replace('{', '');

// Call the searchMonster function
this.searchSpell(searchText);
}
});

},

searchSpell: function(searchText){

this.spellsSearchArray = [];

this.spellsSearchArray = this.spellsArray.filter((spell) => {
const spellName = spell.Name.toLowerCase();
const spellClass = spell.Class.toLowerCase();
const spellLevel = spell.Level.toLowerCase();

// Check if either the name or tags contains the search text
return spellName.includes(searchText.toLowerCase()) || spellClass.includes(searchText.toLowerCase());
});

this.loadSpellsList(this.spellsSearchArray);

},


};

export default Spells;

