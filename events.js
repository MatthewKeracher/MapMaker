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
focusEvent: "",

tagsArray: [],
eventsArray: [],
searchArray: [],

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
// Call the searchAmbience function;
this.searchEvents(searchText);
this.showcurrentEvents(this.searchArray);

//this.getEvent();
this.addEventInfo();

})

Ref.eventManagerInput.addEventListener('click', () => {
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
this.showcurrentEvents(this.eventsArray);
})

// NPC TAGS LISTENERS

Ref.npcTags.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
Ref.itemList.style.display = 'none';
// Call the searchAmbience function
console.log(searchText)
this.searchTags(searchText); 
this.showTags(this.searchArray);

})

Ref.npcTags.addEventListener('click', () => {
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
Ref.itemList.style.display = 'none';
this.fillTagsArray();
this.showTags(this.tagsArray);
})

// LOCATION TAGS LISTENERS

Ref.editLocationTags.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
// Call the searchAmbience function
console.log(searchText)
this.searchTags(searchText); 
this.showTags(this.searchArray);

})

Ref.editLocationTags.addEventListener('click', () => {
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
this.fillTagsArray();
this.showTags(this.tagsArray);
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

  if (searchText.trim() === '') {
      // Input box is empty, handle accordingly
      console.log('Input box is empty');
      // Additional logic for empty input, if needed
      this.loadLocationsList(Array.locationArray);
  } else if (!/^[a-zA-Z]+$/.test(searchText)) {
      // Input box contains letters, handle accordingly
      console.log('Input box contains letters');
      // Additional logic for input with letters, if needed
      let searchText = event.target.value.toLowerCase();
      this.searchLocations(searchText);
      console.log(this.searchArray);
      this.loadLocationsList(this.searchArray);
  } else {
      // Input box has valid content, proceed with the search
      this.searchLocations(searchText);
      console.log(this.searchArray);
      this.loadLocationsList(this.searchArray);
  }
});

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
this.searchArray = [];
console.log('Searching for Events including: ' + searchText)

this.searchArray = this.eventsArray.filter((e) => {
const group = e.group.toLowerCase();
const event = e.event.toLowerCase();

// Check if any of the properties contain the search text
return group.includes(searchText) || event.includes(searchText);

}); 

},

// -- LOCATION search

searchLocations: function(searchText) {
this.searchArray = [];
console.log('Searching for Locations including: ' + searchText);

this.searchArray = Array.locationArray.filter((location) => {
//const group = location.group.toLowerCase();
const name = location.divId.toLowerCase();
// Check if any of the properties contain the search text
return name.includes(searchText) //|| group.includes(searchText); 
}); 

},

// -- TAGS Functions

searchTags(searchText) {
this.searchArray = [];

this.searchArray = this.tagsArray.filter((tag) => {
const tags = tag.toLowerCase();

// Check if the search text is included in the tag list
return tags.includes(searchText.toLowerCase());
});
},

// Function to extract tags from all Arrays
fillTagsArray() {
this.tagsArray = [];

for (const NPC of NPCs.npcArray) {
let tags = NPC.occupation || [];

try{
tags = tags.split(',').map(keyword => keyword.trim());
this.tagsArray.push(...tags);
}catch{}

} // ----

for (const location of Array.locationArray) {
let tags = location.tags || [];

try{
tags = tags.split(',').map(keyword => keyword.trim());

this.tagsArray.push(...tags);
}catch{}

} // ----

},

// Function to append tags to NPCs and Locations
addTag(tag) {

let target = Ref.editLocationTags; //DEFAULT

if (Edit.editPage === 3){target = Ref.npcTags};

const currentText = target.value;

if (currentText === '') {
// If the textarea is empty, just add the text
target.value = tag;
} else {
// If not empty, add a comma and the text to the end
target.value = `${currentText}, ${tag}`;
}
},

// Function to populate the div elements list with tags
showTags(data) {
Ref.extraContent.innerHTML = '';
Ref.extraContent.style.display = 'block'; // Display the container


// Iterate through the tags and display them
for (const tag of data) {
const tagDiv = document.createElement('div');
tagDiv.innerHTML = `<span class="gray">${tag}</span>`;
Ref.extraContent.appendChild(tagDiv);

tagDiv.addEventListener('click', () => {
  this.addTag(tag)
});
}
},

// -- LOCATION TAGS FUNCTIONS


// -- USING EVENT MANAGER



