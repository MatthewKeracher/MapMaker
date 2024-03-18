import editor from "./editor.js";
import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Storyteller from "./storyteller.js";
import load from "./load.js";

import Items from "./items.js";

const Events = {

phase: 0,
hour: 0,
current: '',
eventDesc: "",
focusEvent: "",

tagsArray: [],
eventsArray: [],
searchArray: [],

loadEventListeners(){

// -- EVENT MANAGER LISTENERS

Ref.eventManager.addEventListener('input', (event) => {
console.log('*input*')
let searchText = event.target.value.toLowerCase();
Ref.Centre.classList.add('showCentre');
Ref.Left.style.display = 'none';
this.searchEvents(searchText);
this.loadEventsList(this.searchArray, Ref.Storyteller, 'eventsManager');

//this.getEvent();
//this.addEventInfo();

})

Ref.eventManager.addEventListener('click', () => {
console.log('*click*')
Ref.Centre.classList.add('showCentre');
Ref.Left.style.display = 'none';
this.loadEventsList(load.Data.events, Ref.Storyteller, 'eventsManager');

})

// // NPC TAGS LISTENERS

// Ref.npcTags.addEventListener('input', (event) => {
// let searchText = event.target.value.toLowerCase();
// Ref.Centre.classList.add('showCentre');
// // Ref.Left.style.display = 'none';
// // Ref.Centre.style.display = 'none';
// this.searchTags(searchText); 
// this.showTags(this.searchArray);

// })

// Ref.npcTags.addEventListener('click', () => {
// Ref.Centre.classList.add('showCentre');
// Ref.Left.style.display = 'none';
// Ref.Centre.style.display = 'none';
// this.fillTagsArray();
// this.showTags(this.tagsArray);
// })

// LOCATION TAGS LISTENERS

// Ref.editLocationTags.addEventListener('input', (event) => {
// let searchText = event.target.value.toLowerCase();
// Ref.Centre.classList.add('showCentre');
// Ref.Left.style.display = 'none';
// // Call the searchAmbience function
// console.log(searchText)
// this.searchTags(searchText); 
// this.showTags(this.searchArray);

// })

// Ref.editLocationTags.addEventListener('click', () => {
// Ref.Centre.classList.add('showCentre');
// Ref.Left.style.display = 'none';
// this.fillTagsArray();
// this.showTags(this.tagsArray);
// })

// // EVENT TAGS LISTENERS

// Ref.eventTags.addEventListener('input', (event) => {
//   let searchText = event.target.value.toLowerCase();
//   Ref.Centre.classList.add('showCentre');
//   Ref.Left.style.display = 'none';
//   // Call the searchAmbience function
//   console.log(searchText)
//   this.searchTags(searchText); 
//   this.showTags(this.searchArray);
  
//   })
  
//   Ref.eventTags.addEventListener('click', () => {
//   Ref.Centre.classList.add('showCentre');
//   Ref.Left.style.display = 'none';
//   this.fillTagsArray();
//   this.showTags(this.tagsArray);
//   })

// // -- EVENTFORM LISTENERS

// Ref.eventSearch.addEventListener('click', () => {
// this.loadEventsList(load.Data.events, Ref.Centre)
// })

// Ref.eventLocation.addEventListener('click', () => {
// const subLocations = load.Data.events.filter(Event => Event.target === "Location");
// const allLocations = [...load.Data.locations, ...subLocations]

// this.loadLocationsList(allLocations);
// })

// Ref.eventLocation.addEventListener('input', (event) => {
// const subLocations = load.Data.events.filter(Event => Event.target === "Location");
// const allLocations = [...load.Data.locations, ...subLocations]

// let searchText = event.target.value.toLowerCase();

// if (searchText.trim() === '') {

// this.loadLocationsList(allLocations);

// } else if (!/^[a-zA-Z]+$/.test(searchText)) {
// // Turn into lower case for search.
// let searchText = event.target.value.toLowerCase();

// this.searchLocations(searchText);
// this.loadLocationsList(this.searchArray);

// } else {
// // Input box has valid content, proceed with the search.
// this.searchLocations(searchText);
// this.loadLocationsList(this.searchArray);
// }

// });

// Ref.eventNPC.addEventListener('click', () => {
// // NPCs.loadNPC(load.Data.npcs)
// })

// Ref.eventNPC.addEventListener('input', (event) => {
// let searchText = event.target.value.toLowerCase();
// NPCs.searchNPC(searchText);
// })

},

addEventsSearch: function() {
  // Ref.eventSearch.addEventListener('input', (event) => {
  // let searchText = event.target.value.toLowerCase();
  
  // // Call the searchAmbience function
  // this.searchEvents(searchText);
  // });
  
},

searchEvents: function(searchText) {
  this.searchArray = [];
  const uniqueEventIds = new Set();
  
  // 1. Search for Events with NPCs.
  NPCs.searchNPC(searchText);
  
  for (const npc of NPCs.npcSearchArray) {
    const filteredEvents = load.Data.events.filter((e) => {
      const eventNPC = e.npc.toLowerCase();
      const npcName = npc.name.toLowerCase();
      const npcTags = npc.tags.toLowerCase().split(',').map(tag => tag.trim());
      return eventNPC.includes(npcName) || npcTags.some(tag => eventNPC.includes(tag));
    });
      this.searchArray = this.searchArray.concat(filteredEvents);
    }

  // 2. Search for Events with searchText.
  const filteredEvents = load.Data.events.filter((e) => {
    const group = e.group.toLowerCase();
    const name = e.name.toLowerCase();
    const npc = e.npc.toLowerCase();
    const location = e.location.toLowerCase();
    return group.includes(searchText) || name.includes(searchText) || npc.includes(searchText) || location.includes(searchText);
  });

  // 3. Use Set to automatically remove duplicates.
  const uniqueSearchArray = new Set([...this.searchArray, ...filteredEvents]);
  this.searchArray = [...uniqueSearchArray];

  //Return search results to list.
  this.loadEventsList(this.searchArray, Ref.Centre);

},



searchLocations: function(searchText) {
  this.searchArray = [];
  //console.log('Searching for Locations including: ' + searchText);

  const searchArray1 = load.Data.locations.filter((location) => {
    
    const name = location.divId.toLowerCase();
    const tags = location.tags.toLowerCase(); // Assuming tags is a comma-separated list

    // Get the last term in the search text (or use the entire text if there is no comma)
    const lastTerm = searchText.split(',').map(term => term.trim()).pop();

    // Check if the name or any tag contains the last term in the search text
    return name.includes(lastTerm) || tags.includes(lastTerm) || tags.split(',').map(tag => tag.trim()).includes(lastTerm);
  });

  const searchArray2 = load.Data.events.filter((event) => {
    
    const name = event.name.toLowerCase();
    const location = event.location.toLowerCase(); // Assuming tags is a comma-separated list

    // Get the last term in the search text (or use the entire text if there is no comma)
    const lastTerm = searchText.split(',').map(term => term.trim()).pop();

    // Check if the name or any tag contains the last term in the search text
    return name.includes(lastTerm) || location.includes(lastTerm) || location.split(',').map(location => location.trim()).includes(lastTerm);
  });

  this.searchArray = [...searchArray1, ...searchArray2]

},

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

for (const NPC of load.Data.npcs) {
let tags = NPC.tags || [];

try{
tags = tags.split(',').map(keyword => keyword.trim());
this.tagsArray.push(...tags);
}catch{}

} // ----

for (const location of load.Data.locations) {
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

if (editor.editPage === 2){target = Ref.eventTags};
if (editor.editPage === 3){target = Ref.npcTags};

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
  Ref.Centre.innerHTML = '';
  Ref.Centre.style.display = 'block'; // Display the container

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
    Ref.Centre.appendChild(tagDiv);

    tagDiv.addEventListener('click', () => {
      this.addTag(tag);
    });
  }
},

