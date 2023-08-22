import Array from "./array.js";

const Storyteller = {
    
changeContent(location) {
const Storyteller = document.getElementById('Storyteller');
const locationName = document.querySelector('.locationLabel');
const editLocationName = document.querySelector('.editLocationName');
const editPlayerText = document.getElementById('editPlayerText');
const editGMText = document.getElementById('editGMText');
const editMiscText = document.getElementById('editMiscText');

const divId = location.id;
locationName.textContent = divId;
editLocationName.value = divId;

const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);

if (matchingEntry) {
const player = matchingEntry.player;
const gm = matchingEntry.gm;
const misc = matchingEntry.misc;
const spreadsheet = matchingEntry.spreadsheetData;

// Combine content with different colors
const formattedStory = `
<span class="section player">${player}\n\n</span>
<span class="section gm">${gm}\n\n</span>
<span class="section misc">${misc}</span>
<table class="storyTable">
<tbody>
${this.generateSpreadsheetRows(spreadsheet)}
</tbody>
</table>
`;

// Change Storyteller Content
Storyteller.innerHTML = formattedStory;

// Apply all-caps class to words in all caps longer than 1 character
const allCapsElements = Storyteller.querySelectorAll('.section');
allCapsElements.forEach(element => {
  element.innerHTML = element.innerHTML.replace(/\b([A-Z]{2,})\b/g, '<span class="all-caps">$1</span>');
});

// Apply inside-rounded-brackets class to words inside rounded brackets
const insideRoundedBracketsElements = Storyteller.querySelectorAll('.section');
insideRoundedBracketsElements.forEach(element => {
  element.innerHTML = element.innerHTML.replace(/\(([^)]+)\)/g, '<span class="inside-rounded-brackets">($1)</span>');
});

// Apply inside-square-brackets class to words inside square brackets
const insideSquareBracketsElements = Storyteller.querySelectorAll('.section');
insideSquareBracketsElements.forEach(element => {
  element.innerHTML = element.innerHTML.replace(/\[([^\]]+)\]/g, '<span class="inside-square-brackets">[$1]</span>');
});

// Change Edit Content
editPlayerText.value = player;
editGMText.value = gm;
editMiscText.value = misc;

try{

// Populate the spreadsheet cells with the saved content
const spreadsheetCells = document.querySelectorAll('.spreadsheet td input');
spreadsheetCells.forEach(input => {
const cell = input.parentNode;
const row = cell.parentNode.rowIndex //- 1; // Adjust for skipping the column headers
const col = cell.cellIndex //- 1; // Adjust for skipping the row numbers
const cellData = spreadsheet.find(data => data.row === row && data.col === col);
if (cellData) {
input.value = cellData.content;
}
});

}
catch{
generateTable.click();
}
}
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

