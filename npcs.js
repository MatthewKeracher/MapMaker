import Array from "./array.js";

const NPCs = {

npcArray: [],

    createNPCButtonClicked: function() {
        const npcName = document.getElementById('npcName').value;
        const npcDetails = document.getElementById('npcDetails').value;
        const npcHitPoints = parseInt(document.getElementById('npcHitPoints').value);
        const npcEquipment = document.getElementById('npcEquipment').value;
        const primaryLocation = document.getElementById('primaryLocation').value;
        const secondaryLocation = document.getElementById('secondaryLocation').value || null;

        const npc = {
            name: npcName,
            details: npcDetails,
            hitPoints: npcHitPoints,
            equipment: npcEquipment,
            primaryLocation: primaryLocation,
            secondaryLocation: secondaryLocation
        };

        // Do something with the created NPC object (e.g., add to an array)
        console.log('Created NPC:', npc);

        // Add the created NPC to the npcArray
        this.npcArray.push(npc);

        // Clear the form
        document.getElementById('npcForm').reset();
    },

    init: function() {
        // Initialize your NPCs module
        document.getElementById('createNPCButton').addEventListener('click', this.createNPCButtonClicked);
    }
};

export default NPCs;
