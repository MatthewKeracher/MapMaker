import editor from "./editor.js"; 
import form from "./form.js";
import ref from "./ref.js";
import NPCs from "./npcs.js";
import load from "./load.js";
import helper from "./helper.js";
import expandable from "./expandable.js";



const Events = {

eventDesc: "",
eventsArray: [],
searchArray: [],
eventActions: [],



async getEvent(locObj) {

this.eventDesc = '';
const keywords = expandable.generateKeyWords(load.Data)

//LOCATION DESCRIPTION
if(locObj){
let locObjDesc = helper.filterRandomOptions(locObj);
let hyperDesc = expandable.findKeywords(locObjDesc, keywords);

let locWrapper = 
`<span class="expandable extendable"
id="${locObj.id}"
key="${locObj.key}"> ${hyperDesc} </span> `

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
Events.getAmbiencefromTag(tag, keywords);
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

//Add NPCs in Location Tags to a random subLocation. NEED TO UPDATE
locNPCs.forEach(locNPC => {
// let activeLocations = subLocations.filter(subLoc => parseInt(subLoc.active) === 1);
// let r = Math.floor(Math.random() * activeLocations.length);
// try{
//     let randomSubLoc = activeLocations[r];
//     randomSubLoc.tags.push(locNPC)
//     }catch{console.error('No Active subLocations here.')}
const locTagObj = helper.getObjfromTag(locNPC);
let npcFilter = locTagObj.tags.filter(obj => obj.key === 'npcs');
let tagChance = locTagObj.chance

npcFilter.forEach(tag => {

    const npc = helper.getObjfromTag(tag);
        
    //Roll for chance.
    let chanceRoll = helper.rollDice(100);
    let toBeat = parseInt(tagChance)
    if(chanceRoll > toBeat){
    console.log(npc.name + ' failed roll', toBeat, chanceRoll)
    return  
    }

    floatNPCs.push(JSON.parse(JSON.stringify(npc)))
    
})

});

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

if(subLocations.length === 0){
console.log('no subLocations')
subLocations.push(locObj)}
 
subLocations.forEach((subLocation) =>{

let subLocHR 

if(subLocation.image !== ''){
    subLocHR = subLocation.image;
}else{
    subLocHR = "subLocHR"
}

//SubLocation Header
if(subLocation.key === 'subLocations'){
let subLocHeader = 
`<br><h2> <span class="expandable"
style="color:${subLocation.color}"
id="${subLocation.id}"
key="${subLocation.key}"> ${subLocation.name} </span> </h2>`


this.eventDesc += subLocHeader;
this.eventDesc += `<hr name="${subLocHR}" style="background-color:${subLocation.color}"><br>`;


//SubLocation Description
let subLocDesc = helper.filterRandomOptions(subLocation);

//Add Keywords
let hyperDesc = expandable.findKeywords(subLocDesc, keywords);

//subLoc Wrapper
let subLocWrapper = 
`<span class="expandable extendable"
id="${subLocation.id}"
key="${subLocation.key}"> ${hyperDesc} </span> `

// this.eventDesc += `<br>`
this.eventDesc += subLocWrapper;
}
//this.eventDesc += `<br><br>`

//Add NPCs to SubLocation
Events.getSubLocDetails(subLocation, floatNPCs, keywords, locObj);

//Events.addLocDetails(locNPCs);

});

},

getSubLocDetails(subLocation, floatNPCs, keywords, locObj) {

let bundle = []
let itemBundles = []

//Get all objs from tags and put into a big bundle.
subLocation.tags.forEach(subLocTag => {

let itemBundle = [];
//Tags in subLocation
if(subLocTag.key !== 'locations'){
let tagObj = helper.getObjfromTag(subLocTag);
if(tagObj === undefined){console.error('No tagObj')}

if(tagObj.key === 'tags'){
//console.log(tagObj.name)
//Resolve Chance of Appearing

if(tagObj.chance === 'or'){

    //Only One NPC from this tag will appear.

    let orObj = { ...tagObj };
    
    const orNPCs = orObj.tags.filter(tag => tag.key === 'npcs');
    const randNPC = Math.floor(Math.random() * orNPCs.length);
    const newOrNPCs = orNPCs.filter(npc => npc === orNPCs[randNPC]);
    orObj.tags = orObj.tags.filter(tag => tag.key !== 'npcs');
    orObj.tags = [...orObj.tags, ...newOrNPCs]
    tagObj = orObj
    console.log(tagObj)
    
    }else{

let chanceRoll = helper.rollDice(100);
let toBeat = parseInt(tagObj.chance)
if(chanceRoll > toBeat){
console.log('failed roll', toBeat, chanceRoll)
return  
}
}
}

//Add Item Containers to subLocation
let tags = tagObj.tags;

tags.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);
bundle.push(tagObj)

if(tag.key === 'items' && subLocTag.key === 'tags'){

//Resolve Chance of Appearing
const chance = parseInt(tag.chance)
const roll = helper.rollDice(100)
//console.log(tag)
if(roll > chance && !tag.special ){return}

itemBundle.push(tagObj)}
})

itemBundles.push({bundle: itemBundle, tagObj: tagObj});


}
});

