import Array from "./array.js";
import Ambience from "./ambience.js";
import Monsters from "./monsters.js";
import NPCs from "./npcs.js";

const Storyteller = {
    
  async changeContent(location) {
  //TAKE LOCATION NAME
  const divId = location.id;

  const locationName     = document.querySelector('.locationLabel');
  const editLocationName = document.querySelector('.editLocationName');
  const primaryLocation = document.getElementById('primaryLocation')

  const Storyteller      = document.getElementById('Storyteller');

  const editPlayerText   = document.getElementById('editPlayerText');
  const editGMText       = document.getElementById('editGMText');
  const editMiscText     = document.getElementById('editMiscText');

  //CHANGE CONTENT - SIDEBAR TITLES
  locationName.textContent = divId;
  editLocationName.value   = divId;
  
  //CHANGE CONTENT IN NPCFORM
  primaryLocation.value = divId;

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
      

  const presentNPCs = this.getNPCs(locationName.textContent);

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
        generateTable.click();
        
      }

      NPCs.loadNPC();

    };
  }, 

  generateNPCStory(npc, locationName) {
    let story = ``;

    // Check location types and set colors
    const locationType = npc.primaryLocation === locationName ? 'primary' :
        npc.secondaryLocation === locationName ? 'secondary' :
        npc.tertiaryLocation === locationName ? 'tertiary' : 'wild';

    // Apply different colors based on location type
    const nameColor = locationType === 'primary' ? 'primary' :
                      locationType === 'secondary' ? 'secondary' :
                      locationType === 'tertiary' ? 'tertiary' : 'wild';

    // Add the span around the NPC's name
    story += `<span class="${nameColor}">${npc.name}`;

    if (npc.class && npc.class !== "N/A") {
        story += `{LEVEL ${npc.level} ${npc.class.toUpperCase()}} `;
    }

    if (npc.name && npc.name !== "undefined") {
        story += `, the ${npc.occupation.toLowerCase()}, is here. `;
    }

    story += `</span>`

    if (npc.physicalAppearance && npc.physicalAppearance !== "undefined") {
        story += `   ${npc.physicalAppearance} \n\n`;
    }

    if (npc.emotionalAppearance && npc.emotionalAppearance !== "undefined") {
        story += `   ${npc.emotionalAppearance} \n\n`;
    }

    if (npc.socialAppearance && npc.socialAppearance !== "undefined") {
        story += `   ${npc.socialAppearance} \n\n`;
    }

    if (npc.primaryLocation === locationName && npc.primaryActivity && npc.primaryActivity !== "undefined") {
        story += `   They are currently ${npc.primaryActivity.toLowerCase()}. \n\n`;
    }

    if (npc.secondaryLocation === locationName && npc.secondaryActivity && npc.secondaryActivity !== "undefined") {
        story += `   They are currently ${npc.secondaryActivity.toLowerCase()}. \n\n`;
    }

    if (npc.tertiaryLocation === locationName && npc.tertiaryActivity && npc.tertiaryActivity !== "undefined") {
        story += `   They are currently ${npc.tertiaryActivity.toLowerCase()}. \n\n`;
    }

    

    return story;
},



   
   getNPCs(locationName) {
    const presentNPCs = [];
    
    for (const npc of NPCs.npcArray) {
      if (npc.primaryLocation === locationName || npc.secondaryLocation === locationName || npc.tertiaryLocation === locationName) {
          const chance = Math.random() * 100;
  
          if (npc.primaryLocation === locationName && chance <= 100) {
              const npcStory = this.generateNPCStory(npc, locationName);
              presentNPCs.push({ name: npc.name, story: npcStory });
          } else if (npc.secondaryLocation === locationName && chance <= 50) {
              const npcStory = this.generateNPCStory(npc, locationName);
              presentNPCs.push({ name: npc.name, story: npcStory });
          } else if (npc.tertiaryLocation === locationName && chance <= 25) {
              const npcStory = this.generateNPCStory(npc, locationName);
              presentNPCs.push({ name: npc.name, story: npcStory });
          } else if (chance <= 10) {
              const npcStory = this.generateNPCStory(npc, locationName);
              presentNPCs.push({ name: npc.name, story: npcStory });
          }
      }
  }
  
  
  
    console.log(presentNPCs)
    
    return presentNPCs;
  },

  
  async replaceMonsterPlaceholders(text) {
    const monsterPlaceholderRegex = /\{([^}]+)\}/g;
    const monsters = await Monsters.loadMonstersArray();
  
    return text.replace(monsterPlaceholderRegex, (match, monsterName) => {
      console.log(`Searching for monster: ${monsterName}`);
      
      const monster = monsters.monsters[monsterName]; // Access monsters object first

      if (monster) {

        console.log(`Found monster: ${monsterName}`);

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
}

};
  
  

export default Storyteller;

