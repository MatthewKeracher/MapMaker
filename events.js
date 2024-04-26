import editor from "./editor.js"; 
import form from "./form.js";
import ref from "./ref.js";
import NPCs from "./npcs.js";
import load from "./load.js";
import helper from "./helper.js";


const Events = {

eventDesc: "",
eventsArray: [],
searchArray: [],



async getEvent(locObj) {

this.eventDesc = '';

//LOCATION DESCRIPTION
if(locObj){
let locObjDesc = helper.filterRandomOptions(locObj);

//Location Wrapper
let locWrapper = 
`<span class="expandable"
id="${locObj.id}"
key="${locObj.key}"> ${locObjDesc} </span> `

this.eventDesc += locWrapper;
this.eventDesc += `<br>`
this.eventDesc += `<br>`
};

//LOCATION TAGS
// locObj.tags --> tags
let locObjTags = helper.getTagsfromObj(locObj);

// console.log('locObj.tags --> tags', locObjTags)
locObjTags = locObjTags.filter(obj => obj.key === 'tags');

//tags --> locAmbience & locNPCs
let locAmbience = [];
let locNPCs = [];
let childTags = [];

//Find Children.
locObjTags.forEach(objTag => {
    let tagEvents = helper.getTagsfromObj(objTag);
    let hasChildren = tagEvents.filter(obj => obj.key === 'tags' && parseInt(obj.order) > parseInt(objTag.order));

//Add Children
if(hasChildren.length > 0){
    hasChildren.forEach(tag => {
    childTags.push(tag);
    })};

});

locObjTags = [...locObjTags, ...childTags];

//Look inside each tag to see what's there.
locObjTags.forEach(objTag => {
let newTag = {key: objTag.key, id: objTag.id};
let tagEvents = helper.getTagsfromObj(objTag);
let hasAmbience = tagEvents.filter(obj => obj.key === 'ambience' && parseInt(obj.active) === 1);
let hasNPCs = tagEvents.filter(obj => obj.key === 'npcs');

hasAmbience.forEach(tag => {
locAmbience.push(tag);
});

//Fetch all location NPCs.
if(hasNPCs.length > 0){locNPCs.push(newTag)};
})

//Add Ambience for Location.
locAmbience.sort((a, b) => a.order - b.order);

locAmbience.forEach(tag => {
Events.getAmbiencefromTag(tag);
this.eventDesc += `<br><br>`
});

locNPCs = locNPCs.concat();


//SUBLOCATIONS
//subLocations ---> NPCs ---> NPC Events.
let searchKey = locObj.key;
let searchId = parseInt(locObj.id);
let filterData = [];

load.Data.subLocations.forEach(subLoc => {
    let locSearch = subLoc.tags.filter(tag => tag.key === searchKey && parseInt(tag.id) === searchId);
    if (locSearch.length === 1) {
        filterData.push(JSON.parse(JSON.stringify(subLoc))); // Deep copy each object
    }
});


//Make a copy of subLocations.
let subLocations = [...filterData];

subLocations.sort((a, b) => a.order - b.order);

//Add NPCs directly in Location to a random subLocation. 
let locNPCSearch = locObj.tags.filter(obj => obj.key === 'npcs');
let floatNPCs = [];

locNPCSearch.forEach(npc => {
    let npcObj = helper.getObjfromTag(npc);
    floatNPCs.push(JSON.parse(JSON.stringify(npcObj))); // Deep copy each object
});

floatNPCs.forEach(npc => {
let activeLocations = subLocations.filter(subLoc => parseInt(subLoc.active) === 1);
let r = Math.floor(Math.random() * activeLocations.length);
try{
npc.location = activeLocations[r].id;
}catch{console.error('No Active subLocations here.')}
});

//Add NPCs in Location Tags to a random subLocation. NEED TO UPDATE
locNPCs.forEach(locNPC => {
let locDie = subLocations.length;
let randomSubLoc = Math.floor(Math.random() * locDie)
subLocations[randomSubLoc].tags.push(locNPC)
});

subLocations.forEach((subLocation) =>{

//SubLocation Header
let subLocHeader = 
`<h2> <span class="expandable"
style="color:${subLocation.color}"
id="${subLocation.id}"
key="${subLocation.key}"> ${subLocation.name} </span> 
</h2>`

this.eventDesc += `<br><hr><br>`;
this.eventDesc += subLocHeader;

//SubLocation Description
let subLocDesc = helper.filterRandomOptions(subLocation);

//subLoc Wrapper
let subLocWrapper = 
`<span class="expandable"
id="${subLocation.id}"
key="${subLocation.key}"> ${subLocDesc} </span> `

this.eventDesc += `<br>`
this.eventDesc += subLocWrapper;

//this.eventDesc += `<br><br>`

//Add NPCs to SubLocation
Events.getSubLocDetails(subLocation, floatNPCs);

//Events.addLocDetails(locNPCs);

});

},


getSubLocDetails(subLocation, floatNPCs) {
    
let i = 0

subLocation.tags.forEach(tag => {

let bundle = []
//Tags in subLocation
let tagObj = helper.getObjfromTag(tag);

if(tagObj === undefined){console.error('No tagObj')}

let tags = tagObj.tags;

tags.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);

bundle.push(tagObj);

})


//filter out empty entries
bundle = bundle.filter(entry => entry !== undefined);

//get different data for subLocation
let npcBundle = tag.key !== 'locations'? bundle.filter(obj => obj.key === 'npcs'): [];
let ambienceBundle = bundle.filter(obj => obj.key === 'ambience' && parseInt(obj.active) === 1);
let itemBundle = bundle.filter(obj => obj.key === 'items');

ambienceBundle.forEach(tag => {
this.eventDesc += `<br><br>`
Events.getAmbiencefromTag(tag);

});

//add floatNPCs
floatNPCs.forEach(npc => {
if(npc.location === subLocation.id && i === 0){npcBundle.push(npc)}
})

npcBundle.forEach(npc => {

let eventBundle = bundle.filter(obj => obj.key === 'events');

this.eventDesc += `<h3><span 
class="expandable" 
style="font-family:'SoutaneBlack'; 
color: ${npc.color}" key="${npc.key}" 
id="${npc.id}"> 
${npc.name} is here. </span></h3>`;

//Insert first sentence of Backstory
let firstPeriodIndex = npc.description.indexOf('.');
let firstSentence = npc.description.slice(0, firstPeriodIndex + 1);

this.eventDesc += `<span
class="expandable"
key="${npc.key}" 
style="color:mediumturquoise" 
id="${npc.id}">${firstSentence} </span> <br>`

//Floating Tags (no subLocation) for NPCs:: //font-family: 'CenturyGothic', monospace; 
let npcTags = npc.tags;

npcTags.forEach(tag => {
let isFloating = false;

//Check inside Tag for subLocations, filter out.
let floatTag = helper.getObjfromTag(tag);
let floatCheck = floatTag.tags.filter(obj => obj.key === 'subLocations' || obj.key === 'locations');
if(floatCheck.length === 0){isFloating = true};

if(isFloating === true){

//add events tagged to tag to eventBundle

let eventsToAdd = floatTag.tags.filter(obj => obj.key === 'events');

eventsToAdd.forEach(tag => {

let event = helper.getObjfromTag(tag);

eventBundle.push(event)

})

};

});

//Resting Tags (no NPCs) in subLocation.
let restingTags = subLocation.tags;

restingTags.forEach(tag => {
let isResting = false;

//Check inside Tag for NPCs, filter out.
let restTag = helper.getObjfromTag(tag);
let restCheck = restTag.tags.filter(obj => obj.key === 'npcs');
if(restCheck.length === 0){isResting = true};

if(isResting === true){

//add events tagged to tag to eventBundle

let eventsToAdd = restTag.tags.filter(obj => obj.key === 'events');

if(eventsToAdd.length > 0){
eventsToAdd.forEach(tag => {

let event = helper.getObjfromTag(tag);

eventBundle.push(event)

})};

};

});

let uniqueEvents = [];
let uniqueEventIds = new Set();

//Filter out duplicate Events.
eventBundle.forEach(obj => {
    if (!uniqueEventIds.has(obj.id)) {
        uniqueEventIds.add(obj.id);
        uniqueEvents.push(obj);
    }
});

eventBundle = uniqueEvents;

eventBundle.sort((a, b) => a.order - b.order);
eventBundle.forEach(event => {

this.eventDesc += 
`<span 
class="expandable"
style="font-family:'SoutaneBlack'; color:${event.color}" 
id="${event.id}"
key="${event.key}">${event.name}. </span>`;

let eventDesc = helper.filterRandomOptions(event);
this.eventDesc += eventDesc;
this.eventDesc += `<br>`;

})

})

Events.generateLocItems(itemBundle, tagObj);
i++
})

