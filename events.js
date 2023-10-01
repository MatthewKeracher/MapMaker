import Edit from "./edit.js";
import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Storyteller from "./storyteller.js";
import Array from "./array.js";

const Events = {

phase: 0,
hour: 0,
current: '',
eventDesc: "",

eventsArray: [],
eventsSearchArray: [],

async loadEventsArray() {

try {
const response = await fetch('ambience.json'); // Adjust the path if needed
const data = await response.json();
this.eventsArray = data;
//console.log(this.ambienceArray)
this.fillEventManager();
return data;

} catch (error) {
console.error('Error loading ambience array:', error);
return [];
}
},

loadEventListeners(){

// -- EVENT MANAGER LISTENERS

Ref.eventManagerInput.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
// Call the searchAmbience function
this.searchEvents(searchText);
this.showcurrentEvents(this.eventsSearchArray);

//this.getEvent();
this.addEventInfo();

})

// -- EVENTFORM LISTENERS

Ref.eventEvent.addEventListener('click', () => {
this.loadEventsList(this.eventsArray)
})

Ref.eventLocation.addEventListener('click', () => {
this.loadLocationsList(Array.locationArray);
})

Ref.eventLocation.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();
this.searchLocations(searchText);
console.log(this.eventsSearchArray);
this.loadLocationsList(this.eventsSearchArray);

})

Ref.eventNPC.addEventListener('click', () => {
NPCs.loadNPC(NPCs.npcArray)
})

Ref.eventNPC.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();
NPCs.searchNPC(searchText);
})},



