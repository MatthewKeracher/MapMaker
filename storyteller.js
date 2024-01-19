import Array from "./array.js";
import Events from "./events.js";
import Monsters from "./monsters.js";
import NPCs from "./npcs.js";
import Items from "./items.js";
import Spells from "./spells.js";
import Edit from "./edit.js";
import Ref from "./ref.js";

const Storyteller = {

miscArray: [],
monsterArray:[],

async changeContent(locationDiv) {

let Story = ``

const locationName = locationDiv.id;
const locationObject = Array.locationArray.find(entry => entry.divId === locationName);

Ref.locationLabel.textContent = locationName;
Ref.editLocationName.value   = locationName;

//console.log('Tags : ' + locationObject.tags)

if (locationObject) {
//name the returned locationObject data 
Events.getEvent(locationName, locationObject.tags);

//Add locationItmems
const locationItems = this.addLocationItems(locationObject);
const locationItemsFormatted = `[${locationName} Items List]{<hr><br><br> #${locationItems.join('# <br><br>#')}#}`;

const locationText = '<br>' + Events.eventDesc + '<br><br>' + locationItemsFormatted + '<br><br>' + locationObject.description;

this.miscArray = [];
this.monsterArray = [];
const squareCurly = this.getMisc(locationText, this.miscArray);


const formattedMonsters = await Monsters.getMonsters(squareCurly);
const formattedSpells = await Spells.getSpells(formattedMonsters);
const formattedLocation = await Items.getItems(formattedSpells);
//console.log(presentMonsters)



const location = Ref.locationLabel.textContent;
const presentNPCs = NPCs.getNPCs(location, Events.phase);



Story += `
<span class="withbreak">${formattedLocation}</span>
`;

if (presentNPCs.length === 0) {
Story += `<br> There is nobody around.`;
} else {
for (const npcWithStory of presentNPCs) {
const npcStory = npcWithStory.story;
Story += `<span class="withbreak">${npcStory}</span>`;
}
}

//Apply formattedStory to Storyteller
Ref.Storyteller.innerHTML = Story;

//Update Editor Content
Ref.textLocation.value = locationObject.description;
//console.log(locationObject.tags)
Ref.editLocationTags.value = locationObject.tags;

if(Edit.editPage === 2){
  Events.loadEventsList(Events.eventsArray);
}else if (Edit.editPage === 3){
  NPCs.loadNPC(NPCs.npcArray)
}

this.showExtraContent()

};
}, 

getQuotes(locationText) {
  const quotationMarks = /"([^"]+)"/g;

  return locationText.replace(quotationMarks, (match, targetText) => {
      return `<span class="hotpink">"${targetText}"</span>`;
  });
},

addMiscInfo(contentId, miscArray) {
const extraContent = document.getElementById('extraContent');  
const MiscItem = miscArray.find(item => item.square === contentId);
  
  if (MiscItem) {
    const withMonsters = Monsters.getMonsters(MiscItem.curly);
    const withItems = Items.getItems(withMonsters);
    const withSpells = Spells.getSpells(withItems); 
    const miscInfo = [ 
      
    `<br><h3><span class="misc">${MiscItem.square}</span></h3>
    <span class="withbreak">${withSpells}</span>`]

    extraContent.innerHTML = miscInfo;
  } else {
    console.log(`Square curly combo with square "${contentId}" not found in the comboArray.`);
  }
},

addLocationItems(locationObject){

  let locationItems = '';

    // Filter itemsArray based on location Name and Tags
    const filteredItems = Items.itemsArray.filter(item => {
      const itemTags = item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : [];
  
      // Check if the item matches the criteria
      return (
        (itemTags.includes(locationObject.divId)) ||
        (locationObject.tags && locationObject.tags.split(',').map(tag => tag.trim()).some(tag => itemTags.includes(tag)))
      );
    });
  
    // Format each item and add to this.inventory
    locationItems = filteredItems.map(item => item.Name);
  
    // Log the names of the items
    console.log(locationItems.length !== 0 ? "Location Items:" + JSON.stringify(locationItems) : 'No location Items found.');
  
    return locationItems;
},


