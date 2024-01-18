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
this.searchEvents(searchText);
this.loadEventsList(this.searchArray, 'eventsManager');

//this.getEvent();
//this.addEventInfo();

})

Ref.eventManagerInput.addEventListener('click', () => {
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
this.loadEventsList(this.eventsArray, 'eventsManager');

})

// NPC TAGS LISTENERS

Ref.npcTags.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();
Ref.extraInfo.classList.add('showExtraInfo');
Ref.extraInfo2.classList.remove('showExtraInfo');
Ref.itemList.style.display = 'none';
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

Ref.eventSearch.addEventListener('click', () => {
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
const npc = e.npc.toLowerCase();
const location = e.location.toLowerCase();

// Check if any of the properties contain the search text
return group.includes(searchText) || event.includes(searchText) || npc.includes(searchText) || location.includes(searchText);

}); 

},

// -- LOCATION search

searchLocations: function(searchText) {
  this.searchArray = [];
  console.log('Searching for Locations including: ' + searchText);

  this.searchArray = Array.locationArray.filter((location) => {
    const name = location.divId.toLowerCase();
    const tags = location.tags.toLowerCase(); // Assuming tags is a comma-separated list

    // Get the last term in the search text (or use the entire text if there is no comma)
    const lastTerm = searchText.split(',').map(term => term.trim()).pop();

    // Check if the name or any tag contains the last term in the search text
    return name.includes(lastTerm) || tags.split(',').map(tag => tag.trim()).includes(lastTerm);
  });
},



// -- TAGS Functions

