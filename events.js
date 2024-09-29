import editor from "./editor.js"; 
import form from "./form.js";
import ref from "./ref.js";
import NPCs from "./npcs.js";
import load from "./load.js";
import helper from "./helper.js";
import expandable from "./expandable.js";
import party from "./party.js";
import battleMap from "./battleMap.js";



const Events = {

eventDesc: "",
eventsArray: [],
searchArray: [],
eventActions: [],
partyNPCs: [],

// _________________________________________________

makeDiv(type, obj, parent, color){

    const childDiv = document.createElement('div');
    let lineBreak = `<div style="margin-top: 5px;"></div>`
    
    //Add Div Attributes
    childDiv.id = obj.id;
    childDiv.setAttribute('key', obj.key);
    childDiv.setAttribute('type', type);
    
    //Prepare Content
    let divContent = `You should not be able to read this.`

    if(type === "header" || type == "inventory"){
    
        //Add Classes
        childDiv.classList.add("expandable");
        
        
        //Add Style
        //style="font-family:'SoutaneBlack'; 
        
        //Add Image
        let headerHR 
        
        if(obj.image !== ''){
        headerHR = obj.image;
        }else{
        headerHR = obj.key + "HR"
        };

        if(type === 'inventory'){

        divContent = `<br><h3>
        <span class="inventoryHeader" key="${obj.key}" id="${obj.id}" style="color:${obj.color}">
        ${obj.name}'s Inventory: </span>
 
        <hr name="${headerHR}" style="background-color:${obj.color}"><br>`;

        }else if(obj.key === 'npcs'){
       
        
                //Gather data on NPC.
                const npcArmourClass = this.getCurrentAC(obj)
        
                //Generate hitPointBoxes at HTML obj.
                const hitPointsBox = `<input 
                id="${obj.id}CurrentHP" 
                type="number" 
                class="hitPointBox"
                style="color: ${obj.color}"
                value="${obj.hitPoints}">`
        
        divContent = `<br><br>
        <h3 class='npcBlock'data-icon-id="icon-${obj.name}">
        
        <span class="npcName" style="color:${obj.color}" key="${obj.key}" 
        id="${obj.id}" type="${type}"> 
        ${obj.name} is here. </span>

        <span>
        <img class="inventory backpack" key="${obj.key}" id="${obj.id}" src="gifs/backpack.png" alt="Inventory" />
        </span>
        
        <hr name="${headerHR}" style="background-color:${obj.color}">
        
        LV: ${obj.level}| AC: ${npcArmourClass} | XP: ${obj.experience} | HP: ${hitPointsBox}
        
        </span></h3>`
        
        }else if(obj.key === 'tags'){

        divContent = `
        <h2 class="tagHead" id=${obj.id} key=${obj.key} style="color:${obj.color}"> ${obj.name} </h2>
        <hr name="${headerHR}" style="background-color:${obj.color}"> ${lineBreak}
        `

        }else{
        
        divContent = `<br><br>
        <h2 id=${obj.id} key=${obj.key} style="color:${obj.color}"> ${obj.name} </h2>
        <hr name="${headerHR}" style="background-color:${obj.color}"> ${lineBreak}
        `
        }
        
    
    }else{
    
    let keywords = expandable.generateKeyWords(load.Data);
    let chosenDesc = helper.filterRandomOptions(obj)
    let hyperDesc = expandable.findKeywords(chosenDesc, keywords, obj.name);
    
   childDiv.classList.add("expandable");
   childDiv.classList.add("withbreak");
    
    //Add Style
    if(color){
    color = obj.color;
    };
    
    if(type === 'backstory'){
    
    //Insert first sentence of Backstory
    let elipsis = obj.description.length > 130? '...': ''
    let backStory = obj.description;
    
        let extended = true;

        if(obj.description.length > 130){
        backStory = obj.description.substring(0, 130) + elipsis;
        extended = false;
        }

    hyperDesc = expandable.findKeywords(backStory, keywords, obj.name);
    
    divContent = `<span id=${obj.id} key=${obj.key} extended=${extended} class='backstory'>${hyperDesc}</span>`;
        
    }else if(type === "item"){
    
    childDiv.classList.remove("withbreak");
    divContent = obj.description;   
        
    }else if(type === 'action'){
    
    divContent = `<span class="npcAction" style="color:${color}" npcId="${obj.npcId}" eventID="${obj.id}"> ${obj.description.trim()} </span>`
    
    }else if(type === 'dialogue'){
    
    divContent = `${lineBreak}They say:
    <span class="npcDialogue" style="color:lime" npcId="${obj.npcId}" eventID="${obj.id}"> ${obj.description.trim()} </span>`
    
    }else if(type === 'ambience'){
    
    divContent = `<span class="ambience" style="color:${color}" id="${obj.id}" key="${obj.key}"> ${hyperDesc} </span>${lineBreak}`
        
    }else{

    divContent = `<span class="description" id="${obj.id}" key="${obj.key}"> ${hyperDesc} </span> 
    ${lineBreak}`
     
    }
    
    }
  
    
    childDiv.innerHTML = divContent;
    
    //Look for Header
    let parentKey = obj.key
    let parentId = obj.id
    
    if(parent.key){
    parentKey = parent.key
    parentId = parent.id
    }
    
    let foundHeader = ref.Storyteller.querySelector(`[key="${parentKey}"][id="${parentId}"][type="header"]`);
    
    if (foundHeader && parent.id !== 'leftExpand') {
        
        foundHeader.appendChild(childDiv);
    } else {    
        try{
        parent.appendChild(childDiv);
        }catch{console.log('Could not makeDiv:', type, obj, parent, color)}
    }
    
},


addToParty(){

//Erase npcs from Party
load.Data.miscInfo.party = load.Data.miscInfo.party.filter(member => member.type !== "npc")

//Add npcs to Party
this.partyNPCs.forEach(npc => {
load.Data.miscInfo.party.push({key: 'npcs', type: 'npc', id: npc.id});
})

const partyDisplay = ref.leftParty.style.display;

party.buildParty();
party.loadParty();


setTimeout(() => {
   battleMap.loadIcons()
}, 500); 


ref.leftParty.style.display = partyDisplay;

},

async getEvent(locObj) {

let allTags = Events.getAllTags(locObj);
let locAmbience = Events.filterKeyTag(allTags, "ambience");
let monsters = Events.filterKeyTag(allTags,"monsters");
let locNPCs = Events.filterKeyTag(allTags, "npcs");
let subLocations = Events.getAllSubLocations(locObj);
let floatNPCs = Events.getFloatingNPCs(locObj, locNPCs, subLocations);

this.partyNPCs = [];

Events.getLocationAmbience(locAmbience);
Events.getLocationDescription(locObj);
Events.getLocationMonsters(monsters)

if(subLocations.length > 0){
Events.makeSubLocations(locObj, subLocations, floatNPCs);
}

this.addToParty();

},

getLocationAmbience(locAmbience){

    //Takes an array of tags and passes the ambience descriptions on.
    
    if(locAmbience.length > 0){
    
    let ambObjs = [];
    
    locAmbience.forEach(tag => {
    
    let tagObj = helper.getObjfromTag(tag);
    let ambTags = tagObj.tags.filter(entry => entry.key === 'ambience');
    
    ambTags.forEach(tag => {
    
    let ambObj = helper.getObjfromTag(tag);
    ambObjs.push(ambObj)
    
    })
    });
    
    ambObjs.sort((a, b) => a.order - b.order);
   
    
    ambObjs.forEach(ambObj => {
    
    this.makeDiv("ambience", ambObj, ref.Storyteller, "color");
    
    })
    
  
    
    
    
    }},

getLocationMonsters(monsters){

 //Takes an array of tags and passes the ambience descriptions on.


    let monstPartyTags = [];
    
    monsters.forEach(tag => {
    
        let tagObj = helper.getObjfromTag(tag);
        let monstTags = tagObj.tags.filter(entry => entry.key === 'monsters');
        
        monstTags.forEach(tag => {
        monstPartyTags.push(tag)
        })
    })

    //Erase monsters from Party
    load.Data.miscInfo.party = load.Data.miscInfo.party.filter(member => member.key !== "monsters")

    //Add monsters to Party
    monstPartyTags.forEach(monster => {

    load.Data.miscInfo.party.push({key: 'monsters', id: monster.id, type:'monster', appearing: 'Wild'})

    })

    const partyDisplay = ref.leftParty.style.display;

    party.buildParty();
    party.loadParty();

    ref.leftParty.style.display = partyDisplay;
    
        
},

getAllTags(locObj){

let allTags = helper.getTagsfromObj(locObj);
allTags = allTags.filter(obj => obj.key === 'tags');

let childTags = [];
allTags.forEach(objTag => {
let tagEvents = helper.getTagsfromObj(objTag);
let hasChildren = tagEvents.filter(obj => obj.key === 'tags' && parseInt(obj.order) > parseInt(objTag.order));

if(hasChildren.length > 0){
hasChildren.forEach(tag => {
childTags.push(tag);
})};
});

allTags = [...allTags, ...childTags];

return allTags

},

filterKeyTag(allTags, key){

let keyTags = [];

allTags.forEach(objTag => {

let newTag = {key: objTag.key, id: objTag.id};
let tagEvents = helper.getTagsfromObj(objTag);
let hasKey = tagEvents.filter(obj => obj.key === key);

if(hasKey.length > 0){
keyTags.push(newTag)
}
});

keyTags = keyTags.concat();
return keyTags

},

getAllSubLocations(locObj){

let searchId = parseInt(locObj.id);
let filterData = [];

load.Data.subLocations.forEach(subLoc => {
let locSearch = subLoc.tags.filter(tag => tag.key === "locations" && parseInt(tag.id) === searchId);
if (locSearch.length === 1) {
filterData.push(JSON.parse(JSON.stringify(subLoc))); // Deep copy each object
}
});

let subLocations = [...filterData];
subLocations.sort((a, b) => a.order - b.order);

// if(subLocations.length === 0){
// //console.log('No Sublocations')
// const { description, ...locObjAsSubLoc } = locObj;
// locObjAsSubLoc.description = '';

// subLocations.push(locObjAsSubLoc)}

return subLocations;

},

getFloatingNPCs(locObj, locNPCs, subLocations){

//Add NPCs directly in Location to a random subLocation. 
let locNPCSearch = locObj.tags.filter(obj => obj.key === 'npcs');
let floatNPCs = [];

//get NPCs attached to the parentID
let parentId = parseInt(locObj.parentId)
let parentObj = load.Data.locations.find(entry => parseInt(entry.id) === parentId);

if(parentObj && parentObj.tags){
    let parentNPCs = parentObj.tags.filter(obj => obj.key === 'npcs');
    locNPCSearch = [...new Set([...locNPCSearch, ...parentNPCs])];
}

//Add NPCs in Location Tags to a random subLocation. NEED TO UPDATE
locNPCs.forEach(locNPC => {
const locTagObj = helper.getObjfromTag(locNPC);
let npcFilter = locTagObj.tags.filter(obj => obj.key === 'npcs');
let tagChance = locTagObj.chance

npcFilter.forEach(tag => {

const npc = helper.getObjfromTag(tag);
npc.access = tag.access;

//console.log(tag, npc)

//Roll for chance.
let chanceRoll = helper.rollDice(100);
let toBeat = parseInt(tagChance)
if(chanceRoll > toBeat){
//console.log(npc.name + ' failed roll', toBeat, chanceRoll)
return  
}

floatNPCs.push(JSON.parse(JSON.stringify(npc)))

})

});

locNPCSearch.forEach(npc => {
let npcObj = helper.getObjfromTag(npc);
npcObj.access = npc.access;
floatNPCs.push(JSON.parse(JSON.stringify(npcObj))); // Deep copy each object
});

floatNPCs.forEach(npc => {
let activeLocations = subLocations.filter(subLoc => parseInt(subLoc.active) === 1 || subLoc.key === 'locations');

//Filter for NPC Access
if(npc.access !== '*'){
activeLocations = activeLocations.filter(loc => parseInt(loc.access) === parseInt(npc.access) || loc.access === '*');
if(activeLocations.length === 0){
//console.log(npc.name + ' does not have correct access.')
}

}

let r = Math.floor(Math.random() * activeLocations.length);

try{
npc.location = activeLocations[r].id;
}catch{console.error('Could not assign npc.location to ' + npc.name)}
});

return floatNPCs


},

getLocationDescription(locObj){

//1. Get Location description.
if(locObj){
this.makeDiv("child", locObj, ref.Storyteller);
};

},

makeSubLocations(locObj, subLocations, floatNPCs){

subLocations.forEach((subLocation) =>{

//SubLocation Header
if(subLocation.key === 'subLocations'){
this.makeDiv("header", subLocation, ref.Storyteller, "color");
}

//Add NPCs to SubLocation
Events.getSubLocDetails(subLocation, floatNPCs, locObj);


});
},

// _________________________________________________

getSubLocDetails(subLocation, floatNPCs, locObj) {

let allObjs = Events.getAllObjs(subLocation)

let bundle = allObjs.bundle
let itemBundles = allObjs.containers
let locAccess = locObj.access
let npcBundle = Events.mergeNPCs(subLocation, bundle.npcs, floatNPCs, locAccess)

if(bundle.ambience){
bundle.ambience.forEach(ambience => {
this.makeDiv("ambience", ambience, subLocation, "color");
})
};

this.makeDiv("child", subLocation, ref.Storyteller);

if(npcBundle){
this.getNPCEvents(npcBundle, subLocation, locObj);
}

itemBundles.forEach(entry => {
Events.generateLocItems(entry.bundle, entry.tagObj);
})

},

getAllObjs(subLocation){

let subLocTags = subLocation.tags.filter(tag => tag.key !== "locations");
let containers = [];
let bundle = {};

bundle.npcs = [];

subLocTags.forEach(subLocTag => {

let tagObj = helper.getObjfromTag(subLocTag);

if(tagObj === undefined){return}
    
//Factor in Chance of NPCs from Tags Appearing.
if(tagObj.key === 'tags'){
    
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
//Only one chance that Tag will appear.

let chanceRoll = helper.rollDice(100);
let toBeat = parseInt(tagObj.chance)
if(chanceRoll > toBeat){
console.log('failed roll', toBeat, chanceRoll)
return  
}
}
}
    
//Add to Bundle
let tags = tagObj.tags;
let itemsHere = [];

tags.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);

if (!bundle[tagObj.key]) {
    bundle[tagObj.key] = []; 
}

bundle[tagObj.key].push(tagObj);

//If it is a Container
if(tag.key === 'items' && subLocTag.key === 'tags'){

//Factor in Chance of Item appearing in the Container
const chance = parseInt(tag.chance)
const roll = helper.rollDice(100)
if(roll > chance && !tag.special ){return}

itemsHere.push(tagObj)}
})

