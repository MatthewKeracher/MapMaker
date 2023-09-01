import Array from "./array.js";
import Ambience from "./ambience.js";
import Monsters from "./monsters.js";
import NPCs from "./npcs.js";
import Edit from "./edit.js";
import Ref from "./ref.js";

const Storyteller = {

comboArray: [],

async changeContent(locationDiv) {

let Story = ``

Ambience.clock();
const Spring = Ref.mainAmbience.value;
const Morning= Ref.allPhases[Ambience.phase].value;

//Within Random Selection, filter through.
const senses = ["sight", "smell", "touch", "feel"];
const chosenSense = senses[Ambience.hour];
const ambienceEntry = await Ambience.loadAmbienceEntry(Spring, Morning);

//Retain returned entry until next phase. Do not delete!
Ambience.current = ambienceEntry;  

//take location name from object.
const locationName = locationDiv.id;
//use divId to find locationObject of the same name
const locationObject = Array.locationArray.find(entry => entry.divId === locationName);

Ref.locationLabel.textContent = locationName;
Ref.editLocationName.value   = locationName;

if (locationObject) {
//name the returned locationObject data 
const locationText = locationObject.player;

this.comboArray = [];
const squareCurly = this.getMisc(locationText, this.comboArray);

const formattedLocation = await Monsters.getMonsters(squareCurly);
//console.log(presentMonsters)

const spreadsheet = locationObject.spreadsheetData;
const location = Ref.locationLabel.textContent;
const presentNPCs = NPCs.getNPCs(location, Ambience.phase);

let introText = 'It is a ' + Spring  + ' ' + Morning + '. You are at ' + location + '. ';


Story += `
${introText}<br><br>
${ambienceEntry.description}<br><br>
${ambienceEntry[chosenSense]}<br><br>
<span class="withbreak">${formattedLocation}</span>
`;


if (presentNPCs.length === 0) {
Story += "There is nobody around.";
} else {
for (const npcWithStory of presentNPCs) {
const npcStory = npcWithStory.story;
Story += `<span class="withbreak">${npcStory}</span><br>`;
}
}


//ADD TABLE SO DOESN'T GET FORMATTED
//rawStory +=`
{/* <table class="storyTable"> 
<tbody>
${this.generateSpreadsheetRows(spreadsheet)}
</tbody></table>` */}

//Apply formattedStory to Storyteller
Ref.Storyteller.innerHTML = Story;

//Update Editor Content
Ref.textLocation.value = locationText;

//Clear Table
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

addMiscInfo(contentId, comboArray) {
const extraContent = document.getElementById('extraContent');  
const combo = comboArray.find(item => item.square === contentId);
  
  if (combo) {
    const miscInfo = [ 
      
    `<h2><span class="misc">${combo.square.toUpperCase()}</span></h2><br>
    ${combo.curly}`]

    extraContent.innerHTML = miscInfo;
  } else {
    console.log(`Square curly combo with square "${contentId}" not found in the comboArray.`);
  }
},


getMisc(locationText, comboArray) {
  const squareBrackets = /\[([^\]]+)\]\{([^}]+)\}/g;

  const matches = [...locationText.matchAll(squareBrackets)];
  let updatedText = locationText;

  for (const match of matches) {
    const square = match[1];
    const curly = match[2];

    const replacement = `
    <span class="expandable misc" data-content-type="misc" divId="${square}">
    ${square.toUpperCase()}</span>`;

    updatedText = updatedText.replace(match[0], replacement);

    // Store the square curly combo in the provided array
    comboArray.push({ square, curly });
  }

  return updatedText;
},


showExtraContent() {
  const expandableElements = document.querySelectorAll('.expandable');
  const extraInfo = document.querySelector('.extraInfo');

  expandableElements.forEach(expandableElement => {
      expandableElement.addEventListener('mouseenter', (event) => {
          extraInfo.classList.add('showExtraInfo');

          const contentType = event.target.getAttribute('data-content-type');
          const contentId = event.target.getAttribute('divId');

          switch (contentType) {
              case 'npc':
                  NPCs.addNPCInfo(contentId); // Handle NPCs
                  break;
              case 'monster':
                  Monsters.addMonsterInfo(contentId); // Handle monsters
                  break;
                  case 'misc':
                    this.addMiscInfo(contentId, this.comboArray);
                    break;
              default:
                  console.log('Unknown content type');
          }
      });

      extraInfo.addEventListener('mouseleave', () => {
          extraInfo.classList.remove('showExtraInfo');
      });
  });
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