this.eventDesc += `<br>`;

},

getAmbiencefromTag(obj){

if(obj.key === 'ambience'){
const ambienceObj = obj;
let ambienceDesc = helper.filterRandomOptions(ambienceObj);
//Ambience Wrapper
let ambienceWrapper = 
`<span class="expandable"
style="color:${ambienceObj.color}"
id="${ambienceObj.id}"
key="${ambienceObj.key}"> ${ambienceDesc} </span>`
this.eventDesc += ambienceWrapper;

}},

generateLocItems(bundle, tag){
//Header Wrapper
let header = 
`<h3><span 
class="expandable" 
style='color:${tag.color}'
id="${tag.id}"
key="${tag.key}"> ${tag.name}</span></h3>`

if(bundle.length > 0){
this.eventDesc += `<br>`
this.eventDesc += header
};

//Description Wrapper
let descWrapper = 
`<span 
class="expandable" 
id="${tag.id}"
key="${tag.key}"> ${tag.description}</span>`

if(bundle.length > 0){
this.eventDesc += descWrapper
this.eventDesc += `<br>`;
this.eventDesc += `<br>`;
};

//Takes tag.filter for items and returns Div.
bundle.forEach(item => {

//Items Wrapper
let wrapper = 
`<span class="expandable"
style="color:${item.color}"
id="${item.id}"
key="${tag.key}"> ${item.name} [${item.cost}] </span>`

this.eventDesc += wrapper;
this.eventDesc += `<br>`;

})

},

loadEventListeners(){

// -- EVENT MANAGER LISTENERS

ref.eventManager.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();
//editor.searchAllData(searchText, { items: load.Data.items });
editor.searchAllData(searchText,load.Data);

})

ref.eventManager.addEventListener('click', () => {
if(ref.eventManager.value !== ''){
let searchText = event.target.value.toLowerCase();
editor.searchAllData(searchText,load.Data);
}

})

ref.eventManager.addEventListener('blur', () => {
this.sectionHeadDisplay = 'none',
this.subSectionHeadDisplay = 'none',
this.subSectionEntryDisplay =  'none',
this.EntryDisplay = 'none'
})

},

}

export default Events;

