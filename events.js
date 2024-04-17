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

//tags --> tagEvents
let locTagEvents = [];

locObjTags.forEach(obj => {
let tagEvents = helper.getTagsfromObj(obj.tags);
    tagEvents = tagEvents.filter(obj => obj.key === 'ambience' && parseInt(obj.active) === 1);

    tagEvents.forEach(tag => {
        locTagEvents.push(tag);
    })
})

locTagEvents.forEach(tag => {
Events.getAmbiencefromTag(tag);
this.eventDesc += `<br><br>`
});

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
this.eventDesc += `<br>`
this.eventDesc += subLocDesc;
//this.eventDesc += `<br><br>`

//Add NPCs to SubLocation
const npcStory = Events.generateNPCStory(subLocation);
this.eventDesc += npcStory;
});

},

generateNPCStory(subLocation) {

    let story = ``;
    
    let subLocationTags = subLocation.tags;
    
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
    
    let npcBundle = bundle.filter(obj => obj.key === 'npcs');
    let ambienceBundle = bundle.filter(obj => obj.key === 'ambience' && parseInt(obj.active) === 1);
    
    ambienceBundle.forEach(tag => {
    this.eventDesc += `<br><br>`
    Events.getAmbiencefromTag(tag);

    });
    
    npcBundle.forEach(npc => {
    
    let eventBundle = bundle.filter(obj => obj.key === 'events');
    
    story += `<h3><span 
    class="expandable" 
    style="font-family:'SoutaneBlack'; 
    color: ${npc.color}" data-content-type="npc" 
    divId="${npc.name.replace(/\s+/g, '-')}"> 
    ${npc.name} is here. </span></h3>`;
    
    //Insert first sentence of Backstory
    let firstPeriodIndex = npc.description.indexOf('.');
    let firstSentence = npc.description.slice(0, firstPeriodIndex + 1);
    
    
    story += `<span
    class="expandable"
    data-content-type="npc" 
    style="font-family:'SoutaneBlack'; color:mediumturquoise" 
    divId="${npc.name.replace(/\s+/g, '-')}"> ${firstSentence}</span> <br>`
    
    //Floating Tags (no subLocation) for NPCs
    let npcTags = npc.tags;
    
    npcTags.forEach(tag => {
    let isFloating = false;

    //Check inside Tag for subLocations, filter out.
    let floatTag = helper.getObjfromTag(tag);
    let floatCheck = floatTag.tags.filter(obj => obj.key === 'subLocations');
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
    
    story += 
    `<span 
    class="expandable"
    style="font-family:'SoutaneBlack'; color:${event.color}" 
    divId="${event.name}"
    data-content-type="events">${event.name}. </span>`;
    
    let eventDesc = helper.filterRandomOptions(event);
    story += eventDesc;
    story += `<br>`;
    
    })
    
    })
    
    })
    
    story += `<br>`;
    return story;
    
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
console.log('*blur*')
})

},

}

export default Events;

