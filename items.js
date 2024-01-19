import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Array from "./array.js";

const Items = {

itemsArray: [],
itemsSearchArray: [],

//Load the Array
async loadItemsArray() {

try {
const response = await fetch('items.json'); // Adjust the path if needed
const data = await response.json();
this.itemsArray = data;

const noKeys = Array.extractValues(data);
this.itemsArray = noKeys;

return data //.monsters;
} catch (error) {
console.error('Error loading items array:', error);
return [];
}

},   

//Add to Storyteller

//addPredictive Items is now with addPredictive Monsters


getItems(locationText) {
    const hashBrackets = /#([^#]+)#/g;

    return locationText.replace(hashBrackets, (match, targetText) => {
        const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === targetText.toLowerCase());
        if (item) {
            return `<span class="expandable item" data-content-type="item" divId="${item.Name}">${item.Name}</span>`;
        } else {
            console.log(`Item not found: ${targetText}`);
            return match;
        }
    });
},
 

extraItem(contentId) {
const hashBrackets = /#([^#]+)#/g;

return contentId.replace(hashBrackets, (match, targetText) => {
const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === targetText.toLowerCase());
if (item) {
//console.log(item.Name);
return this.addIteminfo(item.Name, 'extraInfo2');
} else {
console.log(`Item not found: ${targetText}`);
return match;
}
});
},

addIteminfo(contentId, target) {

let targetLocation = '';

if(target === 'ExtraContent'){
targetLocation = Ref.extraContent
} else if(target === 'extraInfo2'){
targetLocation = Ref.extraInfo2
Ref.extraInfo2.classList.add('showExtraInfo');
} else {
targetLocation = Ref.extraContent2
}

//Search for Item in the Array   
const item = Object.values(this.itemsArray).find(item => item.Name.toLowerCase() === contentId.toLowerCase());

if (item) {

    const itemStats = [
        `<hr><h3><span class="lime">${contentId.toUpperCase()}</span></h3>`,
        `${item.Type}.<br>`,
        `<span class="lime">Assigned to:</span> ${item.Tags};<br><br>`,
      
        `${item.Size ? `<span class="lime">Size:</span> ${item.Size};<br>` : ''}`,
        `${item.Weight ? `<span class="lime">Weight:</span> ${item.Weight};<br>` : ''}`,
        `${item.Cost ? `<span class="lime">Cost:</span> ${item.Cost};<br>` : ''}`,
        `${item.Damage ? `<span class="lime">Damage:</span> ${item.Damage};<br>` : ''}`,
        `${item.Range ? `<span class="lime">Range:</span> ${item.Range};<br>` : ''}`,
        `${item.AC ? `<span class="lime">Armour Class:</span> ${item.AC};<br><br>` : ''}`,
        `${item.Description ? `<span class="lime">Description:</span> <br><br> ${item.Description}` : ''}`,
      ];
      

const formattedItem = itemStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the target element
targetLocation.innerHTML = formattedItem;

return formattedItem;

} else {
console.log(`Monster not found: ${contentId}`);

}

},

loadItemsList: function(data) {
    const itemList = document.getElementById('itemList'); // Do not delete!!
  
    // Clear the existing content
    itemList.innerHTML = '';
  
    // Sort the items by item type alphabetically
    const sortedItems = data.slice().sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));
  
    // Iterate through the sorted items
for (const item of sortedItems) {
    const itemNameDiv = document.createElement('div');
    itemNameDiv.id = item.Name;
  
    // Check if item.Tags is included in Ref.itemSearch.value
    const tagsIncluded = item.Tags ? item.Tags.toLowerCase().includes(Ref.itemSearch.value.toLowerCase()) : false;
  
    // Apply lime or gray class based on the result
    const className = tagsIncluded ? 'lime' : 'gray'
  
    // Set the inner HTML with the appropriate class
    itemNameDiv.innerHTML = `[${item.Type}]<span class="${className}">${item.Name}</span>`;
  
    itemList.appendChild(itemNameDiv);
    this.fillItemsForm(item, itemNameDiv);
  
    // Show Item info in ExtraInfo2 when hover over Div
    itemNameDiv.addEventListener('mouseover', () => {
      Ref.extraInfo2.classList.add('showExtraInfo');
      this.addIteminfo(itemNameDiv.id);
    });
  }
  
    itemList.style.display = 'block'; // Display the container
    
  },
  

fillItemsForm: function(item, itemNameDiv){

// Add click event listener to each NPC name
itemNameDiv.addEventListener('click', () => {

itemNameDiv.innerHTML = `[${item.Type}]<span class="cyan">${item.Name}</span>`;

Ref.itemName.value = item.Name;
Ref.itemType.value = item.Type;
Ref.itemTags.value = item.Tags;
Ref.itemSize.value = item.Size;
Ref.itemWeight.value = item.Weight;
Ref.itemCost.value = item.Cost;
Ref.itemDamage.value = item.Damage;
Ref.itemRange.value = item.Range;
Ref.itemAC.value = item.AC;
Ref.itemDescription.value = item.Description;

Ref.itemForm.style.display = 'flex'; // Display the itemForm
});

},

saveItem: function() {

    const existingItemIndex = this.itemsArray.findIndex(item => item.Name === Ref.itemName.value);

    const item = {

        Name: Ref.itemName.value,
        Type: Ref.itemType.value,
        Tags: Ref.itemTags.value,
        Size: Ref.itemSize.value,
        Weight: Ref.itemWeight.value,
        Cost: Ref.itemCost.value,
        Damage: Ref.itemDamage.value,
        Range: Ref.itemRange.value,
        AC: Ref.itemAC.value,
        Description: Ref.itemDescription.value

    };
    
    if (existingItemIndex !== -1) {
    // Update the existing NPC entry
    this.itemsArray[existingItemIndex] = item;
    //this.itemsSearchArray[existingItemIndex] = item;
    //console.log('Item updated:', item);
    } else {
    this.itemsArray.push(item);
    //this.itemsSearchArray.push(item);
    }
    
    },

addItemSearch: function(){

Ref.itemSearch.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Call the searchItem function
this.searchItem(searchText);

});

},

searchItem: function(searchText) {
    this.itemsSearchArray = [];
 
    this.itemsSearchArray = this.itemsArray.filter((item) => {
      const itemName = item.Name.toLowerCase();
      const itemType = item.Type.toLowerCase();
      const itemTags = item.Tags ? item.Tags.toLowerCase() : '';
  
      // Check if either the name or occupation contains the search text
      return itemName.includes(searchText.toLowerCase()) || itemType.includes(searchText.toLowerCase()) || itemTags.includes(searchText.toLowerCase());
    });
    //console.log('searching for... ' + searchText)
    this.loadItemsList(this.itemsSearchArray);
  },
  

};

export default Items;

