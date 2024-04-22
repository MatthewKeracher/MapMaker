//Helper should not take outside references, except load.Data[...]
import load from "./load.js";

const helper = {

sortData(data){

// const focusKey = 'ambience'

for (const key in data) {
    let obj = data[key];

    if (key !== 'townText') {
        obj = obj.map(entry => {
            // Remove some fields
            // delete entry.key;

            // Add new fields
            // entry.key = '';
            //entry.active = 1;

            // Change field values.
            entry.tags = helper.tidyTags(entry.tags)

            // Return the modified object
            return entry;
        });
    }

    if(key === 'subLocations'){

        obj = obj.map(entry => {
            // Remove some fields
            // delete entry.key;
            // delete entry.npc;
            // delete entry.location;
            // delete entry.target;

            // Add new fields
            // entry.key = '';
            //entry.active = 1;
            entry.order = entry.order? entry.order : '';

            // Change field values.
            // entry.type = 'group';
            // entry.subType= 'subGroup';

            // Return the modified object
            return entry;
        });

    }

    data[key] = obj;
}


},

proper(string) {
return string.charAt(0).toUpperCase() + string.slice(1);
},

standardizeCost(cost) {
// Use regex to find the figure followed by a space and optional '+'
const match = cost.match(/(\d+)(\s*\+*)/);

if (match) {
// Extract the figure and optional '+'
const figure = match[1];
const plusSign = match[2];

// Divide the figure by 100 and add back the optional '+'
const inGold = figure / 100 + plusSign;

return inGold;
}

return cost; // Return the original cost if no match is found
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

getSurname(fullName) {
    // Split the full name into components
    let nameComponents = fullName.split(' ');
    // Extract the last component as the surname
    let surname = nameComponents[nameComponents.length - 1];
    return surname;
},

addTagtoItem(clickArray, currentArray){

const currentObjAddress = {key: currentArray.key, id: currentArray.id};
const currentObj = load.Data[currentArray.key][currentArray.index];
const currentObjTags = currentObj.tags;

const clickObjAddress = {key: clickArray.key, id: clickArray.id};
const clickObj = load.Data[clickArray.key][clickArray.index];
const clickObjTags = clickObj.tags;

//Check for duplicates.
const checkCurrent = currentObjTags.find(obj => clickArray.key === obj.key && clickArray.id === obj.id)? true: false;
const checkClick = clickObjTags.find(obj => currentArray.key === obj.key && currentArray.id === obj.id)? true: false;
const addtoSelfCheck = clickObj === currentObj? true:false;

if(checkCurrent === false && addtoSelfCheck === false){
currentObjTags.push(clickObjAddress)
}

if(checkClick === false && addtoSelfCheck === false){
clickObjTags.push(currentObjAddress);  
}

//Replace current tags with appended tags.
load.Data[currentArray.key][currentArray.index].tags = currentObjTags;
load.Data[clickArray.key][clickArray.index].tags = clickObjTags;

},

getObjfromTag(tag){

let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
let obj = load.Data[tag.key][index];

if(obj === undefined){console.error("Object does not exist at " + tag.key + ':' + tag.id)}

return obj

},

getChildren(tagObj){

    //Take a tag and return all child tags.
    if(tagObj.key === 'tags'){

        tagObj.tags.filter(tag => tag.key === 'tags');
        console.log(tagObj.name, tagObj.tags.filter(tag => tag.key === 'tags'));

    }

},

getTagsfromObj(obj){

    let array = [];
    let tags = obj.tags;

    if(tags){   
        
    let tidyTags = helper.tidyTags(tags);

    tidyTags.forEach(tag => {
    
    let tagObj = helper.getObjfromTag(tag);
    //this.getChildren(tagObj);
    
    array.push(tagObj);
    
    })
    }
    
    //console.log(array)
    return array;
    
    },

    tidyTags(tags) {
        // Remove dead tags
        tags = tags.filter(tag => {
            // Get the tag object
            let tagObj = this.getObjfromTag(tag);
            // Keep the tag if the tag object is not undefined
            return tagObj !== undefined;
        });

        //return tags;
    
        // Use reduce to create a new array with unique tags
        return tags.reduce((uniqueTags, tag) => {
        // Check if the tag already exists in uniqueTags based on key and id
        let isDuplicate = uniqueTags.some(existingTag =>
        existingTag.key === tag.key && parseInt(existingTag.id) === parseInt(tag.id)
        );
        // If the tag is not a duplicate, add it to uniqueTags
        if (!isDuplicate) {
        uniqueTags.push(tag);
        }
        return uniqueTags;
        }, []);

    }
    
    

};

export default helper;