containers.push({bundle: itemsHere, tagObj: tagObj});
    
});

for (let key in bundle) {
    if (bundle[key] === undefined) {
      delete bundle[key];
    }
  }

return {containers, bundle}

},

mergeNPCs(subLocation, npcBundle, floatNPCs, locAccess){

//console.log(subLocation.name, floatNPCs)

//Add NPCs tagged directly to subLocation.
let directNPCs = subLocation.tags.filter(obj => obj.key === 'npcs');

if(directNPCs.length > 0){

directNPCs.forEach(tag => {
let directNPC = helper.getObjfromTag(tag);
npcBundle.push(directNPC);
})  
};


//Add NPCs appearing through Tag or from Location
floatNPCs.forEach(npc => {
if(npc.location === subLocation.id){npcBundle.push(npc)}
})

// Remove NPCs who are in the [P]arty.
let party = load.Data.miscInfo.party;
let partyMembers = party.filter(member => member.type === 'npc')
//console.log(partyMembers)

partyMembers.forEach(member => {
let filterBundle = npcBundle.filter(npc => npc.id !== parseInt(member.id));
npcBundle = filterBundle;
});


//Remove Duplicate NPCs
const npcMap = new Map(npcBundle.map(npc => [npc.id, npc]));
npcBundle = [...npcMap.values()];
//console.log(npcBundle.length + ' NPCs Merged')

return npcBundle

},

