import editor from "./editor.js";
import ref from "./ref.js";
import NPCs from "./npcs.js";
import load from "./load.js";



const Events = {

eventDesc: "",
eventsArray: [],
searchArray: [],



async getEvent(currentLocation, locObj) {

this.eventDesc = '';

//LOCATION DESCRIPTION
if(locObj){
let locObjDesc = Events.filterRandomOptions(locObj);

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
let locObjTags = Events.getTagsfromObj(locObj.tags);
// console.log('locObj.tags --> tags', locObjTags)

//tags --> tagEvents
let locTagEvents = [];
locObjTags.forEach(obj => {
locTagEvents = Events.getTagsfromObj(obj.tags);
// console.log('tags --> tagEvents', locTagEvents)
})

locTagEvents.forEach(tag => {
Events.getAmbiencefromTag(tag);
});

this.eventDesc += `<br>`

//SUBLOCATIONS
//subLocations ---> NPCs ---> NPC Events.
const subLocations = load.Data.subLocations.filter(entry => entry.location === currentLocation)
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
let subLocDesc = Events.filterRandomOptions(subLocation);
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
    let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
    let tags = load.Data[tag.key][index].tags;
    
    let bundle = []
    
    tags.forEach(tag => {
    
    let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
    let obj = load.Data[tag.key][index]
    bundle.push(obj);
    
    })
    
    //filter out empty entries
    bundle = bundle.filter(entry => entry !== undefined);
    
    let npcBundle = bundle.filter(obj => obj.key === 'npcs');
    let ambienceBundle = bundle.filter(obj => obj.key === 'ambience');
    
    ambienceBundle.forEach(tag => {
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
    let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
    
    //Check inside Tag for subLocations, filter out.
    let floatTag = load.Data[tag.key][index];
    let floatCheck = floatTag.tags.filter(obj => obj.key === 'subLocations');
    if(floatCheck.length === 0){isFloating = true};
    
    if(isFloating === true){
    
    //add events tagged to tag to eventBundle
    
    let eventsToAdd = floatTag.tags.filter(obj => obj.key === 'events');
    
    eventsToAdd.forEach(tag => {
    
    let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
    let event = load.Data[tag.key][index];
    
    eventBundle.push(event)
    
    })
    
    };
    
    });
    
    eventBundle.forEach(event => {
    
    story += 
    `<span 
    class="expandable"
    style="font-family:'SoutaneBlack'; color:${event.color}" 
    divId="${event.name}"
    data-content-type="events">${event.name}. </span>`;
    
    let eventDesc = Events.filterRandomOptions(event);
    story += eventDesc;
    story += `<br>`;
    
    })
    
    })
    
    })
    
    story += `<br>`;
    return story;
    
    },

filterRandomOptions(obj){

let returnDesc

//Filter if use of <<??>> in description.
const options = obj.description.split('??').filter(Boolean);

if (options.length > 0) {
const randomIndex = Math.floor(Math.random() * options.length);
const selectedOption = options[randomIndex].trim();

returnDesc = `${selectedOption}`;
} else {
returnDesc = `${obj.description}`;
}

return returnDesc;

},

getTagsfromObj(tags){

let array = [];

tags.forEach(tag => {

let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
let tagObj = load.Data[tag.key][index];

array.push(tagObj);
})


//console.log(array)
return array;

},

getAmbiencefromTag(obj){
if(obj.key === 'ambience'){
const ambienceObj = obj;
let ambienceDesc = Events.filterRandomOptions(ambienceObj);

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

