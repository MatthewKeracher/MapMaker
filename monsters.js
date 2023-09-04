import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Items from "./items.js";

const Monsters = {

monstersArray: [],

async loadMonstersArray() {

try {
const response = await fetch('monsters.json'); // Adjust the path if needed
const data = await response.json();
this.monstersArray = data;
return data //.monsters;
} catch (error) {
console.error('Error loading monster array:', error);
return [];
}

},   

addPredictiveContent() {
    Ref.textLocation.addEventListener('input', (event) => {
      const text = event.target.value;
      const cursorPosition = event.target.selectionStart;
  
      const openBraceIndex = text.lastIndexOf('#', cursorPosition);
      const openAsteriskIndex = text.lastIndexOf('*', cursorPosition);
  
      if (openBraceIndex !== -1 || openAsteriskIndex !== -1) {
        let searchText;
        let filteredItems;
  
        if (openBraceIndex > openAsteriskIndex) {
          searchText = text.substring(openBraceIndex + 1, cursorPosition);
          filteredItems = Items.itemsArray.filter(item =>
            item.Name.toLowerCase().includes(searchText.toLowerCase())
          );
        } else {
          searchText = text.substring(openAsteriskIndex + 1, cursorPosition);
          filteredItems = Object.keys(this.monstersArray).filter(monsterName =>
            monsterName.toLowerCase().includes(searchText.toLowerCase())
          );
        }
  
        // Show ExtraContent
        Ref.itemList.style.display = 'block';
        Ref.itemList.innerHTML = ''; // Clear existing content
  
        // fixDisplay()
        const imageContainer = document.querySelector('.image-container');
        const radiantDisplay = document.getElementById('radiantDisplay');
        imageContainer.style.width = "45vw";
        radiantDisplay.style.width = "45vw";
  
        filteredItems.forEach(item => {
          const option = document.createElement('div');
          option.textContent = item.Name || item; // Use "Name" property if available
          option.addEventListener('click', () => {
            const replacement = openBraceIndex !== -1
              ? `#${item.Name}#`
              : `*${item}*`;
            const newText = text.substring(0, openBraceIndex !== -1 ? openBraceIndex : openAsteriskIndex) + replacement + text.substring(cursorPosition);
            event.target.value = newText;
            Ref.itemList.style.display = 'none'; // Hide Ref.optionsList
          });
          Ref.itemList.appendChild(option);
        });
      } else {
        Ref.itemList.style.display = 'none';
        Ref.itemList.innerHTML = '';
  
        // fixDisplay()
        const imageContainer = document.querySelector('.image-container');
        const radiantDisplay = document.getElementById('radiantDisplay');
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

// Edit Monsters
loadMonsterList: function(data) {
const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';

// Get an array of monster names and sort them alphabetically
const monsterNames = Object.keys(data).sort();

// Iterate through the sorted monster names
for (const monsterName of monsterNames) {
const monster = data[monsterName];
const monsterNameDiv = document.createElement('div');
monsterNameDiv.textContent = `${monster.Name} [${monster.Type}]`;
itemList.appendChild(monsterNameDiv);
this.fillMonsterForm(monster, monsterNameDiv);
}

itemList.style.display = 'block'; // Display the NPC names container

NPCs.fixDisplay();
}, 

fillMonsterForm: function(monster, monsterNameDiv){

// Add click event listener to each NPC name
monsterNameDiv.addEventListener('click', () => {

Ref.monsterName.value = monster.Name;
Ref.monsterType.value = monster.Type;

Ref.monsterAppearing.value = monster.NoApp;
Ref.monsterMorale.value = monster.Morale;

Ref.monsterMovement.value = monster.Movement;
Ref.monsterAC.value = monster.AC;

Ref.monsterHD.value = monster.HD;
Ref.monsterHDRange.value = monster.HDSort;

Ref.monsterAttacks.value = monster.Attacks;
Ref.monsterDamage.value = monster.Damage;
Ref.monsterSpecial.value = monster.Special;  
Ref.monsterSaveAs.value = monster.SaveAs; 
Ref.monsterTreasure.value = monster.Treasure; 
Ref.monsterXP.value = monster.XP; 

Ref.monsterDescription.value = monster.Description; 

Ref.monsterForm.style.display = 'flex'; // Display the monsterForm
});

},

saveMonster: function() {
// Get the monster name from the form
const monsterName = Ref.monsterName.value;

const monster = {
Name: monsterName,
Type: Ref.monsterType.value,
NoApp: Ref.monsterAppearing.value,
Morale: Ref.monsterMorale.value,
Movement: Ref.monsterMovement.value,
AC: Ref.monsterAC.value,
HD: Ref.monsterHD.value,
HDSort: Ref.monsterHDRange.value,
Attacks: Ref.monsterAttacks.value,
Damage: Ref.monsterDamage.value,
Special: Ref.monsterSpecial.value,
SaveAs: Ref.monsterSaveAs.value,
Treasure: Ref.monsterTreasure.value,
XP: Ref.monsterXP.value,
Description: Ref.monsterDescription.value
};

// Check if the monster already exists by name
if (this.monstersArray.hasOwnProperty(monsterName)) {
// Update the existing monster entry
this.monstersArray[monsterName] = monster;
console.log('Monster updated:', monster);
} else {
// Add the created monster to the monstersArray
this.monstersArray[monsterName] = monster;
console.log('New Monster added:', monster);
}
},

addMonsterSearch: function(){

Ref.monsterName.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Check if the searchText contains '{'
if (searchText.includes('{')) {
// Remove '{' from the searchText
searchText = searchText.replace('{', '');

// Call the searchMonster function
this.searchMonster(searchText);
}
});

},

searchMonster: function(searchText) {
this.monsterSearchObject = {};

for (const monsterName in this.monstersArray) {
if (Object.hasOwnProperty.call(this.monstersArray, monsterName)) {
const monster = this.monstersArray[monsterName];
const monsterNameLower = monster.Name.toLowerCase();
const monsterTypeLower = monster.Type.toLowerCase();

if (monsterNameLower.includes(searchText.toLowerCase()) || monsterTypeLower.includes(searchText.toLowerCase())) {
this.monsterSearchObject[monsterName] = monster;
}
}
}

this.loadMonsterList(this.monsterSearchObject);
},


};

export default Monsters;