searchTags: function(searchText) {
  this.searchArray = [];

  this.searchArray = this.tagsArray.filter((tag) => {
    const tags = tag.toLowerCase();

    // Split the searchText by commas and get the part after the last comma
    const searchTerms = searchText.toLowerCase().split(',').map(term => term.trim());
    const lastTerm = searchTerms.length > 1 ? searchTerms[searchTerms.length - 1] : searchTerms[0];

    // Split the tag string into an array of individual tags
    const tagList = tags.split(',').map(tag => tag.trim());

    // Get the last tag in the list (or use the entire string if there is no comma)
    const lastTag = tagList.length > 1 ? tagList[tagList.length - 1] : tags;

    // Check if the last tag contains the last search term
    return lastTag.includes(lastTerm);
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

showTags(data) {
  Ref.extraContent.innerHTML = '';
  Ref.extraContent.style.display = 'block'; // Display the container

  // Use a Set to store unique tag values
  const uniqueTagsSet = new Set();

  // Iterate through the tags and display them
  for (const tag of data) {
    // Add the lowercase tag to the Set to ensure uniqueness
    uniqueTagsSet.add(tag);
  }

  // Convert the Set back to an array
  const uniqueTagsArray = [...uniqueTagsSet];


  // Iterate through unique tags and display them
  for (const tag of uniqueTagsArray) {
    const tagDiv = document.createElement('div');
    tagDiv.innerHTML = `<span class="gray">${tag}</span>`;
    Ref.extraContent.appendChild(tagDiv);

    tagDiv.addEventListener('click', () => {
      this.addTag(tag);
    });
  }
},


// -- LOCATION TAGS FUNCTIONS


// -- USING EVENT MANAGER

addEventInfo(data){

const contentId = this.focusEvent

//Search for Event in the Array   
const event = Object.values(this.eventsArray).find(event => event.event.toLowerCase() === data.event.toLowerCase() && event.target === data.target);

if (event) {

//console.log(event)

const eventInfo = [

`<h2><span class="${event.active === 1 ? 'lime' : 'gray'}">${event.event || "None"}</h2><hr>`,
`<span class="cyan">Location: </span>${event.location || "None"} <br><br>`,
`<span class="hotpink">NPC: </span>${event.npc || "None"} <br><br>`,
`<span class="orange">Group: </span>${event.group || "None"} <br><br><br>`,
`<span class="white">Description</span><br><hr> ${event.description || "None"}<br><br>`,

];

const formattedItem = eventInfo
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the extraContent element
Ref.extraContent2.innerHTML = formattedItem;

return formattedItem;

} else {
console.log(`Event not found: ${data.event}`);

}

},

// Partition the ambienceArray into different groups
 activeAtLocation : [],
 activeAtTag : [],
 inactiveAtLocation : [],
 inactiveAtTag : [],
 activeAll : [],
 inactiveAll : [],
 activeElsewhere : [],
 inactiveElsewhere : [],

 sortEvents: function(data) {

  // Search Array.locationArray to find the currentLocation
  const locationObject = Array.locationArray.find(location => location.divId === Ref.locationLabel.textContent);

  // Partition the ambienceArray into different groups
  this.activeAtLocation = [];
  this.activeAtTag = [];
  this.inactiveAtLocation = [];
  this.inactiveAtTag = [];
  this.activeAll = [];
  this.inactiveAll = [];
  this.activeElsewhere = [];
  this.inactiveElsewhere = [];

 data.forEach(event => {
    const eventLocations = event.location ? event.location.split(',').map(item => item.trim()) : [];
    const locationTags = locationObject && locationObject.tags ? locationObject.tags.split(',').map(item => item.trim()) : [];
    const currentLocation = locationObject? locationObject.divId : '';
    //console.log(locationTags + ' :: ' + eventLocations)
  
    if (event.active === 1) {
      if (eventLocations.includes(currentLocation)) {
        this.activeAtLocation.push(event);
      } else if (eventLocations.some(location => locationTags.includes(location))) {
        this.activeAtTag.push(event);
      } else if (event.location === 'All'& event.active === 1){
        this.activeAll.push(event);
      } else {
        this.activeElsewhere.push(event);
      }
    } else {
      if (eventLocations.includes(currentLocation)) {
        this.inactiveAtLocation.push(event);
      } else if (eventLocations.some(location => locationTags.includes(location))) {
        this.inactiveAtTag.push(event);
      } else if (event.location === 'All'& event.active === 0){
        this.inactiveAll.push(event);
      }else {
        this.inactiveElsewhere.push(event);
      }
    } 
  });
  
 },

loadEventsList: function(data, destination) {

  let target = '';

  if(destination === 'eventsManager'){
  target = Ref.extraContent;
  }else{
  target = Ref.itemList;
  }
  
  target.innerHTML = '';

  this.sortEvents(data);

  const locationEventsArray = [
    ...this.activeAtLocation,
    ...this.activeAtTag,
    ...this.inactiveAtLocation,
    ...this.inactiveAtTag,
  ]

  const allEvents = [
    ...this.activeAll,
    ...this.inactiveAll,
  ]

  //sort alphabetically by tag
  const elsewhere = [
    ...this.activeElsewhere,
    ...this.inactiveElsewhere
  ];

  elsewhere.sort((a, b) => a.group.localeCompare(b.group));

  for (const event of locationEventsArray) {
    const eventNameDiv = document.createElement('div');
    eventNameDiv.innerHTML = `
    <span class="${event.active === 1 ? 'spell' : 'gray'}">[${event.group}]</span>
    <span class="${event.active === 1 ? 'lime' : 'gray'}">${event.event}</span>
    <span class="${event.target === 'NPC' ? 'hotpink' : 'cyan'}">[${event.target === 'NPC' ? event.npc : event.location}]</span>
    
    `;

    target.appendChild(eventNameDiv);

    if(destination === 'eventsManager'){
      this.addCurrentEventEvents(event, eventNameDiv);
      }else{
      this.fillEventForm(event, eventNameDiv);
      }

      eventNameDiv.addEventListener('mouseover', () => {
        //Ref.eventManagerInput.value = event.event;
        this.focusEvent = event.event;
        this.searchArray = [event]; // Assign an array with a single element
        this.addEventInfo(event);
        Ref.extraInfo2.classList.add('showExtraInfo');
        });

  }

  if( locationEventsArray.length > 1){
  target.appendChild(document.createElement('hr'));
  }

  for (const event of allEvents) {
    
  const eventNameDiv = document.createElement('div');

  const isAllLocationActive = event.location === 'All' && event.active === 1;
  const npcOrLocation = event.target === 'NPC' ? event.npc : event.location;

  eventNameDiv.innerHTML = `
  <span class="${isAllLocationActive ? 'spell' : 'gray'}">[${event.group}]</span>
  <span class="${isAllLocationActive ? 'lime' : 'gray'}">${event.event}</span>
  <span class="${isAllLocationActive ? 'white' : 'gray'}">
  [${isAllLocationActive && event.npc !== 'All' ? 'All ' + npcOrLocation : npcOrLocation}]
  </span>
    
  
  `;

    target.appendChild(eventNameDiv);
    
    if(destination === 'eventsManager'){
      this.addCurrentEventEvents(event, eventNameDiv);
      }else{
      this.fillEventForm(event, eventNameDiv);
      }

      eventNameDiv.addEventListener('mouseover', () => {
        //Ref.eventManagerInput.value = event.event;
        this.focusEvent = event.event;
        this.searchArray = [event]; // Assign an array with a single element
        this.addEventInfo(event);
        Ref.extraInfo2.classList.add('showExtraInfo');
        });
  }

  if( allEvents.length > 1){
  target.appendChild(document.createElement('hr'));
  }

  for (const event of elsewhere) {
    const eventNameDiv = document.createElement('div');
    eventNameDiv.innerHTML = `
    <span class="${event.active === 1 ? 'spell' : 'gray'}">[${event.group}]</span>
    <span class="${event.active === 1 ? 'lime' : 'gray'}">${event.event}</span>
    <span class="${event.target === 'NPC' ? 'hotpink' : 'cyan'}">[${event.target === 'NPC' ? event.npc : event.location}]</span>
    
    `;

    target.appendChild(eventNameDiv);
    
    if(destination === 'eventsManager'){
    this.addCurrentEventEvents(event, eventNameDiv);
    }else{
    this.fillEventForm(event, eventNameDiv);
    }

    eventNameDiv.addEventListener('mouseover', () => {
      //Ref.eventManagerInput.value = event.event;
      this.focusEvent = event.event;
      this.searchArray = [event]; // Assign an array with a single element
      this.addEventInfo(event);
      Ref.extraInfo2.classList.add('showExtraInfo');
      });

  }

  target.style.display = 'block'; // Display the container
  
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
//console.log(tags)

const activeEvents = [];

for (const entry of this.eventsArray) {
  if (
    entry.active === 1 && 
    entry.target === 'Location' &&
    (entry.location === "All" || 
    (
      entry.location.split(',').map(locItem => locItem.trim()).some(locItem => 
        locItem === currentLocation
      )
    ) ||
      (
        tags.split(',').map(item => item.trim()).some(tag => 
          entry.location.split(',').map(locItem => locItem.trim()).includes(tag)
        )
      )
    )
  ) {
    activeEvents.push(entry);
  }
}



//console.log(activeEvents);

// Concatenate descriptions from active events into eventDesc
this.eventDesc = activeEvents.map(entry => {
let description = `${entry.description}`;
return description;
}).join('<br><br>');

//console.log(this.eventDesc);

// Now you have a formatted eventDesc containing all descriptions of active events with the specified title.
// You can use it as needed.
},

addCurrentEventEvents(event, eventNameDiv){

  eventNameDiv.addEventListener('click', () => {
    Ref.eventManagerInput.value = event.event;
    this.focusEvent = event.event;
    this.searchArray = [event]; // Assign an array with a single element
    this.addEventInfo(event);
    Ref.extraInfo2.classList.add('showExtraInfo');
    });
  
},


// -- MAKING AND EDITING EVENTS

fillEventForm: function(ambience, ambienceNameDiv) {
// Add click event listener to each ambience name
ambienceNameDiv.addEventListener('click', () => {
Ref.eventTags.value = ambience.group;
Ref.eventEvent.value = ambience.event;
Ref.eventNPC.value = ambience.npc;
Ref.eventLocation.value = ambience.location;
Ref.ambienceDescription.value = ambience.description;
Ref.ambienceForm.style.display = 'flex'; // Display the ambienceForm

//Check target and tick relevent box
if(ambience.target === 'NPC' && Ref.npcCheckbox.checked === false){
//Ref.npcCheckbox.checked = true;
Ref.npcCheckbox.click();
//Ref.locationCheck.checked = false;
}
else if(ambience.target === 'Location' && Ref.locationCheck.checked === false){
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
group: Ref.eventTags.value,
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
Ref.eventSearch.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Call the searchAmbience function
this.searchAmbience(searchText);
});

},

searchAmbience: function(searchText) {
this.searchArray = [];
console.log('called')

this.searchArray = this.eventsArray.filter((ambience) => {
const group = ambience.group.toLowerCase();
const event = ambience.event.toLowerCase();
const npc = ambience.npc.toLowerCase();
const location = ambience.location.toLowerCase();

// Check if any of the properties contain the search text
return group.includes(searchText) || event.includes(searchText) || npc.includes(searchText) || location.includes(searchText);
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

