// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";

// Define the NPCs module
const NPCs = {
    npcArray: [],

    saveNPC: function() {
        // Get the values from the form fields
        const npcName = document.getElementById('npcName').value;
        const npcOccupation = document.getElementById('npcOccupation').value;
        const npcLevel = document.getElementById('npcLevel').value;
        const npcClass = document.getElementById('npcClass').value;
        const MorningLocation = document.getElementById('MorningLocation').value;
        const MorningActivity = document.getElementById('MorningActivity').value;
        const AfternoonLocation = document.getElementById('AfternoonLocation').value;
        const AfternoonActivity = document.getElementById('AfternoonActivity').value;
        const NightLocation = document.getElementById('NightLocation').value;
        const NightActivity = document.getElementById('NightActivity').value;
        const npcPhysicalAppearance = document.getElementById('npcPhysicalAppearance').value;
        const npcEmotionalAppearance = document.getElementById('npcEmotionalAppearance').value;
        const npcSocialAppearance = document.getElementById('npcSocialAppearance').value;
    
        // Check if an NPC with the same name already exists
        const existingNPCIndex = this.npcArray.findIndex(npc => npc.name === npcName);
    
        // Create an NPC object with the retrieved values
        const npc = {
            name: npcName,
            occupation: npcOccupation,
            level: npcLevel,
            class: npcClass,
            MorningLocation: MorningLocation,
            MorningActivity: MorningActivity,
            AfternoonLocation: AfternoonLocation,
            AfternoonActivity: AfternoonActivity,
            NightLocation: NightLocation,
            NightActivity: NightActivity,
            physicalAppearance: npcPhysicalAppearance,
            emotionalAppearance: npcEmotionalAppearance,
            socialAppearance: npcSocialAppearance
        };
    
        if (existingNPCIndex !== -1) {
            // Update the existing NPC entry
            this.npcArray[existingNPCIndex] = npc;
            console.log('NPC updated:', npc);
        } else {
            // Add the created NPC to the npcArray
            this.npcArray.push(npc);
            console.log('New NPC added:', npc);
        }
    
        // Do something with the created/updated NPC object (e.g., add to an array)
        console.log(this.npcArray);
    
        // Clear the form
        //document.getElementById('npcForm').reset();
    },
    
    fixDisplay: function(){

    // Get references to the elements
    const imageContainer = document.querySelector('.image-container');
    const radiantDisplay = document.getElementById('radiantDisplay'); 

    try{
    if (Edit.editPage === 3) {
    imageContainer.style.width = "55vw"; 
    radiantDisplay.style.width = "55vw"; 
    }else{imageContainer.style.width = "70vw"; 
    radiantDisplay.style.width = "70vw"; 
    }}catch{}
    },

    clearForm: function(){
      const npcForm = document.getElementById('npcForm');
      const inputFields = npcForm.querySelectorAll('input, textarea, select'); // Select input, textarea, and select fields within npcForm
  
      //console.log("clearing npcForm")

      // Loop through the form elements and clear their values
      inputFields.forEach(formElement => {
          if (formElement.tagName === 'SELECT') {
              // For select elements, set the selected index to -1 to clear the selection
              formElement.selectedIndex = -1;
          } else {
              formElement.value = ''; // Clear the value of input and textarea elements
          }
      });

     Array.generateLocationOptions();

  },
  

    

    loadNPC: function() {
        const npcForm = document.getElementById('npcForm');    
        const NPCoptionsList = document.getElementById('NPCoptionsList'); // Reuse the optionsList div
        const locationName = document.querySelector('.locationLabel');
               
        // Clear the existing content
        NPCoptionsList.innerHTML = '';
      
        const MorningNPCs = [];
        const AfternoonNPCs = [];
        const NightNPCs = [];
        const otherNPCs = [];
      
        for (const npc of NPCs.npcArray) {
          const npcNameDiv = document.createElement('div');
          npcNameDiv.textContent = npc.name;            
      
          // Colour code based on whether this is their Morning, Afternoon, or Night Location
          if (npc.MorningLocation === locationName.textContent) {
            npcNameDiv.classList.add('Morning');
            MorningNPCs.push(npcNameDiv);
          } else if (npc.AfternoonLocation === locationName.textContent) {
            npcNameDiv.classList.add('Afternoon');
            AfternoonNPCs.push(npcNameDiv);
          } else if (npc.NightLocation === locationName.textContent) {
            npcNameDiv.classList.add('Night');
            NightNPCs.push(npcNameDiv);
          } else {
            npcNameDiv.classList.add('npc-name'); // Add a class for styling
            otherNPCs.push(npcNameDiv);
          }
      
          // Add click event listener to each NPC name
          npcNameDiv.addEventListener('click', () => {
            
            document.getElementById('npcName').value = npc.name;
            document.getElementById('npcOccupation').value = npc.occupation;
            document.getElementById('npcLevel').value = npc.level;
            document.getElementById('npcClass').value = npc.class;
            document.getElementById('MorningLocation').value = npc.MorningLocation;
            document.getElementById('MorningActivity').value = npc.MorningActivity;
            document.getElementById('AfternoonLocation').value = npc.AfternoonLocation;
            document.getElementById('AfternoonActivity').value = npc.AfternoonActivity;
            document.getElementById('NightLocation').value = npc.NightLocation;
            document.getElementById('NightActivity').value = npc.NightActivity;
            document.getElementById('npcPhysicalAppearance').value = npc.physicalAppearance;
            document.getElementById('npcEmotionalAppearance').value = npc.emotionalAppearance;
            document.getElementById('npcSocialAppearance').value = npc.socialAppearance;

            
            npcForm.style.display = 'flex'; // Display the npcForm
          });
        }
      
        // Concatenate arrays in desired order
        const sortedNPCs = [...MorningNPCs, ...AfternoonNPCs, ...NightNPCs, ...otherNPCs];
      
        // Append sorted divs to the NPCoptionsList
        sortedNPCs.forEach(npcDiv => {
          NPCoptionsList.appendChild(npcDiv);
        });
      
        NPCoptionsList.style.display = 'block'; // Display the NPC names container
  
        this.fixDisplay();
  

      }
      
 

};

// Export the NPCs module
export default NPCs;
