// Import the necessary module
import editor from "./editor.js"; 
import form from "./form.js";
import helper from "./helper.js";
import ref from "./ref.js";
import NPCbuild from "./classes.js";
import load from "./load.js";
import expandable from "./expandable.js";

// Define the NPCs module
const NPCs = {

loadAndBuild: async function(fileContent) {
try {
// Wait for the handleFileLoad to complete
await load.handleFileLoad(fileContent);

// Now you can call buildNPC safely
await this.buildNPC();
} catch (error) {
console.error('Error loading file and building NPC:', error);
}
},

buildNPC: function() {

//console.log('calling buildNPC()')

const npcInstances = load.Data.npcs.map(npcData => new NPCbuild(npcData));

// Now npcInstances is an array of NPC objects with the data from npcArray
// You can store or use these instances as needed.
load.Data.npcs = npcInstances;

// For example, you can log the properties of each NPC instance
//npcInstances.forEach(npc => console.log(npc));

},

makeNewNPC(npc, obj){
  console.log(obj)
  // Create a deep copy of the original object
  const newObj = JSON.parse(JSON.stringify(npc));
  const newId = load.generateUniqueId(load.Data[npc.key], 'entry');
  
  // Generate a unique ID for the new object
  newObj.id = newId
  newObj.name = 'NPC ' + newObj.id;
  newObj.description = 'A vague humanoid lacking description; giving NPC energy.'

  if(obj){
  newObj.tags = [{key: obj.key, id: obj.id}];

  //Add new Tag to curent Object
  let objEntry = {key: 'npcs', id: newId};
  // let index = load.Data[obj.key].findIndex(entry => parseInt(entry.id) === parseInt(obj.id));
  // load.Data[obj.key][index].tags.push(objEntry);
  let tagObj = helper.getObjfromTag({key: obj.key, id: obj.id});
  let tags = tagObj.tags;
  tags.push(objEntry)
  };
  
  npc = newObj
  // Print the first spell in load.Data to see if it's modified
  //console.log(load.Data.spells[0]);

  load.Data.npcs.push(npc);
  form.createForm(npc);

},


};

// Export the NPCs module
export default NPCs;