addEventInfo(data){

//Search for Event in the Array   
const event = load.Data.events.find(event => event.name === data.name && event.target === data.target);

if (event) {

Ref.Left.innerHTML = ''; //Clear existing content.
Ref.Centre.innerHTML = ''; //Clear existing content.

// 1. NAME
const nameContainer = document.createElement('div');

let nameContent =  
`<h2><input 
class="centreName orange" 
type="text" 
divId="npcName"
value="${event.name}"></h2>`;

nameContainer.innerHTML = nameContent;
Ref.Centre.appendChild(nameContainer);

nameContainer.addEventListener('click', function() {
nameContainer.querySelector('.leftText').focus();
nameContainer.querySelector('.leftText').select();
});

// 2. Event Group
const tagsContainer = document.createElement('div');

let tagsContent =  
`<h3><input 
class="centreTag" 
type="text" 
divId= "npcTags"
value="${event.group}"></h3><hr>`;

tagsContainer.innerHTML = tagsContent;
Ref.Centre.appendChild(tagsContainer);

tagsContainer.addEventListener('click', function() {
tagsContainer.querySelector('.centreTag').focus();
tagsContainer.querySelector('.centreTag').select();
});

//3. Event Description
const backStoryText = document.createElement('textarea');
backStoryText.id = 'backStoryText';
backStoryText.classList.add('centreText'); 
backStoryText.textContent = event.description || 'Insert information about ' + event.name + ' here.';

//Attach and display.
Ref.Centre.appendChild(backStoryText);
Ref.Centre.style.display = 'block';

backStoryText.style.height = backStoryText.scrollHeight + 'px';

// Add event listener for input event
backStoryText.addEventListener('input', function() {
    // Set the height based on the scroll height of the content
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    
});

// 4. Event Target
const targetContainer = document.createElement('div');

let targetContent =  
`<h3>
<label class="expandable orange" 
data-content-type="rule" 
divId="labelTarget">
Target
</label>
<input 
class="leftText white" 
type="text" 
divId= "eventTarget"
value="${event.target}"></h3>`;

targetContainer.innerHTML = targetContent;
Ref.Left.appendChild(targetContainer);

targetContainer.addEventListener('click', function() {
targetContainer.querySelector('.leftText').focus();
targetContainer.querySelector('.leftText').select();
});

// 4. Event Location
const locationContainer = document.createElement('div');

let locationContent =  
`<h3>
<label class="expandable orange" 
data-content-type="rule" 
divId="labelLocation">
Location
</label>
<input 
class="leftText white" 
type="text" 
divId= "eventLocation"
value="${event.location}"></h3>`;

locationContainer.innerHTML = locationContent;
Ref.Left.appendChild(locationContainer);

locationContainer.addEventListener('click', function() {
locationContainer.querySelector('.leftText').focus();
locationContainer.querySelector('.leftText').select();
});

// 4. Event NPCs
const npcContainer = document.createElement('div');

let npcContent =  
`<h3>
<label class="expandable orange" 
data-content-type="rule" 
divId="labelNPCs">
NPCs
</label>
<input 
class="leftText white" 
type="text" 
divId= "eventNPCs"
value="${event.npc}"></h3>`;

npcContainer.innerHTML = npcContent;
Ref.Left.appendChild(npcContainer);

npcContainer.addEventListener('click', function() {
npcContainer.querySelector('.leftText').focus();
npcContainer.querySelector('.leftText').select();
});


// const formattedItem = eventInfo
// .filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
// .join(" ");

// Set the formatted content in the Centre element

} else {
console.log(`Event not found: ${data.event}`);

}

},

