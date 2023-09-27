import Edit from "./edit.js";
import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Storyteller from "./storyteller.js";

const Ambience = {

phase: 0,
hour: 0,
current: '',
eventDesc: "",

ambienceArray: [],

async loadAmbienceArray() {

try {
const response = await fetch('ambience.json'); // Adjust the path if needed
const data = await response.json();
this.ambienceArray = data;
//console.log(this.ambienceArray)
this.fillEventManager();
return data;

} catch (error) {
console.error('Error loading ambience array:', error);
return [];
}
},

loadEventListeners(){
Ref.eventManagerInput.addEventListener('mouseenter', () => {
Ref.extraInfo.classList.add('showExtraInfo');
this.showcurrentEvents();
});

Ref.eventManagerInput.addEventListener('change', () => {
Ref.extraInfo.classList.add('showExtraInfo');
this.getEvent();
this.addEventInfo();
//this.radiateDisplay();
})

},


showcurrentEvents(){

Ref.extraContent.innerHTML = '';
Ref.extraContent.style.display = 'block'; // Display the container

// Partition the ambienceArray into active and inactive events
const activeEvents = this.ambienceArray.filter(event => event.active === 1);
const inactiveEvents = this.ambienceArray.filter(event => event.active !== 1);

// Concatenate the active and inactive events arrays, placing active events first
const sortedAmbienceArray = [...activeEvents, ...inactiveEvents];

// Iterate through the sorted events and display them
for (const event of sortedAmbienceArray) {
  const eventNameDiv = document.createElement('div');
  eventNameDiv.innerHTML = `<span class="gray">[${event.context}]</span><span class="${event.active === 1 ? 'lime' : 'gray'}">${event.title}</span>`;
  Ref.extraContent.appendChild(eventNameDiv);

  eventNameDiv.addEventListener('click', () => {
  Ref.eventManagerInput.value = event.title;
  this.addEventInfo();})
  }
 
NPCs.fixDisplay();

},

fillEventManager() {
// Create an object to keep track of unique items
const uniqueItems = {};

// Reference to the dropdown element
const eventManagerDropdown = Ref.eventManagerInput;

// Clear existing options
eventManagerDropdown.innerHTML = '';

// Iterate through the ambienceArray and add unique titles to the dropdown
this.ambienceArray.forEach(ambience => {
const title = ambience.title;

// Check if the title is unique
if (!uniqueItems[title]) {
// Create a new option element
const option = document.createElement('option');
option.value = title;
option.text = title;

// Add the option to the dropdown
eventManagerDropdown.appendChild(option);

// Mark the title as seen
uniqueItems[title] = true;
}
});

// Call EventLoad() if needed
this.loadEventListeners();
},

addEventInfo(){

const contentId = Ref.eventManagerInput.value
Ref.extraInfo2.classList.add('showExtraInfo');
//Search for Event in the Array   
const event = Object.values(this.ambienceArray).find(event => event.title.toLowerCase() === contentId.toLowerCase());

if (event) {

const eventInfo = [
`<span class="misc">Title:</span>    ${event.title   || "None"} <br><hr> `,
`<span class="misc">Context:</span>  ${event.context || "None"} <br><hr>`,
`<span class="misc">Description:</span> ${event.description || "None"}<br><br>`,

];

const formattedItem = eventInfo
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the extraContent element
Ref.extraContent2.innerHTML = formattedItem;

return formattedItem;

} else {
console.log(`Event not found: ${contentId}`);

}

},

loadEventsList: function(data) {
const itemList = document.getElementById('itemList'); // Do not delete!!
//console.log(data)

// Clear the existing content
itemList.innerHTML = '';

// Partition the ambienceArray into active and inactive events
const activeEvents = data.filter(event => event.active === 1);
const inactiveEvents = data.filter(event => event.active !== 1);

// Concatenate the active and inactive events arrays, placing active events first
const sortedAmbienceArray = [...activeEvents, ...inactiveEvents];

// Iterate through the sorted events
for (const event of sortedAmbienceArray) {
const eventNameDiv = document.createElement('div');
eventNameDiv.innerHTML = `[${event.context}]<span class="${event.active === 1 ? 'lime' : 'other-class'}">${event.title}</span>`;
itemList.appendChild(eventNameDiv);
this.fillAmbienceForm(event, eventNameDiv);
}

itemList.style.display = 'block'; // Display the container

NPCs.fixDisplay();
},

async getEvent() {
    // Filter ambienceArray based on selected values
    console.log(Ref.eventManagerInput.value);
  
    const activeEvents = [];
  
    for (const entry of this.ambienceArray) {
      if (entry.active === 1) {
        activeEvents.push(entry);
      }
    }
  
    console.log(activeEvents);
  
    // Concatenate descriptions from active events into eventDesc
    this.eventDesc = activeEvents.map(entry => entry.description).join('\n\n');
  
    console.log(this.eventDesc);
  
    // Now you have a formatted eventDesc containing all descriptions of active events with the specified title.
    // You can use it as needed.
  },
  
   

//Standard Edit, Save, load
fillAmbienceForm: function(ambience, ambienceNameDiv) {
// Add click event listener to each ambience name
ambienceNameDiv.addEventListener('click', () => {
Ref.ambienceContext.value = ambience.context;
Ref.ambienceTitle.value = ambience.title;
Ref.ambienceDescription.value = ambience.description;
Ref.ambienceForm.style.display = 'flex'; // Display the ambienceForm
});
},

saveAmbience: function() {
const existingAmbienceIndex = this.ambienceArray.findIndex(ambience => 
ambience.title === Ref.ambienceTitle.value         
);

const ambience = {
context: Ref.ambienceContext.value,
//main: Ref.ambienceMain.value,
//second: Ref.ambienceSecond.value,
title: Ref.ambienceTitle.value,
description: Ref.ambienceDescription.value,
//sight: Ref.ambienceSight.value,
//smell: Ref.ambienceSmell.value,
//touch: Ref.ambienceTouch.value,
//feel: Ref.ambienceFeel.value
};

if (existingAmbienceIndex !== -1) {
// Update the existing ambience entry
this.ambienceArray[existingAmbienceIndex] = ambience;
console.log('Ambience updated:', ambience);
} else {
this.ambienceArray.push(ambience);

}


this.fillEventManager();

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
console.log('called')

this.ambienceSearchArray = this.ambienceArray.filter((ambience) => {
const context = ambience.context.toLowerCase();
const title = ambience.title.toLowerCase();

// Check if any of the properties contain the search text
return context.includes(searchText) || title.includes(searchText);
});

this.loadEventsList(this.ambienceSearchArray);
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


}


}

export default Ambience;