showcurrentEvents(data){

console.log(data)

Ref.extraContent.innerHTML = '';
Ref.extraContent.style.display = 'block'; // Display the container


// Sorting function for events
const sortEvents = (eventA, eventB) => {
  // First, sort by active/inactive status (active first)
  const activeComparison = eventB.active - eventA.active;
  if (activeComparison !== 0) {
      return activeComparison;
  }

  // If both events have the same active status, sort by event group alphabetically
  const groupComparison = eventA.group.localeCompare(eventB.group);
  if (groupComparison !== 0) {
      return groupComparison;
  }

  // If both events have the same group, sort by event target alphabetically
  return eventA.target.localeCompare(eventB.target);
};

// Sort the data using the custom sorting function
const sortedAmbienceArray = data.sort(sortEvents);


// // Partition the data into active and inactive events
// const activeEvents = data.filter(event => event.active === 1);
// const inactiveEvents = data.filter(event => event.active !== 1);

// // Concatenate the active and inactive events arrays, placing active events first
// const sortedAmbienceArray = [...activeEvents, ...inactiveEvents];

// Iterate through the sorted events and display them
for (const event of sortedAmbienceArray) {
const eventNameDiv = document.createElement('div');
eventNameDiv.innerHTML = `
    <span class="${event.active === 1 ? 'spell' : 'gray'}">[${event.group}]</span>
    <span class="${event.target === 'NPC' ? 'hotpink' : 'cyan'}">[${event.target}]</span>
    
    <span class="${event.active === 1 ? 'lime' : 'gray'}">${event.event}</span>
`;


Ref.extraContent.appendChild(eventNameDiv);

eventNameDiv.addEventListener('click', () => {
Ref.eventManagerInput.value = event.event;
this.focusEvent = event.event;
this.searchArray = [event]; // Assign an array with a single element
this.addEventInfo();
Ref.extraInfo2.classList.add('showExtraInfo');
});

eventNameDiv.addEventListener('mouseover', () => {
  //Ref.eventManagerInput.value = event.event;
  this.focusEvent = event.event;
  this.searchArray = [event]; // Assign an array with a single element
  this.addEventInfo();
  Ref.extraInfo2.classList.add('showExtraInfo');
  });

}

NPCs.fixDisplay();

},

addEventInfo(){

const contentId = this.focusEvent

//Search for Event in the Array   
const event = Object.values(this.eventsArray).find(event => event.event.toLowerCase() === contentId.toLowerCase());

if (event) {

//console.log(event)

const eventInfo = [
`<span class="misc">Status:</span>${event.active === 1 ? "Enabled" : "Disabled"} <br><br>`,
`<span class="misc">Event:</span>${event.event || "None"} <br><br> `,
`<span class="misc">Location:</span>${event.location || "None"} <br><br>`,
`<span class="misc">NPC:</span>  ${event.npc || "None"} <br><br>`,
`<span class="misc">Group:</span>  ${event.group || "None"} <br><br>`,
`<span class="hotpink">Description</span><br><hr> ${event.description || "None"}<br><br>`,

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
  eventNameDiv.innerHTML = `
      <span class="${event.target === 'NPC' ? 'hotpink' : 'cyan'}">[${event.target}]</span>
      <span class="${event.active === 1 ? 'spell' : 'gray'}">[${event.group}]</span>
      <span class="${event.active === 1 ? 'lime' : 'gray'}">${event.event}</span>
  `;

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

// const HomeDiv = document.createElement('div');
// HomeDiv.innerHTML = "<span class= hotpink>Home</span>";
// itemList.appendChild(HomeDiv);

// Iterate through the sorted events
for (const location of data) {
const locationNameDiv = document.createElement('div');
locationNameDiv.innerHTML = `<span class="${location.tags !== undefined ? 'cyan' : ''}">${location.tags !== undefined ? `[${location.tags}]` : ''}</span> ${location.divId}`;
itemList.appendChild(locationNameDiv);
locationNameDiv.addEventListener('click', () => {
Ref.eventLocation.value = location.divId
});
}
},

async getEvent(currentLocation, tags) {
// Filter ambienceArray based on selected values
//console.log(Ref.eventManagerInput.value);
console.log(tags)

const activeEvents = [];

for (const entry of this.eventsArray) {
  if (
      entry.active === 1 && entry.target === 'Location' &&
      (entry.location === "All" || entry.location === currentLocation || entry.location === tags)
  ) {
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

//Check target and tick relevent box
if(ambience.target === 'NPC'){
//Ref.npcCheckbox.checked = true;
Ref.npcCheckbox.click();
//Ref.locationCheck.checked = false;
}
else{
//Ref.locationCheck.checked = true;
Ref.locationCheck.click();
//Ref.npcCheckbox.checked = false;
}
});
},

saveAmbience: function() {

  let target 

  //Check to see if NPC checkbox is checked
  if (Ref.eventTarget.checked) {
    // The checkbox is checked
   target = 'NPC';
  } else {
    // The checkbox is not checked
   target = 'Location'
  }

const existingAmbienceIndex = this.eventsArray.findIndex(ambience => 
ambience.event === Ref.eventEvent.value && ambience.target === target      
);

const ambience = {
group: Ref.eventGroup.value,
active: 1,
target: target,
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
console.log('Event updated:', ambience);
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
this.searchArray = [];
console.log('called')

this.searchArray = this.eventsArray.filter((ambience) => {
const group = ambience.group.toLowerCase();
const event = ambience.event.toLowerCase();

// Check if any of the properties contain the search text
return group.includes(searchText) || event.includes(searchText);
});

this.loadEventsList(this.searchArray);
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

