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

//Location Description.
if(locObj){
let locObjDesc = Events.filterRandomOptions(locObj);

//Location Wrapper
let locWrapper = 
`<span class="expandable"
divId="${locObj.name}"
data-content-type="locations"> ${locObjDesc} </span> `

this.eventDesc += locWrapper;
this.eventDesc += `<br>`
};

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
this.eventDesc += `<br>`
});

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

this.eventDesc += subLocHeader;

//SubLocation Description
let subLocDesc = Events.filterRandomOptions(subLocation);
this.eventDesc += subLocDesc;
this.eventDesc += `<br><br>`

//Add NPCs to SubLocation
const npcStory = NPCs.generateNPCStory(subLocation);
this.eventDesc += npcStory;
});

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
    this.eventDesc += `<br>`

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