fillEventManager() {
// Create an object to keep track of unique items
const uniqueItems = {};

// Reference to the dropdown element
const eventManagerDropdown = Ref.eventManagerInput;

// Clear existing options
eventManagerDropdown.innerHTML = '';

// Iterate through the ambienceArray and add unique titles to the dropdown
this.eventsArray.forEach(ambience => {
const title = ambience.event;

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

searchEvents: function(searchText) {
this.eventsSearchArray = [];
console.log(searchText)

this.eventsSearchArray = this.eventsArray.filter((ambience) => {
const group = ambience.group.toLowerCase();
const event = ambience.event.toLowerCase();

// Check if any of the properties contain the search text
return group.includes(searchText) || event.includes(searchText);
}); 

},

// -- USING EVENT MANAGER

showcurrentEvents(data){

Ref.extraContent.innerHTML = '';
Ref.extraContent.style.display = 'block'; // Display the container

// Partition the data into active and inactive events
const activeEvents = data.filter(event => event.active === 1);
const inactiveEvents = data.filter(event => event.active !== 1);

// Concatenate the active and inactive events arrays, placing active events first
const sortedAmbienceArray = [...activeEvents, ...inactiveEvents];

// Iterate through the sorted events and display them
for (const event of sortedAmbienceArray) {
const eventNameDiv = document.createElement('div');
eventNameDiv.innerHTML = `<span class="gray">[${event.group}]</span><span class="${event.active === 1 ? 'lime' : 'gray'}">${event.event}</span>`;
Ref.extraContent.appendChild(eventNameDiv);

eventNameDiv.addEventListener('click', () => {
Ref.eventManagerInput.value = event.event;
this.eventsSearchArray = [event]; // Assign an array with a single element
this.addEventInfo();
Ref.extraInfo2.classList.add('showExtraInfo');
});

}

NPCs.fixDisplay();

},

addEventInfo(){

const contentId = Ref.eventManagerInput.value

//Search for Event in the Array   
const event = Object.values(this.eventsArray).find(event => event.event.toLowerCase() === contentId.toLowerCase());

if (event) {

const eventInfo = [
`<span class="misc">Event:</span>    ${event.event   || "None"} <br><hr> `,
`<span class="misc">Group:</span>  ${event.group || "None"} <br><hr>`,
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

searchLocations: function(searchText) {
this.eventsSearchArray = [];
console.log(searchText);


this.eventsSearchArray = Array.locationArray.filter((location) => {
//const group = location.group.toLowerCase();
const name = location.divId.toLowerCase();
// Check if any of the properties contain the search text
return name.includes(searchText) //|| group.includes(searchText); 
}); 

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
eventNameDiv.innerHTML = `[${event.group}]<span class="${event.active === 1 ? 'lime' : 'other-class'}">${event.event}</span>`;
itemList.appendChild(eventNameDiv);
this.fillAmbienceForm(event, eventNameDiv);
}

itemList.style.display = 'block'; // Display the container

NPCs.fixDisplay();
},

loadLocationsList: function(data) {
const itemList = document.getElementById('itemList'); // Do not delete!!
//console.log(data)

// Clear the existing content
itemList.innerHTML = '';

const AllDiv = document.createElement('div');
AllDiv.innerHTML = "<span class= cyan>All</span>";
itemList.appendChild(AllDiv);

// Iterate through the sorted events
for (const location of data) {
const locationNameDiv = document.createElement('div');
locationNameDiv.innerHTML = `[Group Goes Here] ${location.divId}</span>`;
itemList.appendChild(locationNameDiv);

locationNameDiv.addEventListener('click', () => {
Ref.eventLocation.value = location.divId
});
}
},

async getEvent(currentLocation) {
  // Filter ambienceArray based on selected values
  console.log(Ref.eventManagerInput.value);

  const activeEvents = [];

  for (const entry of this.eventsArray) {
    if (entry.active === 1 && entry.location === "All" | entry.active === 1 && entry.location === currentLocation ) {
      activeEvents.push(entry);
    }
  }

  console.log(activeEvents);

  // Concatenate descriptions from active events into eventDesc
  this.eventDesc = activeEvents.map(entry => {
    let description = `${entry.description}`;
    return description;
  }).join('<br><br>');

  console.log(this.eventDesc);

  // Now you have a formatted eventDesc containing all descriptions of active events with the specified title.
  // You can use it as needed.
},




// -- MAKING AND EDITING EVENTS

fillAmbienceForm: function(ambience, ambienceNameDiv) {
// Add click event listener to each ambience name
ambienceNameDiv.addEventListener('click', () => {
Ref.eventGroup.value = ambience.group;
Ref.eventEvent.value = ambience.event;
Ref.eventNPC.value = ambience.npc;
Ref.eventLocation.value = ambience.location;
Ref.ambienceDescription.value = ambience.description;
Ref.ambienceForm.style.display = 'flex'; // Display the ambienceForm
});
},

saveAmbience: function() {
const existingAmbienceIndex = this.eventsArray.findIndex(ambience => 
ambience.event === Ref.eventEvent.value         
);

const ambience = {
group: Ref.eventGroup.value,
//main: Ref.ambienceMain.value,
//second: Ref.ambienceSecond.value,
event: Ref.eventEvent.value,
description: Ref.ambienceDescription.value,
location: Ref.eventLocation.value,
npc: Ref.eventNPC.value,
//touch: Ref.ambienceTouch.value,
//feel: Ref.ambienceFeel.value
};

if (existingAmbienceIndex !== -1) {
// Update the existing ambience entry
this.eventsArray[existingAmbienceIndex] = ambience;
console.log('Ambience updated:', ambience);
} else {
this.eventsArray.push(ambience);

}


this.fillEventManager();

},

addAmbienceSearch: function() {
Ref.eventEvent.addEventListener('input', (event) => {
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
this.eventsSearchArray = [];
console.log('called')

this.eventsSearchArray = this.eventsArray.filter((ambience) => {
const group = ambience.group.toLowerCase();
const event = ambience.event.toLowerCase();

// Check if any of the properties contain the search text
return group.includes(searchText) || event.includes(searchText);
});

this.loadEventsList(this.eventsSearchArray);
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

export default Events;

