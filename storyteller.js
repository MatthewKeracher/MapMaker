import Array from "./array.js";
import Ambience from "./ambience.js";
import Monsters from "./monsters.js";
import NPCs from "./npcs.js";
import Edit from "./edit.js";

const Storyteller = {

async changeContent(location) {
//TAKE LOCATION NAME
const divId = location.id;

const locationName     = document.querySelector('.locationLabel');
const editLocationName = document.querySelector('.editLocationName');
const MorningLocation = document.getElementById('MorningLocation')

const Storyteller      = document.getElementById('Storyteller');

const editPlayerText   = document.getElementById('editPlayerText');
const editGMText       = document.getElementById('editGMText');
const editMiscText     = document.getElementById('editMiscText');

//CHANGE CONTENT - SIDEBAR TITLES
locationName.textContent = divId;
editLocationName.value   = divId;

//CHANGE CONTENT IN NPCFORM
//MorningLocation.value = divId;

//USE TITLE TO FIND REST OF DATA
const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);

if (matchingEntry) {

//CUT RETURNED DATA INTO CHUNKS  
const player = matchingEntry.player;
const gm = matchingEntry.gm;
const misc = matchingEntry.misc;
const spreadsheet = matchingEntry.spreadsheetData;

//GET AMBIENCE MAIN FROM DROPDOWN
const mainSelect = document.getElementById("mainAmbienceDropdown").value;

//GET AMBIENCE SECOND FROM CLOCK

//Let Time Pass
Ambience.clock();

//Morning [0], Afternoon [1], Night [2]
const allPhases = document.getElementById("secondAmbienceDropdown"); 
const currentPhase = allPhases[Ambience.phase].value;
console.log('The time is ' + currentPhase)

//Within Random Selection, filter through.
const senses = ["sight", "smell", "touch", "feel"];
const chosenSense = senses[Ambience.hour];

const ambienceEntry = await Ambience.loadAmbienceEntry(mainSelect, currentPhase);

//Retain returned entry until next phase.
Ambience.current = ambienceEntry;  

let ambienceIntro = 'It is a [' + mainSelect + ' ' + currentPhase + ']. '  

let rawStory = ``

//ADD AMBIENCE
rawStory += `<span class="ambience">
${ambienceIntro}\n
${ambienceEntry.description}\n
${ambienceEntry[chosenSense]}\n
</span>`;

let playerIntro = 'You are at [' + locationName.textContent + ']. '  


// Replace monster placeholders in the GM text
const gmTextWithMonsters = await this.replaceMonsterPlaceholders(gm);

//ADD LOCATION BITS
rawStory += `
<span class="section player"> <hr> \n ${playerIntro} \n\n ${player} \n\n\  <hr> </span>`


const presentNPCs = this.getNPCs(locationName.textContent,Ambience.phase);

if (presentNPCs.length === 0) {
rawStory += "There is nobody around.";
} else {
for (const npcWithStory of presentNPCs) {
const npcStory = npcWithStory.story;
rawStory += npcStory;
}
}

rawStory += 
`<span class="section gm"> <hr> ${gmTextWithMonsters} \n\n</span>
<span class="section misc">${misc} \n\n\</span>`; 

//FORMAT STORYTELLER
let formattedStory = this.applyStyling(rawStory);

//ADD TABLE SO DOESN'T GET FORMATTED
formattedStory +=`
<table class="storyTable"> 
<tbody>
${this.generateSpreadsheetRows(spreadsheet)}
</tbody>
</table>`

//CHANGE CONTENT IN STORYTELLER ELEMENT
Storyteller.innerHTML = formattedStory;

//CHANGE CONTENT IN EDITOR ELEMENT
editPlayerText.value = player;
editGMText.value = gm;
editMiscText.value = misc;

Edit.generateTable();


try {
// Populate the spreadsheet cells with the saved content
const spreadsheetCells = document.querySelectorAll('.spreadsheet td input');
spreadsheetCells.forEach(input => {
const cell = input.parentNode;
const row = cell.parentNode.rowIndex //- 1;
const col = cell.cellIndex //- 1;
const cellData = spreadsheet.find(data => data.row === row && data.col === col);
if (cellData) {
input.value = cellData.content;
}
});
} catch {

}

NPCs.loadNPC();
this.showExtraContent()

};
}, 