loadEventsList: function(data, target, origin) {

  target.innerHTML = '';
  Ref.Centre.style.display = 'block'; // Display the container

    data = data.sort((a, b) => {
    const locationA = a.location.toLowerCase();
    const locationB = b.location.toLowerCase();

    if (locationA === locationB) {
    const eventA = a.name.toLowerCase();
    const eventB = b.name.toLowerCase();

    // Custom function to handle events starting with numbers
    const compareEvents = (event1, event2) => {
    // Extract numbers from event names
    const numA = parseFloat(event1.match(/\d+(\.\d+)?/));
    const numB = parseFloat(event2.match(/\d+(\.\d+)?/));

    // If both events start with numbers, compare them numerically
    if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
    }

    // If only one of them starts with a number, prioritize it
    if (!isNaN(numA)) {
    return -1;
    } else if (!isNaN(numB)) {
    return 1;
    }

    // If none of them start with numbers, use localeCompare
    return event1.localeCompare(event2);
    };

    return compareEvents(eventA, eventB);
    }

    return locationA.localeCompare(locationB);
    });

// Move NPC Events after Location Events
const tempArray = [];
const locationsList = load.Data.locations.map(location => location.divId);

for (const event of data) {
if (event.target === 'Location' && (locationsList.includes(event.location) || event.location === 'All')) {
// If the event is a location, add it to the tempArray
tempArray.push(event);
}}