getMisc(locationText, comboArray) {
  const squareBrackets = /\[([^\]]+)\]\{([^}]+)\}/g;

  const matches = [...locationText.matchAll(squareBrackets)];
  let updatedText = locationText;

  for (const match of matches) {
    const square = match[1];
    const curly = match[2];

    const replacement = `<span class="expandable misc" data-content-type="misc" divId="${square}">${this.getQuotes(square)}</span>`;

    updatedText = updatedText.replace(match[0], replacement);

    // Store the square curly combo in the provided array
    comboArray.push({ square, curly });
  }

  return updatedText;
},


showExtraContent() {
  const expandableStoryteller = Ref.Storyteller.querySelectorAll('.expandable');
  const target = 'ExtraContent'
  
            // console.log('List all divs found for expandableStoryteller:');
            // expandableStoryteller.forEach((div, index) => {
            //   console.log(`Div ${index + 1}:`);
            //   console.log('Element:', div);
            //   console.log('Text Content:', div.textContent);
            //   console.log('Data Attributes:', div.dataset);
            // });            

 expandableStoryteller.forEach(expandableElement => {
    expandableElement.addEventListener('mouseenter', (event) => {
      
      const contentType = event.target.getAttribute('data-content-type');
      const contentId = event.target.getAttribute('divId');
     
      switch (contentType) {
        case 'npc':
          NPCs.addNPCInfo(contentId, target); // Handle NPCs
          break;
        case 'monster':
          Monsters.addMonsterInfo(contentId, target); // Handle monsters
          break;
          case 'item':
          Items.addIteminfo(contentId, target); // Handle items
          break;
          case 'spell':
          Spells.addSpellInfo(contentId, target); // Handle spells
          break;
        case 'misc':
          this.addMiscInfo(contentId, this.miscArray);
          break;
        default:
          console.log('Unknown content type');
      }          

    Ref.extraInfo.classList.add('showExtraInfo');
    this.showExtraExtraContent(); 
      
    });

    Ref.extraInfoContainer.addEventListener('mouseleave', () => {
    //Ref.extraInfo.classList.remove('showExtraInfo');
    Ref.extraInfo2.classList.remove('showExtraInfo');
         
    });
  });
},

showExtraExtraContent() {
 
  const expandableExtra = Ref.extraInfo.querySelectorAll('.expandable');
  const extraInfo2 = document.querySelector('.extraInfo2');

  // console.log('List all divs found for expandableExtra:');
  //           expandableExtra.forEach((div, index) => {
  //             console.log(`Div ${index + 1}:`);
  //             console.log('Element:', div);
  //             console.log('Text Content:', div.textContent);
  //             console.log('Data Attributes:', div.dataset);
  //           });

  expandableExtra.forEach(expandableElement => {
    
    expandableElement.addEventListener('mouseenter', (event) => {
      
      console.log('selected')
      const contentType = event.target.getAttribute('data-content-type');
      const contentId = event.target.getAttribute('divId');
     
      switch (contentType) {
        case 'npc':
          NPCs.addNPCInfo(contentId, "ExtraContent"); // Handle NPCs
          break;
        case 'monster':
          Monsters.addMonsterInfo(contentId); // Handle monsters
          break;
          case 'item':
          Items.addIteminfo(contentId); // Handle items
          break;
          case 'spell':
          Spells.addSpellInfo(contentId); // Handle spells
          break;
        case 'misc':
          this.addMiscInfo(contentId, this.miscArray);
          break;
        default:
          console.log('Unknown content type');
      }        

      extraInfo2.classList.add('showExtraInfo');
      
    });   

  });

},


};




export default Storyteller;

