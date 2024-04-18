import editor from "./editor.js";
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
divId="${locObj.name}"
data-content-type="locations"> ${locObjDesc} </span> `

this.eventDesc += locWrapper;
this.eventDesc += `<br>`
this.eventDesc += `<br>`
};

//LOCATION AMBIENCE
// locObj.tags --> tags
let locObjTags = helper.getTagsfromObj(locObj.tags);

// console.log('locObj.tags --> tags', locObjTags)
locObjTags = locObjTags.filter(obj => obj.key === 'tags');

//tags --> locAmbience & locNPCs
let locAmbience = [];
let locNPCs = [];

//Look inside each tag to see what's there.
locObjTags.forEach(obj => {
let newTag = {key: obj.key, id: obj.id};
let tagEvents = helper.getTagsfromObj(obj.tags);
let hasAmbience = tagEvents.filter(obj => obj.key === 'ambience' && parseInt(obj.active) === 1);
let hasNPCs = tagEvents.filter(obj => obj.key === 'npcs');

hasAmbience.forEach(tag => {
locAmbience.push(tag);
});

if(hasNPCs.length > 0){locNPCs.push(newTag)};

})

locAmbience.forEach(tag => {
Events.getAmbiencefromTag(tag);
this.eventDesc += `<br><br>`
});

locNPCs = locNPCs.concat();


//SUBLOCATIONS
//subLocations ---> NPCs ---> NPC Events.
let searchKey = locObj.key;
let searchId = parseInt(locObj.id);
let subLocations = [];

load.Data.subLocations.forEach(subLoc =>{

let locSearch = subLoc.tags.filter(tag => tag.key === searchKey && parseInt(tag.id) === searchId);
if(locSearch.length === 1){subLocations.push(subLoc)}
})

subLocations.sort((a, b) => a.order - b.order);
subLocations.forEach(subLocation =>{

//SubLocation Header
let subLocHeader = 
`<h2> <span class="expandable"
style="color:${subLocation.color}"
divId="${subLocation.name}"
data-content-type="subLocations"> ${subLocation.name} </span> 
</h2>`

this.eventDesc += `<br><hr><br>`;
this.eventDesc += subLocHeader;

//SubLocation Description
let subLocDesc = helper.filterRandomOptions(subLocation);

//subLoc Wrapper
let subLocWrapper = 
`<span class="expandable"
divId="${subLocation.name}"
data-content-type="subLocations"> ${subLocDesc} </span> `

this.eventDesc += `<br>`
this.eventDesc += subLocWrapper;

//this.eventDesc += `<br><br>`

//Add NPCs to SubLocation

Events.getSubLocDetails(subLocation, locNPCs);
//Events.addLocDetails(locNPCs);

});

},


getSubLocDetails(subLocation, locationTags) {
//need to split locationTags up so that they appear uniquely, randomly dist' between subLocs.

let subLocationTags = [...subLocation.tags, ...locationTags]

subLocationTags.forEach(tag => {

//Tags in subLocation

let tagObj = helper.getObjfromTag(tag);
if(tagObj === undefined){console.error('No tagObj')}

let tags = tagObj.tags;

let bundle = []

tags.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);

bundle.push(tagObj);

})


//filter out empty entries
bundle = bundle.filter(entry => entry !== undefined);

//get different data for subLocation
let npcBundle = bundle.filter(obj => obj.key === 'npcs');
let ambienceBundle = bundle.filter(obj => obj.key === 'ambience' && parseInt(obj.active) === 1);
let itemBundle = bundle.filter(obj => obj.key === 'items');

ambienceBundle.forEach(tag => {
this.eventDesc += `<br><br>`
Events.getAmbiencefromTag(tag);

});

npcBundle.forEach(npc => {

let eventBundle = bundle.filter(obj => obj.key === 'events');

this.eventDesc += `<h3><span 
class="expandable" 
style="font-family:'SoutaneBlack'; 
color: ${npc.color}" data-content-type="npc" 
divId="${npc.name.replace(/\s+/g, '-')}"> 
${npc.name} is here. </span></h3>`;

//Insert first sentence of Backstory
let firstPeriodIndex = npc.description.indexOf('.');
let firstSentence = npc.description.slice(0, firstPeriodIndex + 1);


this.eventDesc += `<span
class="expandable"
data-content-type="npc" 
style="font-family: 'CenturyGothic', monospace; color:mediumturquoise" 
divId="${npc.name.replace(/\s+/g, '-')}"> ${firstSentence}</span> <br>`

//Floating Tags (no subLocation) for NPCs
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

if(eventsToAdd.lenght > 0){
eventsToAdd.forEach(tag => {

let event = helper.getObjfromTag(tag);

eventBundle.push(event)

})};

};

});

eventBundle.sort((a, b) => a.order - b.order);
eventBundle.forEach(event => {

this.eventDesc += 
`<span 
class="expandable"
style="font-family:'SoutaneBlack'; color:${event.color}" 
divId="${event.name}"
data-content-type="events">${event.name}. </span>`;

let eventDesc = helper.filterRandomOptions(event);
this.eventDesc += eventDesc;
this.eventDesc += `<br>`;

})

})

Events.generateLocItems(itemBundle, tagObj);

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
divId="${ambienceObj.name}"
data-content-type="ambience"> ${ambienceDesc} </span>`
this.eventDesc += ambienceWrapper;

}},

generateLocItems(bundle, tag){
//Header Wrapper
let header = 
`<h3><span 
class="expandable" 
style='color:${tag.color}'
divId="${tag.name}"
data-content-type="tags"> ${tag.name}</span></h3>`

if(bundle.length > 0){
this.eventDesc += `<br>`
this.eventDesc += header
};

//Description Wrapper
let descWrapper = 
`<span 
class="expandable" 
divId="${tag.name}"
data-content-type="tags"> ${tag.description}</span>`

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
divId="${item.name}"
data-content-type="items"> ${item.name} [${item.cost}] </span>`

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