for (const event of data) {
if (event.target === 'NPC') {
// If the event is an NPC, find its corresponding location in tempArray
const index = tempArray.findIndex(locationEvent => locationEvent.name === event.location || locationEvent.location == event.location);

if (index !== -1 && tempArray[index].name === event.location) {
// If the corresponding location is found, insert the NPC event after it
tempArray.splice(index + 1, 0, event);

} else if(index !== -1 && tempArray[index].location === event.location){
//If wandering event, put before subLocations
tempArray.splice(index, 0, event);  
}
else {
// If the corresponding location is not found, add the NPC event to the end
tempArray.push(event);
}
}
}

// Update the data array with the events in the correct order
data = tempArray;

data = data.reduce((result, currentEvent, index, array) => {
  const reversedArray = array.slice(0, index).reverse();
  const lastLocationIndex = reversedArray.findIndex(event => event.target === 'Location' || event.location === currentEvent.location);
  
  if (currentEvent.target === 'Location'){
    
  if (lastLocationIndex === -1 || currentEvent.location !== reversedArray[lastLocationIndex].location) {
    // Insert <hr> when a new location is encountered after the last 'Location' event
    result.push({name: currentEvent.location, active: 1, locationSeparator: true, npc: currentEvent.npc, location: currentEvent.location });
  }
  }
  
  if (currentEvent.target === 'NPC'){

  if (array[index-1] === undefined || (currentEvent.location!== array[index - 1].location && currentEvent.location !== array[index - 1].name)) {
  // Insert <hr> when a new location is encountered after the last 'Location' event
  result.push({ name: currentEvent.location, active: 1, locationSeparator: true, npc: currentEvent.npc, location: currentEvent.location });
  }
  }

  result.push(currentEvent);
  return result;
}, []);

//Move currentLocation entries to the top.


let currentLocation = Ref.locationLabel.textContent;  

if(currentLocation !== ''){

  //Figure out for current location events:

    let startIndex = data.findIndex(event => event.locationSeparator && event.location === currentLocation);
    let nextSeparatorIndex = data.findIndex((event, index) => index > startIndex && event.locationSeparator);
    let eventsToMove = data.splice(startIndex, nextSeparatorIndex - startIndex);

  //Figure out for global events:

    let startIndexAll = data.findIndex(event => event.locationSeparator && event.location === "All");
    let nextSeparatorIndexAll = data.findIndex((event, index) => index > startIndexAll && event.locationSeparator);
    let eventsToMoveAll = data.splice(startIndexAll, nextSeparatorIndexAll - startIndexAll);

    data = [...eventsToMoveAll, ...eventsToMove, ...data];

}

if(data.filter(event => event.location === 'All').length > 0){

  //Figure out for global events:

    let startIndexAll = data.findIndex(event => event.locationSeparator && event.location === "All");
    let nextSeparatorIndexAll = data.findIndex((event, index) => index > startIndexAll && event.locationSeparator);
    let eventsToMoveAll = data.splice(startIndexAll, nextSeparatorIndexAll - startIndexAll);

    data = [...eventsToMoveAll, ...data];

}
 
