import Array from "./array.js";

const Storyteller = {

changeContent(location, locationLabel) {
    const Storyteller = document.getElementById('Storyteller');

    const editPlayerText = document.getElementById('editPlayerText');
    const editGMText = document.getElementById('editGMText');
    const editMiscText = document.getElementById('editMiscText');
    
    const divId = location.id;
    locationLabel.textContent = divId;

    const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);

    if (matchingEntry) {
        const player = matchingEntry.player;
        const gm = matchingEntry.gm;
        const misc = matchingEntry.misc;

        Storyteller.textContent = `Player Information:\n\n ${player}\n\nGame Master Information:\n\n ${gm}\n\nMiscellaneous:\n\n ${misc}`;

        editPlayerText.textContent = `${player}`;
        editGMText.textContent = `${gm}`;
        editMiscText.textContent = `${misc}`;

    }

},


};

export default Storyteller;