getNPCs(locationName, currentPhase) {
const presentNPCs = [];

// Apply different colors based on location type
const phaseName = currentPhase === 0 ? 'Morning' :
currentPhase === 1 ? 'Afternoon' :
currentPhase === 2 ? 'Night' : 'wild';

for (const npc of NPCs.npcArray) {
if (npc[`${phaseName}Location`] === locationName) {
console.log('Present')
const npcStory = this.generateNPCStory(npc, locationName, phaseName);
presentNPCs.push({ name: npc.name, story: npcStory });
}
}

return presentNPCs;
},


generateNPCStory(npc, locationName,phaseName) {
let story = `<br>`;

// Add the span around the NPC's name that includes it as an .expandable but also their unique name.
story += `<span class="expandable" divId="${npc.name.replace(/\s+/g, '-')}">${npc.occupation} is here. \n (${npc.name})</span>`;
story += `</span><br>`;

if (phaseName === 'Morning' && npc.MorningLocation === locationName && npc.MorningActivity && npc.MorningActivity !== "undefined") {
story += `   They are currently ${npc.MorningActivity} \n`;
}

if (phaseName === 'Afternoon'  && npc.AfternoonLocation === locationName && npc.AfternoonActivity && npc.AfternoonActivity !== "undefined") {
story += `   They are currently ${npc.AfternoonActivity} \n`;
}

if (phaseName === 'Night'  && npc.NightLocation === locationName && npc.NightActivity && npc.NightActivity !== "undefined") {
story += `   They are currently ${npc.NightActivity} \n`;
}



return story;
},


showExtraContent() {
const expandableElements = document.querySelectorAll('.expandable');
const extraInfo = document.querySelector('.extraInfo');

expandableElements.forEach(expandableElement => {
expandableElement.addEventListener('mouseenter', (event) => {
console.log('Enter');
extraInfo.classList.add('showExtraInfo');

// Extract the NPC name from the element's divId
const npcName = event.target.getAttribute('divId');
console.log('NPC name:', npcName);
this.addCharacterSheet(npcName);

// Now you can use the npcName for further actions
});

extraInfo.addEventListener('mouseleave', () => {
console.log('Leave');
extraInfo.classList.remove('showExtraInfo');
});
});
},


addCharacterSheet(npcName) {
const extraContent = document.getElementById('extraContent');

// Search for the NPC in the npcArray

const findNPC = npcName.replace(/-/g, ' ');

const foundNPC = NPCs.npcArray.find(npc => npc.name === findNPC);

if (foundNPC) {
  console.log(foundNPC);
// Format the NPC information into npcContent
let npcContent = `<h2><span class="orange">${foundNPC.name}</span></h2>`;

if (foundNPC.occupation && foundNPC.occupation !== "undefined") {
  npcContent += `<span class="orange">${foundNPC.occupation}.</span>`;
  }

if (foundNPC.class && foundNPC.class !== "N/A") {
npcContent += `<br><span class="cyan">Level ${foundNPC.level} ${foundNPC.class.toUpperCase()}</span>`;
}

if (foundNPC.str) {
  npcContent += `<br>
  <span class="hotpink"> STR: </span> ${foundNPC.str}
  <span class="hotpink"> DEX: </span> ${foundNPC.dex}
  <span class="hotpink"> INT: </span> ${foundNPC.int}
  <span class="hotpink"> WIS: </span> ${foundNPC.wis}
  <span class="hotpink"> CON: </span> ${foundNPC.con}
  <span class="hotpink"> CHA: </span> ${foundNPC.cha}
  `
}



    if (foundNPC.physicalAppearance && foundNPC.physicalAppearance !== "undefined") {
    npcContent += `<br><br>${foundNPC.physicalAppearance}`;
    }

    if (foundNPC.emotionalAppearance && foundNPC.emotionalAppearance !== "undefined") {
    npcContent += `<br><br>${foundNPC.emotionalAppearance}`;
    }

    if (foundNPC.socialAppearance && foundNPC.socialAppearance !== "undefined") {
    npcContent += `<br><br>${foundNPC.socialAppearance}`;
    }

          if (foundNPC.MorningLocation) {
          npcContent += `<br><br>   In the morning they can be found at  <span class="lime">[${foundNPC.MorningLocation}]</span>, ${foundNPC.MorningActivity}`;
          }

          if (foundNPC.AfternoonLocation) {
          npcContent += `<br><br>   In the afternoon they can be found at <span class="orange">[${foundNPC.AfternoonLocation}]</span>, ${foundNPC.AfternoonActivity}`;
          }

          if (foundNPC.NightLocation) {
          npcContent += `<br><br>   In the evening they can be found at <span class="hotpink">[${foundNPC.NightLocation}]</span>, ${foundNPC.NightActivity}`;
          }

// Set the formatted content in the extraContent element
extraContent.innerHTML = npcContent;
} else {
// NPC not found
extraContent.innerHTML = `NPC not found`;
}
},