let subLocationActive = true;

  //Format EventDiv and add NPCs BOOKMARK
  for (const event of data) {
    const eventNameDiv = document.createElement('div');

        //All Location
        if(event.location === 'All' && event.target === 'Location'){
          
          let allEventColour;

          if(event.active === 1){
          allEventColour = "lime"
          }
          else if(event.active === 0){
          allEventColour = "gray"
          }

          eventNameDiv.id = event.name;
          eventNameDiv.className = allEventColour;
          eventNameDiv.innerHTML = `<span>${event.name} </span>`;
          target.appendChild(eventNameDiv);


        } else
    
        //New Location
        if(event.locationSeparator === true){
        
        //Make an array of taggedEvents
        // const tagLocations = load.Data.events.filter(event => !locationsList.includes(event.location) && event.target === 'Location');
        // console.log(tagLocations);

        //Add locationSeparator
        eventNameDiv.classList.add('no-hover');
        eventNameDiv.innerHTML = `<hr><span class="cyan">${event.location}</span>`;
        target.appendChild(eventNameDiv);

        }

          //subLocation
          else if (event.target === 'Location'){

          let eventColour;

          if(event.active === 1){
          eventColour = "misc";
          subLocationActive = true;
          }
          else if(event.active === 0){
          eventColour = "lightgray";
          subLocationActive = false;
          }

          eventNameDiv.className = eventColour;
          eventNameDiv.innerHTML = `<span>${event.name} </span>`;
          target.appendChild(eventNameDiv);
          
        }

          //Active NPC Event
          else if(event.target === 'NPC'){
          
          let eventColour
          let npcColour
          let allEventColour

          if(event.active === 1){
          eventColour = "hotpink";
          npcColour = "teal";
          }
          else if(event.active === 0 || !subLocationActive){
          eventColour = "lightgray";
          npcColour = "gray";
          }

          if(event.location !== 'All'){
          eventNameDiv.className = eventColour;
          eventNameDiv.innerHTML = `<span>&nbsp;&nbsp;&nbsp;&nbsp;${event.name} </span>`;
          target.appendChild(eventNameDiv);

          NPCs.searchNPC(event.npc.toLowerCase());

          if(NPCs.npcSearchArray.length === load.Data.npcs.length){

          const npcNameDiv = document.createElement('div');
          npcNameDiv.className = npcColour;
          npcNameDiv.innerHTML = `<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Any</span>`;
          target.appendChild(npcNameDiv);

          }else 
          
          if(event.location === 'All'){
          
          //do nothing.

          }else{

          for (const npc of NPCs.npcSearchArray){
          const npcNameDiv = document.createElement('div');
          npcNameDiv.id = npc.name
          npcNameDiv.className = npcColour;
          npcNameDiv.innerHTML = `<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${npc.name} </span>`;
          target.appendChild(npcNameDiv);

          NPCs.fillNPCForm(npc,npcNameDiv);

          npcNameDiv.addEventListener('mouseover', () => {
          Ref.Left.style.display = 'block';
          Ref.Centre.style.display = 'block';
          NPCs.addNPCInfo(npcNameDiv.id, Ref.Left);
          });
          
          //Add div elements for 'All' Events affecting this NPC.
          const npcTags = npc.tags.split(',').map(word => word.trim());

          const allEvents = load.Data.events.filter(event => {
          const eventTags = event.npc.split(',').map(word => word.trim());
          return (
          event.location === 'All' &&
          (
          event.npc === npc.name || 
          npcTags.some(tag => eventTags.includes(tag))
          )
          );
          });

          for (const event of allEvents){
            
            if(event.active === 1){
              allEventColour = "fadepink"}
              else if(event.active === 0 || !subLocationActive){
              allEventColour = "darkgray";
              }

            const allEventDiv = document.createElement('div');
            allEventDiv.id = event.name;
            allEventDiv.className = allEventColour;
            allEventDiv.innerHTML = `<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${event.name} </span>`;
            target.appendChild(allEventDiv);

            allEventDiv.addEventListener('mouseover', () => {
            this.focusEvent = event.name;
            this.searchArray = [event]; // Assign an array with a single element
            this.addEventInfo(event);
            Ref.Left.style.display = 'block';
            });

            if(origin === 'eventsManager'){
              this.addCurrentEventNames(event, allEventDiv);
              }else if (editor.editPage === 2){
              this.fillEventForm(event, allEventDiv);
              }

          }
        
          }}

          } else

          if(event.location === 'All'){

          //Do nothing.

          }

          else{
          eventNameDiv.innerHTML = `<span class="lightgray">${event.name} </span>`;
          target.appendChild(eventNameDiv);
          };

        }
          if(origin === 'eventsManager'){
          this.addCurrentEventNames(event, eventNameDiv);
          }else{
          this.fillEventForm(event, eventNameDiv);
          }

          eventNameDiv.addEventListener('mouseover', () => {
          this.focusEvent = event.name;
          this.searchArray = [event]; // Assign an array with a single element
          this.addEventInfo(event);
          Ref.Left.style.display = 'block';
          });
}