//Filter out empty entries.
bundle = bundle.filter(entry => entry !== undefined);

//Parse out different bundles from big bundle.
let npcBundle = bundle.filter(obj => obj.key === 'npcs');
let ambienceBundle = bundle.filter(obj => obj.key === 'ambience' && parseInt(obj.active) === 1);


//Use ambienceBundle for subLocation ambience.
ambienceBundle.forEach(tag => {
this.eventDesc += `<br><br>`
Events.getAmbiencefromTag(tag, keywords);

});

//Add NPCs tagged directly to subLocation.
let npcTags = subLocation.tags.filter(obj => obj.key === 'npcs');

if(npcTags.length > 0){

   npcTags.forEach(tag => {
    let subLocNPC = helper.getObjfromTag(tag);
    npcBundle.push(subLocNPC)
})  
};

//Add floatNPCs.
floatNPCs.forEach(npc => {
if(npc.location === subLocation.id){npcBundle.push(npc)}
})

//Remove NPCs who are in the [P]arty.
let partyMembers = load.Data.miscInfo.party;
partyMembers.forEach(member => {
let filterBundle = npcBundle.filter(npc => npc.id !== parseInt(member.id));
npcBundle = filterBundle;
});

this.getNPCEvents(npcBundle, keywords, subLocation, locObj);
this.eventDesc += `<br>`;

itemBundles.forEach(entry => {

Events.generateLocItems(entry.bundle, entry.tagObj);

})

},

