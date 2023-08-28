// Import the necessary module
import Edit from "./edit.js";

// Define the NPCs module
const NPCs = {
    npcArray: [],

    saveNPC: function() {
        // Get the values from the form fields
        const npcName = document.getElementById('npcName').value;
        const npcOccupation = document.getElementById('npcOccupation').value;
        const npcLevel = document.getElementById('npcLevel').value;
        const npcClass = document.getElementById('npcClass').value;
        const primaryLocation = document.getElementById('primaryLocation').value;
        const primaryActivity = document.getElementById('primaryActivity').value;
        const secondaryLocation = document.getElementById('secondaryLocation').value;
        const secondaryActivity = document.getElementById('secondaryActivity').value;
        const tertiaryLocation = document.getElementById('tertiaryLocation').value;
        const tertiaryActivity = document.getElementById('tertiaryActivity').value;
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
            primaryLocation: primaryLocation,
            primaryActivity: primaryActivity,
            secondaryLocation: secondaryLocation,
            secondaryActivity: secondaryActivity,
            tertiaryLocation: tertiaryLocation,
            tertiaryActivity: tertiaryActivity,
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

    if (Edit.editPage === 3) {
    imageContainer.style.width = "55vw"; 
    radiantDisplay.style.width = "55vw"; 
    }else{imageContainer.style.width = "70vw"; 
    radiantDisplay.style.width = "70vw"; 
    }
    },

    clearForm: function(){
      const npcForm = document.getElementById('npcForm');
      const inputFields = npcForm.querySelectorAll('input, textarea, select'); // Select input, textarea, and select fields within npcForm
  
      // Loop through the form elements and clear their values
      inputFields.forEach(formElement => {
          if (formElement.tagName === 'SELECT') {
              // For select elements, set the selected index to -1 to clear the selection
              formElement.selectedIndex = -1;
          } else {
              formElement.value = ''; // Clear the value of input and textarea elements
          }
      });
  },
  

    

    loadNPC: function() {
        const npcForm = document.getElementById('npcForm');    
        const NPCoptionsList = document.getElementById('NPCoptionsList'); // Reuse the optionsList div
        const locationName = document.querySelector('.locationLabel');
               
        // Clear the existing content
        NPCoptionsList.innerHTML = '';
      
        const primaryNPCs = [];
        const secondaryNPCs = [];
        const tertiaryNPCs = [];
        const otherNPCs = [];
      
        for (const npc of NPCs.npcArray) {
          const npcNameDiv = document.createElement('div');
          npcNameDiv.textContent = npc.name;            
      
          // Colour code based on whether this is their Primary, Secondary, or Tertiary Location
          if (npc.primaryLocation === locationName.textContent) {
            npcNameDiv.classList.add('primary');
            primaryNPCs.push(npcNameDiv);
          } else if (npc.secondaryLocation === locationName.textContent) {
            npcNameDiv.classList.add('secondary');
            secondaryNPCs.push(npcNameDiv);
          } else if (npc.tertiaryLocation === locationName.textContent) {
            npcNameDiv.classList.add('tertiary');
            tertiaryNPCs.push(npcNameDiv);
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
            document.getElementById('primaryLocation').value = npc.primaryLocation;
            document.getElementById('primaryActivity').value = npc.primaryActivity;
            document.getElementById('secondaryLocation').value = npc.secondaryLocation;
            document.getElementById('secondaryActivity').value = npc.secondaryActivity;
            document.getElementById('tertiaryLocation').value = npc.tertiaryLocation;
            document.getElementById('tertiaryActivity').value = npc.tertiaryActivity;
            document.getElementById('npcPhysicalAppearance').value = npc.physicalAppearance;
            document.getElementById('npcEmotionalAppearance').value = npc.emotionalAppearance;
            document.getElementById('npcSocialAppearance').value = npc.socialAppearance;

            
            npcForm.style.display = 'flex'; // Display the npcForm
          });
        }
      
        // Concatenate arrays in desired order
        const sortedNPCs = [...primaryNPCs, ...secondaryNPCs, ...tertiaryNPCs, ...otherNPCs];
      
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