const unassignedDiv = document.createElement('div');
unassignedDiv.classList.add('no-hover');
unassignedDiv.innerHTML = `<hr><span class="orange">Unassigned NPCs</span>`;
target.appendChild(unassignedDiv);

for (const npc of load.Data.npcs) {
  const npcNameDiv = document.getElementById(npc.name);
  const divExists = npcNameDiv !== null;

  if(!divExists){
    
    const npcNameDiv = document.createElement('div');
    npcNameDiv.id = npc.name
    npcNameDiv.className = "gray";
    npcNameDiv.innerHTML = `<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${npc.name} </span>`;
    target.appendChild(npcNameDiv);

    NPCs.fillNPCForm(npc,npcNameDiv);

    npcNameDiv.addEventListener('mouseover', () => {
    Ref.Left.style.display = 'block';
    Ref.Centre.style.display = 'block';
    NPCs.addNPCInfo(npcNameDiv.id, Ref.Left);
    });

  }
}


},

loadLocationsList: function(data) {
const Centre = document.getElementById('Centre'); // Do not delete!!
Centre.innerHTML = '';

const AllDiv = document.createElement('div');
AllDiv.innerHTML = "<span class= cyan>All</span>";
AllDiv.setAttribute('divId', 'All');
AllDiv.setAttribute('location', 'All');
Centre.appendChild(AllDiv);

//Loop through Data and make NameDivs
for (const location of data) {

  const locNameDiv = document.createElement('div');

if(location.divId){
  locNameDiv.innerHTML = `<span class="${location.tags !== undefined ? 'cyan' : ''}"><hr>${location.tags !== undefined ? `[${location.tags}]` : ''}
  </span> <span class="hotpink">${location.divId}</span>`;
  locNameDiv.setAttribute('divId', location.divId);
  locNameDiv.setAttribute('location', location.divId);
  Centre.appendChild(locNameDiv);
  
} else if(location.target === "Location") {
  locNameDiv.innerHTML = `<span class="${location.location !== undefined ? 'cyan' : ''}">${location.location === 'All' ? `[${location.location}]` : ''}
  </span><span class="misc">${location.name} </span>`;
  locNameDiv.setAttribute('divId', location.name);
  locNameDiv.setAttribute('location', location.location);
  Centre.appendChild(locNameDiv);
}

//Add CLICK Event to each NameDiv
locNameDiv.addEventListener('click', () => {
  const divId = locNameDiv.getAttribute('divId');
  Ref.eventLocation.value = divId;
});
}

// Convert HTMLCollection to an array
const divArray = [...Centre.children];

// Sort the array based on divId
divArray.sort((a, b) => {
  const divIdA = a.getAttribute('location');
  const divIdB = b.getAttribute('location');

  return divIdA.localeCompare(divIdB);
});

// Clear the Centre before appending sorted divs
Centre.innerHTML = '';

// Append the sorted divs to the Centre
divArray.forEach(div => {
  Centre.appendChild(div);
});


},

