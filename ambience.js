import Edit from "./edit.js";
import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Storyteller from "./storyteller.js";

const Ambience = {

phase: 0,
hour: 0,
current: '',
genDesc: "",
senseDesc:"",
ambienceArray: [],

async getAmbience(){

Ambience.clock();
const Spring  = Ref.mainAmbienceDropdown.value;
const Morning = Ref.secondAmbienceDropdown[Ambience.phase].value;

//Within Random Selection, filter through.
const senses = ["sight", "smell", "touch", "feel"];
const chosenSense = senses[Ambience.hour];
const ambienceEntry = await this.loadAmbienceEntry(Spring, Morning);

//Retain returned entry until next phase. Do not delete!
this.current = ambienceEntry; 

this.genDesc = "";
this.senseDesc = "";

this.genDesc = ambienceEntry.description
this.senseDesc = ambienceEntry[chosenSense]

}, 

async clock(){

if(!Edit.editMode){

if(Ref.timePassingCheckbox.checked) {

if(this.hour < 3){
this.hour = this.hour + 1;                
}else{
if(this.hour === 3){
console.log('New Phase')   
this.hour = 0;
if(this.phase === 2){
console.log('New Day')
this.phase = 0;    
}else{
this.phase = this.phase + 1;
}
}
}

this.radiateDisplay();

}} else{

this.hour = this.hour

}},

async loadAmbienceArray() {

try {
const response = await fetch('ambience.json'); // Adjust the path if needed
const data = await response.json();
this.ambienceArray = data;
console.log(this.ambienceArray)
this.initializeAmbienceDropdowns();

return data;

} catch (error) {
console.error('Error loading ambience array:', error);
return [];
}

},    

defaultAmbience(){

// Set default context, main, and second values
const uniqueContext = [...new Set(this.ambienceArray.map(item => item.context))];
this.populateDropdown(document.getElementById("contextDropdown"), uniqueContext, 1);

const defaultContext = uniqueContext[0];
const filteredByDefaultContext = this.ambienceArray.filter(item => item.context === defaultContext);
const defaultMain = filteredByDefaultContext.length > 0 ? filteredByDefaultContext[0].main : "";
const filteredByDefaultMain = this.ambienceArray.filter(item => item.main === defaultMain);
const defaultSecond = filteredByDefaultMain.length > 0 ? filteredByDefaultMain[0].second : "";

// Set default values for dropdowns
Ref.contextDropdown.value = defaultContext;
this.populateDropdown(Ref.mainAmbienceDropdown, [...new Set(filteredByDefaultContext.map(item => item.main))],1);
Ref.mainAmbienceDropdown.value = defaultMain;
this.populateDropdown(Ref.secondAmbienceDropdown, [...new Set(filteredByDefaultMain.map(item => item.second))],1);
Ref.secondAmbienceDropdown.value = defaultSecond;

this.populateDropdown(Ref.eventmanager, [...new Set(filteredByDefaultContext.map(item => item.title))], 0)

this.EventLoad()
},



EventLoad(){

Ref.eventmanager.addEventListener('change', () => {
Ref.extraInfo.classList.add('showExtraInfo');

this.addEventInfo();
})

Ref.extraInfoContainer.addEventListener('mouseleave', () => {
Ref.extraInfo.classList.remove('showExtraInfo');})

},

addEventInfo(){

    const contentId = Ref.eventmanager.value
       
    //Search for Event in the Array   
    const event = Object.values(this.ambienceArray).find(event => event.title.toLowerCase() === contentId.toLowerCase());
    
    if (event) {
    
    const eventInfo = [
      
    `<span class="cyan">Context:</span>  ${event.context || "None"} <br><br>`,
    `<span class="cyan">Season:</span>  ${event.main || "None"} <br><br> `,
    `<span class="cyan">Time:</span> ${event.second || "None"};<br><br> `,
    `<span class="cyan">Title:</span> ${event.title || "None"};<br><br> `,
    `<span class="cyan">Description:</span> ${event.description || "None"};<br><br>`,
    
    ];
    
    const formattedItem = eventInfo
    .filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
    .join(" ");
    
    // Set the formatted content in the extraContent element
    Ref.extraContent.innerHTML = formattedItem;
    
    return formattedItem;
    
    } else {
    console.log(`Event not found: ${contentId}`);
    
    }
    
    },

loadEventsList: function(data) {
    const itemList = document.getElementById('itemList'); // Do not delete!!
    
    // Clear the existing content
    itemList.innerHTML = '';
    
    // Sort the items by item type alphabetically
    //const sortedItems = data.slice().sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));
    
    // Iterate through the sorted spells
    for (const event of data) {
    const eventNameDiv = document.createElement('div');
    eventNameDiv.innerHTML = `${event.Name}</span>`;
    itemList.appendChild(eventNameDiv);
    //this.fillSpellsForm(event, eventNameDiv);
    }
    
    itemList.style.display = 'block'; // Display the container
    
    NPCs.fixDisplay();
    },

addAmbienceEventListeners(){

Ref.radianceDropdown.addEventListener("change", () => {
console.log('radiate');
this.radiateDisplay();
});

Ref.contextDropdown.addEventListener("change", () => {
const selectedContext = Ref.contextDropdown.value;
const filteredByContext = this.ambienceArray.filter(item => item.context === selectedContext);

if (filteredByContext.length > 0) {
const uniqueMain = [...new Set(filteredByContext.map(item => item.main))];
this.populateDropdown(Ref.mainAmbienceDropdown, uniqueMain);

this.simMainDrop();

} else {
Ref.mainAmbienceDropdown.innerHTML = '<option value="">No Data</option>';
Ref.secondAmbienceDropdown.innerHTML = '<option value="">No Data</option>';
}
});

Ref.mainAmbienceDropdown.addEventListener("change", () => {
const selectedMain = Ref.mainAmbienceDropdown.value;
const filteredByMain = this.ambienceArray.filter(item => item.main === selectedMain);
const uniqueFilteredSecond = [...new Set(filteredByMain.map(item => item.second))];
this.populateDropdown(Ref.secondAmbienceDropdown, uniqueFilteredSecond);
});

Ref.secondAmbienceDropdown.addEventListener("change", () => {
// Handle second dropdown change
});
},

populateDropdown(dropdown, options, replace) {

if(replace === 1){    
dropdown.innerHTML = ''; // Clear existing options
}

options.forEach(option => {
const optionElement = document.createElement("option");
optionElement.value = option;
optionElement.text = option;
dropdown.appendChild(optionElement);
});
},

async initializeAmbienceDropdowns() {

console.log(this.ambienceArray)



this.defaultAmbience();
this.addAmbienceEventListeners();

},

simConDrop(){

//Simulate Click on Second Dropdown
const event = new Event("change", { bubbles: true, cancelable: true });

Ref.contextDropdown.dispatchEvent(event);

},

simMainDrop(){

//Simulate Click on Second Dropdown
const event = new Event("change", { bubbles: true, cancelable: true });

Ref.mainAmbienceDropdown.dispatchEvent(event);

},

async loadAmbienceEntry(main, second) {

const ambienceArray = await this.loadAmbienceArray();

// Filter ambienceArray based on selected values
const filterArray = ambienceArray.filter(entry =>
entry.main === main && entry.second === second
);

//console.log('current: ' + this.current);

if(this.current === ''){
const randomEntry = filterArray[Math.floor(Math.random() * filterArray.length)];
return randomEntry;     
};

//console.log('Time in Ambience -- Hour: ' + this.hour + '; Phase: ' + this.phase);

if(this.hour > 0){

return this.current;       

}else{

if(this.hour === 0){

const randomEntry = filterArray[Math.floor(Math.random() * filterArray.length)];
//console.log('New Description: ' + randomEntry.title);
return randomEntry;
}}


},

//Backlights screen depending on ToD or context. 

radiateDisplay(){

const overlay = document.getElementById('radiantDisplay');
const radianceDropdown = document.getElementById('radianceDropdown').value;

if(radianceDropdown === 'exterior'){
switch (this.phase) {
case 0: // Morning
switch (this.hour) {
case 0: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.2";

break;

case 1: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.1";

break;

case 2: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.2";


break;

case 3: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.3";

break;

default:
break;
}
break;

case 1: // Afternoon
switch (this.hour) {
case 0: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.2";

break;

case 1: 

overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
overlay.style.opacity = "0.1";

break;

case 2: 

overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
overlay.style.opacity = "0.2";


break;

case 3: 

overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
overlay.style.opacity = "0.3";

break;

default:
break;
}
break;

case 2: // Night
switch (this.hour) {
case 0: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.4";

break;

case 1: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.5";

break;

case 2: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.6";


break;

case 3: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.7";

break;

default:
break;
}
break;

default:
break;
}
}else{

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.5";

}


},

//Standard Edit, Save, load

loadAmbienceList: function(data) {
const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';

// Iterate through the sorted ambience objects
for (const ambience of data) {
const ambienceNameDiv = document.createElement('div');
ambienceNameDiv.innerHTML = `[${ambience.context} ${ambience.main} ${ambience.second}] <span class="cyan">${ambience.title}</span>`;
itemList.appendChild(ambienceNameDiv);
this.fillAmbienceForm(ambience, ambienceNameDiv);
}

itemList.style.display = 'block'; // Display the container

NPCs.fixDisplay();
},

fillAmbienceForm: function(ambience, ambienceNameDiv) {
// Add click event listener to each ambience name
ambienceNameDiv.addEventListener('click', () => {
Ref.ambienceContext.value = ambience.context;
Ref.ambienceMain.value = ambience.main;
Ref.ambienceSecond.value = ambience.second;
Ref.ambienceTitle.value = ambience.title;
Ref.ambienceDescription.value = ambience.description;
Ref.ambienceSight.value = ambience.sight;
Ref.ambienceSmell.value = ambience.smell;
//Ref.ambienceTouch.value = ambience.touch;
Ref.ambienceFeel.value = ambience.feel;
//Ref.ambienceTaste.value = ambience.taste;

Ref.ambienceForm.style.display = 'flex'; // Display the ambienceForm
});
},

saveAmbience: function() {
const existingAmbienceIndex = this.ambienceArray.findIndex(ambience => 
ambience.title === Ref.ambienceTitle.value         
);

const ambience = {
context: Ref.ambienceContext.value,
main: Ref.ambienceMain.value,
second: Ref.ambienceSecond.value,
title: Ref.ambienceTitle.value,
description: Ref.ambienceDescription.value,
sight: Ref.ambienceSight.value,
smell: Ref.ambienceSmell.value,
//touch: Ref.ambienceTouch.value,
feel: Ref.ambienceFeel.value
};

if (existingAmbienceIndex !== -1) {
// Update the existing ambience entry
this.ambienceArray[existingAmbienceIndex] = ambience;
console.log('Ambience updated:', ambience);
} else {
this.ambienceArray.push(ambience);

}

this.initializeAmbienceDropdowns()

},

addAmbienceSearch: function() {
Ref.ambienceTitle.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Check if the searchText contains '{'
if (searchText.includes('{')) {
// Remove '{' from the searchText
searchText = searchText.replace('{', '');

// Call the searchAmbience function
this.searchAmbience(searchText);
}
});
},

searchAmbience: function(searchText) {
this.ambienceSearchArray = [];

this.ambienceSearchArray = this.ambienceArray.filter((ambience) => {
const context = ambience.context.toLowerCase();
const main = ambience.main.toLowerCase();
const second = ambience.second.toLowerCase();
const title = ambience.title.toLowerCase();

// Check if any of the properties contain the search text
return context.includes(searchText) || main.includes(searchText) ||
second.includes(searchText) || title.includes(searchText);
});

this.loadAmbienceList(this.ambienceSearchArray);
}




}

export default Ambience;

