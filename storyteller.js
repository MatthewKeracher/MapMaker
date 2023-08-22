import Array from "./array.js";

const Storyteller = {

changeContent(location) {
    const Storyteller = document.getElementById('Storyteller');
    const locationName = document.querySelector('.locationLabel');
    const editLocationName = document.querySelector('.editLocationName');
    const editPlayerText = document.getElementById('editPlayerText');
    const editGMText = document.getElementById('editGMText');
    const editMiscText = document.getElementById('editMiscText');
    
    const divId = location.id;
    locationName.textContent = divId;
    editLocationName.value = divId;

    const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);

    if (matchingEntry) {
        const player = matchingEntry.player;
        const gm = matchingEntry.gm;
        const misc = matchingEntry.misc;

        // //Change Storyteller Content
        // Storyteller.innerHTML = `${player}\n\n${gm}\n\n ${misc}`;

// Combine content with different colors
const formattedStory = `
    <span class="section player">${player}\n\n</span>
    <span class="section gm">${gm}\n\n</span>
    <span class="section misc">${misc}</span>
  `;

// Change Storyteller Content
Storyteller.innerHTML = formattedStory;
        
        //Change Edit Content
        editPlayerText.value = `${player}`;
        editGMText.value = `${gm}`;
        editMiscText.value = `${misc}`;

    }

},


};

export default Storyteller;