async getEvent(currentLocation, locObj) {
const activeEvents = [];
const subLocations = load.Data.events.filter(entry => entry.location === currentLocation)
const tags = locObj.tags

//console.log(currentLocation,locObj)
//console.log(load.Data.events)

//Search for events active by 'All', Location Name, or by Tag
for (const entry of load.Data.events) {
if (
    entry.active === 1 && 
  (
    (entry.location === "All") || 
    (entry.location.split(',').map(locItem => locItem.trim()).some(locItem => locItem === currentLocation)) ||
    (subLocations.some(subLoc => subLoc.name === entry.location)) ||
    (tags.split(',').map(item => item.trim()).some(tag => entry.location.split(',').map(locItem => locItem.trim()).includes(tag)))
  )
  ){activeEvents.push(entry);}
}

//For Events happening at the Location and not a subLocation, insert this into a random subLocation!
//Isolate these events, and then insert into NPCEvents with a random subLocation.


//Seperate activeEvents by Target (NPC||Location)
const npcEvents = activeEvents.filter(entry => entry.target === 'NPC');

const locationEvents = activeEvents.filter(entry => entry.target === 'Location');

const randEvents = activeEvents.filter(entry => entry.location === currentLocation && entry.target === 'NPC');

for(const event of randEvents){
const possibleLocations = locationEvents.filter(loc => loc.location !== 'All');

if(possibleLocations.length === 0){

const newsubLocation = {
  name: currentLocation,
  description: "",
  group: event.group,
  active: 1, 
  npc: event.npc, 
  target: "Location", 
  location: currentLocation
}

console.log(newsubLocation);
locationEvents.push(newsubLocation)

}
  
const randomIndex = Math.floor(Math.random() * possibleLocations.length);

const newEvent = {
  name: event.name,
  description: event.description,
  group: event.group,
  active: 1, 
  npc: event.npc, 
  target: event.target, 
  location: locationEvents[randomIndex].name
}

npcEvents.push(newEvent)

}


locationEvents.sort((a, b) => {
  // If a's location is 'All', it should come first
  if (a.location === 'All') return -1;
  // If b's location is 'All', it should come first
  if (b.location === 'All') return 1;
  
  // For other cases, compare based on the name property
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;

  return 0;
});

const allCount = locationEvents.filter(entry => entry.location === 'All').length;


// Create an array of matching NPC events for each Location event
const matchedEvents = locationEvents.map(locEvent => {
  const matchedNPCs = npcEvents.filter(npcEvent => npcEvent.location === locEvent.name);
  return {
    location: locEvent,
    npc: matchedNPCs,
  };
});

// Concatenate location description and NPC event descriptions
this.eventDesc = matchedEvents.map((entry, index) => {
let locDesc = '<br>';
let npcDesc = '';
let currentAll = index + 1;

//Get Items for SubLocation
const eventItems = this.addEventItems(entry.location.name);
let previousTag = '';
let previousType = '';
let eventItemsFormatted = '';

const eventItemsTagged = eventItems.map(item => {

  const tagToDisplay = item.tag !== previousTag ? `` : '';
  previousTag = item.tag;

  const typetoDisplay = item.Type !== previousType ? `<br><span class = 'underline'>${item.type}</span><br>` : '';
  previousType = item.type;

  return `${tagToDisplay}${typetoDisplay}#${item.name}#`;
  });

if(eventItemsTagged.length > 0){
eventItemsFormatted = `<span class = "cyan"> | </span> [Items List]{<hr>${eventItemsTagged.join('<br>')}}`;
}

//---

if (entry.location.location === 'All') {

  if (currentAll - allCount === 0 || allCount === 0) {
    //If last 'All' event or if there are no 'All' events, enter location description.
    locDesc = `<span class="all">${entry.location.description}</span> <br><br> ${locObj.description} <br><br><hr>`;
  } else {
    locDesc = `<span class="all">${entry.location.description}</span><br><br>`;
  }} 
  
  else if (entry.location !== 'All'){

//Generate NPC Divs
const presentNPCs = NPCs.getNPCs(entry.location.name, npcEvents);

if (entry.npc.length === 0) {
npcDesc += `<br> <span class = "cyan">There is nobody around. </span><br><br>`;
} else {
for (const npcWithStory of presentNPCs) {
const npcStory = npcWithStory.story;
npcDesc += `<span class="withbreak">${npcStory}</span><br>`;
}
}

//Put together.
locDesc = 
`<h3> ${entry.location.name !== currentLocation ? `<span class = "hotpink"> ${entry.location.name} </span>` : ''}` +
` ${eventItemsFormatted} </h3>` +         
  
`${entry.location.name !== currentLocation ? `<span class = "beige"><br> ${entry.location.description} </span> <br>` : ''}` + 

`<br>${npcDesc}` +

`<hr>`;
        
}
  return locDesc;
}).join('');
},

