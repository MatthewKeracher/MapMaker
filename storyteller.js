import Array from "./array.js";

const Storyteller = {

changeContent(location) {
    const Storyteller = document.getElementById('Storyteller');
    const locationName = document.querySelector('.locationLabel');
    const editPlayerText = document.getElementById('editPlayerText');
    const editGMText = document.getElementById('editGMText');
    const editMiscText = document.getElementById('editMiscText');
    
    const divId = location.id;
    locationName.textContent = divId;
    
    const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);

    if (matchingEntry) {
        const player = matchingEntry.player;
        const gm = matchingEntry.gm;
        const misc = matchingEntry.misc;

        //Change Storyteller Content
        Storyteller.innerHTML = `${player}\n\n${gm}\n\n ${misc}`;
        
        //Change Edit Content
        editPlayerText.value = `${player}`;
        editGMText.value = `${gm}`;
        editMiscText.value = `${misc}`;

    }

},


};

export default Storyteller;