getNPCEvents(npcBundle, subLocation, locObj){

npcBundle.forEach(npc => {
this.partyNPCs.push({key: 'npcs', type: 'npc', id: npc.id});
})

//loop through npcBundle.
npcBundle.forEach(npc => {
//Add NPC to Storyteller.
if(npc){

this.makeDiv("header", npc, ref.Storyteller, "color")

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

//Parse out options.
const options = []; //??
const lines = event.description.split('\n');

// Filter lines based on their starting characters
lines.forEach(line => {
const trimmedLine = line.trim();
options.push(trimmedLine);
});

let dialogueToAdd = []
let actionsToAdd = []

//Repackage each option as own object. 
options.forEach(option => {

let type

//Check Random or Fixed
if (option.startsWith('??')) {
    type = 'random'
} else if (option.startsWith('**')) {
    type = 'fixed'
}

option = option.substring(2).trim();

const newObj = {

type: type,
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

if(npcActions.length > 0){

//Set starting event content. 
const firstAction = npcActions[0]
let selectedAction = 'You should not be able to see this!'

//Tee up for Dialogue
if(npcActions.length > 1){

const randomIndex = Math.floor(Math.random() * npcActions.length);
selectedAction = npcActions[randomIndex].description.trim();
const color = firstAction.color? firstAction.color: "lime";

this.makeDiv("action", firstAction, npc, color)

//Event only has one, permanent description.
}else{

selectedAction = npcActions[0].description.trim();
const color = firstAction.color? firstAction.color: "whitesmoke";
this.makeDiv("child", firstAction, npc, color)

}


}

//Insert NPC Backstory
this.makeDiv("backstory", npc, npc)

if(npcDialogue.length > 0){

//Set starting event content. 
const firstEvent = npcDialogue[0]
let selectedOption = 'You should not be able to see this!'

//Tee up for Dialogue
if(npcDialogue.length > 1){

const randomIndex = Math.floor(Math.random() * npcDialogue.length);
selectedOption = npcDialogue[randomIndex].description.trim();
const color = firstEvent.color? firstEvent.color: "lime";

this.makeDiv('dialogue', firstEvent, npc, color)


//Event only has one, permanent description.
}else{

selectedOption = npcDialogue[0].description.trim();
const color = firstEvent.color? firstEvent.color: "whitesmoke";
this.makeDiv("child", firstEvent, npc, color)

}}



}



});
},

generateLocItems(bundle, tag){

if(bundle.length > 0){
this.makeDiv('header', tag, ref.Storyteller, "color")
this.makeDiv('item', tag, tag)
}

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

let itemObj = helper.makeIteminfo(entry.item, entry.tag)

this.makeDiv("item", itemObj, tag)


})


}
});


bundle.forEach(item => {

if(item.special){return}

//Get Quantity and Bonus from Tag
const address = item.tags.find(address => parseInt(address.id) === parseInt(tag.id));
//console.log(item, address)
let itemObj = helper.makeIteminfo(item, address)

this.makeDiv("item", itemObj, tag)

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

if(npc.key === 'monsters'){return npc.armourClass};

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
let shieldAC = optionAC.slice(1);
npcArmourBonus =  npcArmourBonus + shieldAC;
return
}

if(npc.armourClass < optionObj.armourClass){
npcArmourClass = optionObj.armourClass
}
})

let finalAC = parseInt(npcArmourClass) + parseInt(npcArmourBonus);

return finalAC;
}

}

export default Events;