addCurrentEventNames(event, eventNameDiv){

  eventNameDiv.addEventListener('click', () => {
    Ref.eventManager.value = event.name;
    this.focusEvent = event.name;
    this.searchArray = [event]; // Assign an array with a single element
    this.addEventInfo(event);
    Ref.Left.style.display = 'block';
    });
  
},

addEventItems(event){

  let locationItems = '';

    // Filter itemsArray based on location Name and Tags
    const filteredItems = load.Data.items.filter(item => {
      const itemTags = item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : [];
      
      // Check if the item matches the criteria
      return (
        (itemTags.includes(event))
      );
    });

    // Format each item and add to this.inventory
    locationItems = filteredItems.map(item => ({
     Name: item.Name,
     Type: item.Type,
     Tag: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).find(tag => 
        tag === event) : ''}));

  // Sort the inventory alphabetically by item.tag and then by item.Name
  locationItems.sort((a, b) => {
    // Compare item.tag first
    if (a.tag > b.tag) return 1;
    if (a.tag < b.tag) return -1;

    // If item.Tags are the same, compare item.Type
    if (a.type > b.type) return 1;
    if (a.type < b.type) return -1;

    // If item.Type are the same, compare item.Name
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;

    return 0; // Both item.tag and item.Name are equal

});

    // Log the names of the items
    //console.log(locationItems)
    //console.log(locationItems.length !== 0 ? "Location Items:" + JSON.stringify(locationItems) : 'No location Items found.');
  
    return locationItems;
},

fillEventForm: function(event, ambienceNameDiv) {
// Add click event listener to each ambience name
ambienceNameDiv.addEventListener('click', () => {
Ref.eventId.value = event.id;
Ref.eventTags.value = event.group;
Ref.eventName.value = event.name;
Ref.eventNPC.value = event.npc;
Ref.eventLocation.value = event.location;
Ref.eventDescription.value = event.description;
Ref.eventForm.style.display = 'flex'; // Display the eventForm

//Check target and tick relevent box
if(event.target === 'NPC' && Ref.npcCheckbox.checked === false){
//Ref.npcCheckbox.checked = true;
Ref.npcCheckbox.click();
//Ref.locationCheck.checked = false;
}
else if(event.target === 'Location' && Ref.locationCheck.checked === false){
//Ref.locationCheck.checked = true;
Ref.locationCheck.click();
//Ref.npcCheckbox.checked = false;


}
});
},

saveEvent: function() {
  
  const index = load.Data.events.findIndex(event => event.id === parseInt(Ref.eventId.value) && event.name === Ref.eventName.value);

  let target;
  if (Ref.eventTarget.checked) {
      target = 'NPC';
  } else {
      target = 'Location';
  }

  const event = {
      id: parseInt(Ref.eventId.value), 
      active: 1,
      target: target,
      name: Ref.eventName.value,
      group: Ref.eventTags.value,
      description: Ref.eventDescription.value,
      location: Ref.eventLocation.value,
      npc: Ref.eventNPC.value,
  };

  if (index !== -1) {
      // Update the existing event entry
      load.Data.events[index] = event;
      console.log('Event updated:', event);
  } else {
      // Make a new event entry
      event.id = Array.generateUniqueId(load.Data.events, 'entry');
      Ref.eventId.value = event.id
      load.Data.events.push(event);
      console.log('Event added:', event);
  }

  this.loadEventsList(this.searchArray, Ref.Centre, 'eventsManager');
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


}

export default Events;