async replaceMonsterPlaceholders(text) {
const monsterPlaceholderRegex = /\{([^}]+)\}/g;
const monsters = await Monsters.loadMonstersArray();

return text.replace(monsterPlaceholderRegex, (match, monsterName) => {
//console.log(`Searching for monster: ${monsterName}`);

const monster = monsters.monsters[monsterName]; // Access monsters object first

if (monster) {

//console.log(`Found monster: ${monsterName}`);

//Format Presentation of Monster Stats

const attributes = [
`${monsterName.toUpperCase()}`,
`${monster.Type};\n\n`,

`{# App}: ${monster.Appearing};\n`,
`{Morale}: ${monster.Morale};\n`,
`{Movement}: ${monster.Mvmt};\n`,
`{Armour Class}: ${monster.AC};\n`,
`{Hit Dice}: ${monster.HD};\n`,
`{Hit Dice Range}: ${monster.HDSort};\n`,
`{No. Attacks}: ${monster.Attacks};\n`,
`{Damage}: ${monster.Damage};\n`,          
`{Special}: ${monster.Special || "None"};\n`,
`{Save As}: ${monster["Save As "]};\n`,
`{Treasure}: ${monster.Treasure || "None"};\n`,
`{Experience Points}: ${monster.XP};\n\n `,
`{Description}: \n\n ${monster.Description.replace(/\./g, '.\n\n')}`,

// Add other fields here
];

const formattedAttributes = attributes
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

//console.log(`Attributes for ${monsterName}: ${formattedAttributes}`);

return formattedAttributes;
} else {
console.log(`Monster not found: ${monsterName}`);
return match; // Keep the original placeholder if monster not found
}
});
},


applyStyling(content) {

const allCapsPattern = /\b([A-Z]{2,})\b/g;
const insideRoundedBracketsPattern = /\(([^)]+)\)/g;
const insideSquareBracketsPattern = /\[([^\]]+)\]/g;
const insideCurlyBrackets = /\{([^}]+)\}/g;

return content
.replace(allCapsPattern, '<span class="all-caps">$1</span>')
.replace(insideRoundedBracketsPattern, '<span class="inside-rounded-brackets">($1)</span>')
.replace(insideSquareBracketsPattern, '<span class="inside-square-brackets">[$1]</span>')
.replace(insideCurlyBrackets, '<span class="inside-curly-brackets">{$1}</span>');
},


generateSpreadsheetRows(spreadsheet) {
// Determine the maximum row and column indices
let maxRow = -1;
let maxCol = -1;

try{

spreadsheet.forEach(cellData => {
if (cellData.row > maxRow) {
maxRow = cellData.row;
}
if (cellData.col > maxCol) {
maxCol = cellData.col;
}
});

// Increment by 1 to get the actual number of rows and columns
const numRows = maxRow + 1;
const numCols = maxCol + 1;

let rowsHtml = '';

for (let i = 0; i < numRows; i++) {
rowsHtml += '<tr>';

for (let j = 0; j < numCols; j++) {
const cellData = spreadsheet.find(data => data.row === i && data.col === j);
const cellContent = cellData ? cellData.content : '';
rowsHtml += `<td><input value="${cellContent}"></td>`;
}

rowsHtml += '</tr>';
}

return rowsHtml;
} catch{}
},


};




export default Storyteller;