getNPCEvents(npcBundle, keywords, subLocation, locObj){
//loop through npcBundle.
npcBundle.forEach(npc => {

//Add NPC to Storyteller.
if(npc){
//Insert NPC Image
let npcHR 

if(npc.image !== ''){
npcHR = npc.image;
}else{
npcHR = 'fighterHR' //npc.class.toLowerCase().replace(/\s+/g, '') + 'HR';
}

//Gather data on NPC.
const npcArmourClass = this.getCurrentAC(npc)


//Generate hitPointBoxes at HTML obj.
const hitPointsBox = `<input 
id="${npc.id}CurrentHP" 
type="number" 
class="hitPointBox"
style="color: ${npc.color}"
value="${npc.hitPoints}">`

const npcHTML = `
<h3><span 
class="expandable" 
style="font-family:'SoutaneBlack'; 
color: ${npc.color}" key="${npc.key}" 
id="${npc.id}"> 
${npc.name} is here.</span><hr name="${npcHR}" style="background-color:${npc.color}">LV: ${npc.level}| AC: ${npcArmourClass} |   XP: ${npc.experience} | HP: ${hitPointsBox}</span> </h3> <br>`;
   
//Insert NPC
this.eventDesc +=`${npcHTML}`;


//Make eventBundle with events tagged to NPC directly.
let eventBundle = [] //npc.tags.filter(tag => tag.key === 'events');

//Get events from Tags where NPC is in Tag.
let tagsBundle = npc.tags.filter(tag => tag.key === 'tags');

//Of all tags for NPC only want tags linked to this location, subLocation, or floating.
const presentTagObjs = [];

//Look at tags inside each bundleTag for the current subLocation.
tagsBundle.forEach(bundleTag => {

const tagObj = helper.getObjfromTag(bundleTag);

tagObj.tags.forEach(tag => {
//Add tag if tagged to subLocation
if(tag.key === 'subLocations' && parseInt(tag.id) === parseInt(subLocation.id) ||
tag.key === 'locations' && parseInt(tag.id) === parseInt(locObj.id)){
presentTagObjs.push(tagObj);
}

//Check to see if there are no subLocations or Locations in the bundleTag.
let floatCheck = tagObj.tags.filter(obj => obj.key === 'subLocations' || obj.key === 'locations');
if(floatCheck.length === 0){
presentTagObjs.push(tagObj)
};

//Add tag if tagged to location.
//...

});


});

//Of presentTagObjs, want to bundle only the events in these tags.
presentTagObjs.forEach(presentTagObj => {   
const eventTags = presentTagObj.tags.filter(tag => tag.key === 'events'); 
const eventObjs = [];
eventTags.forEach(eventTag => { 
const eventObj = helper.getObjfromTag(eventTag);
eventObjs.push(eventObj);
});
eventBundle = [...eventBundle, ...eventObjs]
});

//Add Events from SubLocation for all NPCs present.
let restingTags = [...subLocation.tags, ...locObj.tags]

restingTags.forEach(tag => {
let isResting = false;

//Check inside Tag for NPCs, filter out.
let restTag = helper.getObjfromTag(tag);
let restCheck = restTag.tags.filter(obj => obj.key === 'npcs');
if(restCheck.length === 0){isResting = true};

if(isResting === true && restTag.key === 'tags'){

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
//console.log("eventBundle", eventBundle)


eventBundle.forEach(obj => {
    if (!uniqueEventIds.has(obj.id)) {
        uniqueEventIds.add(obj.id);
        uniqueEvents.push(obj);
    }

});

eventBundle = uniqueEvents;

let npcDialogue = [];
let npcActions = [];

//Sort Events by Order
eventBundle.sort((a, b) => a.order - b.order);
eventBundle.forEach(event => {

//Roll Chance for Events.
let chanceRoll = helper.rollDice(100);
let toBeat = parseInt(event.chance)
if(chanceRoll > toBeat){
console.log('roll Failed')
return  
}

//Check to see if Event is Active
if(parseInt(event.active) === 0){return}

//Filter if use of <<??>> in description.
let options = event.description.split('??').filter(Boolean);

let dialogueToAdd = []
let actionsToAdd = []

//Repackage each option as own object. 
options.forEach(option => {

const newObj = {

    id: event.id,
    npcId: npc.id,
    key: event.key,
    name: event.name, 
    color: event.color,
    description: option

}


if(option.charAt(0) === '"'){
dialogueToAdd.push(newObj)
}else{
actionsToAdd.push(newObj)
}

});

npcDialogue = [...npcDialogue, ...dialogueToAdd];
npcActions  = [...npcActions, ...actionsToAdd];

//Add to global arrays for helper.updateEventContent()
this.eventDialogue = [...this.eventDialogue, ...dialogueToAdd];
this.eventActions  = [...this.eventActions, ...actionsToAdd];

});

let lineBreak = `<div style="margin-top: 5px;"></div>`

if(npcActions.length > 0){

    //Set starting event content. 
    const firstAction = npcActions[0]
    let selectedAction = 'You should not be able to see this!'
    
    //Tee up for Dialogue
    if(npcActions.length > 1){
    
    const randomIndex = Math.floor(Math.random() * npcActions.length);
    selectedAction = npcActions[randomIndex].description.trim();
    const color = firstAction.color? firstAction.color: "lime";
    this.eventDesc += `<span class="npcAction" style="color:${color}" npcId="${firstAction.npcId}" eventID="${firstAction.id}"> ${selectedAction} </span>`;
    this.eventDesc += lineBreak
    //Update Global Array for helper.updateEventContent();
    // this.eventsDialogue = npcActions
    
    //Event only has one, permanent description.
    }else{
    
    selectedAction = npcActions[0].description.trim();
    const color = firstAction.color? firstAction.color: "whitesmoke";
    this.eventDesc += `<span class="npcAction" style="color:${color}" eventID="${firstAction.id}"> ${selectedAction} </span>`;
    this.eventDesc += lineBreak
    
    }

    
}

if(npcDialogue.length > 0){

//Set starting event content. 
const firstEvent = npcDialogue[0]
let selectedOption = 'You should not be able to see this!'

//Tee up for Dialogue
if(npcDialogue.length > 1){

const randomIndex = Math.floor(Math.random() * npcDialogue.length);
selectedOption = npcDialogue[randomIndex].description.trim();
const color = firstEvent.color? firstEvent.color: "lime";
this.eventDesc += `<span class="npcDialogue" style="color:lime" npcId="${firstEvent.npcId}" eventID="${firstEvent.id}"> ${selectedOption} </span>`;
this.eventDesc += lineBreak

// //Update Global Array for helper.updateEventContent();
// this.eventsDialogue = npcDialogue


//Event only has one, permanent description.
}else{

selectedOption = npcDialogue[0].description.trim();
const color = firstEvent.color? firstEvent.color: "whitesmoke";
this.eventDesc += `<span class="npcDialogue" style="color:${color}" eventID="${firstEvent.id}"> ${selectedOption} </span>`;
this.eventDesc += lineBreak

}}


//Insert first sentence of Backstory
let firstPeriodIndex = npc.description.indexOf('.');
let elipsis = npc.description.length > 130? '...': ''
let firstSentence = npc.description.substring(0, 130) + elipsis; //slice(0, firstPeriodIndex + 1);
//Add Keywords
let hyperDesc = expandable.findKeywords(firstSentence, keywords);

//Insert NPC Information
this.eventDesc += `<span
class="extendable"
showHide="hide"
key="${npc.key}" 
style="color:whitesmoke" 
id="${npc.id}">${hyperDesc} </span> <br><br>`
}

});
},

getAmbiencefromTag(obj, keywords){

if(obj.key === 'ambience'){
const ambienceObj = obj;
let ambienceDesc = helper.filterRandomOptions(ambienceObj);

//Add Keywords
let hyperDesc = expandable.findKeywords(ambienceDesc, keywords);

//Ambience Wrapper
let ambienceWrapper = 
`<span class="expandable"
style="color:${ambienceObj.color}"
id="${ambienceObj.id}"
key="${ambienceObj.key}"> ${hyperDesc} </span>`
this.eventDesc += ambienceWrapper;

}},

generateLocItems(bundle, tag){

//console.log(bundle, tag)
//Resolve Image
let itemHR

if(tag.image && tag.image !== ''){
itemHR = tag.image;
}else{
itemHR = 'itemHR'
}

//Header Wrapper
let header = 
`<h3><span 
class="expandable" 
style='color:${tag.color}'
id="${tag.id}"
key="${tag.key}"> ${tag.name}</span></h3><hr name=${itemHR} style="background-color:${tag.color}"> <br>`;

if(bundle.length > 0){
this.eventDesc += `<br><br>`
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
};

//Takes tag.filter for items and returns Div.

//Add Items generated randomly through tags to Containers
bundle.forEach(item => {

if(item.special === 'instruction'){

//Get full Instriction information.
let instruction = tag.tags.find(instruction => instruction.id === item.id)
let newItems = helper.followInstructions(instruction, tag)

newItems.forEach(entry => {

//Resolve Chance of Appearing
const chance = parseInt(entry.tag.chance)
const roll = helper.rollDice(100)
//console.log(tag)
if(roll > chance){return}

let itemInfo = helper.makeIteminfo(entry.item, entry.tag)

let wrapper = 
`<span class="expandable"
style="color:${entry.item.color}"
id="${entry.item.id}"
key="${entry.item.key}">${itemInfo}</span>`;

this.eventDesc += wrapper;


})


}
});


bundle.forEach(item => {

if(item.special){return}

//Get Quantity and Bonus from Tag
const address = item.tags.find(address => parseInt(address.id) === parseInt(tag.id));
//console.log(item, address)
let itemInfo = helper.makeIteminfo(item, address)

let wrapper = 
`<span class="expandable"
style="color:${item.color}"
id="${item.id}"
key="${item.key}">${itemInfo}</span>`;

this.eventDesc += wrapper;

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

getCurrentAC(npc){
//Check for Highest AC Value.
const itemTags = npc.tags.filter(tag => tag.key === 'items')

//Add tags from Tags of same key, so an item or spell gained through a Tag.
let keyTags = npc.tags.filter(entry => entry.key === "tags");
keyTags.forEach(tag => {

    const tagObj = helper.getObjfromTag(tag);
    let associatedTags = tagObj.tags.filter(tag => tag.key === 'items' || tag.key === 'spells');
    
    associatedTags.forEach(tag => {

    //Add into NPC's tags
    itemTags.push(tag);

    }) })


let npcArmourClass = npc.armourClass; //Default Value
let npcArmourBonus = '';

itemTags.forEach(option => {

const optionObj = helper.getObjfromTag(option);
const optionAC = optionObj.armourClass;
const shieldCheck = optionAC? optionAC.toString().charAt(0) : '';
const isShield = shieldCheck === '+'

if(isShield){
npcArmourBonus = +npcArmourBonus + +optionAC;
return
}

if(npc.armourClass < optionObj.armourClass){
npcArmourClass = optionObj.armourClass
}
})

return npcArmourClass + npcArmourBonus;
}

}

export default Events;

