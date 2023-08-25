import Ambience from "./ambience.js";
import Edit from "./edit.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

const Array = {
locationArray: [],

//If there are problems with the load dialog freezing, try deleting unneccesary .json files in downloads folder.

//For Saving...

                addNewLocation(location) {
                const rect = location.getBoundingClientRect();
                const left = parseFloat(location.style.left);
                const top = parseFloat(location.style.top);
                const width = parseFloat(location.style.width);
                const height = parseFloat(location.style.height);
                const divId = location.id;
                const player = "";
                const gm = "";
                const misc = "";

                return {
                left,
                top,
                width,
                height,
                divId,
                player,
                gm,
                misc,
                };
                },

                saveFile(content, filename, mimeType) {
                const blob = new Blob([content], { type: mimeType });
                saveAs(blob, filename);
                },

                exportArray: function () {
                // Extract general information from the dropdowns
                const interiorOrExterior = document.getElementById('radianceDropdown').value;
                const context = document.getElementById('contextDropdown').value;
                const mainAmbience = document.getElementById('mainAmbienceDropdown').value;
                const secondAmbience = document.getElementById('secondAmbienceDropdown').value || null;

                // Create the general information object
                const generalInfo = {
                interiorOrExterior,
                context,
                mainAmbience,
                secondAmbience
                };

                // Create the main object to be exported
                const exportData = {
                locations: this.locationArray,
                generalInformation: generalInfo,
                npcArray: NPCs.npcArray  // Add the npcArray here
                };

                const json = JSON.stringify(exportData, null, 2);
                const mimeType = 'application/json';

                // Prompt the user to enter a filename
                const filename = prompt('Enter the filename for the JSON file:', 'default.json');

                if (filename) {
                // Call the function to save the JSON string as a file
                this.saveFile(json, filename, mimeType);
                } else {
                console.log('Filename not provided, file not saved.');
                }
                }, 

                handleFileSave(event, blob, blobUrl) {
                const file = event.target.files[0];
                if (file) {
                // Create an anchor element for the download link
                const downloadLink = document.createElement('a');
                downloadLink.href = blobUrl;

                // Set the filename for the download
                downloadLink.download = file.name; // Use the chosen filename

                // Programmatically trigger a click event on the anchor element to start the download
                downloadLink.click();

                // Clean up: remove the anchor element and revoke the Blob URL
                downloadLink.remove();
                URL.revokeObjectURL(blobUrl);
                }

                // Clean up: remove the file input element
                event.target.remove();
                },

                downloadImage(filename) {
                const mapElement = document.getElementById('mapElement'); // Get the map element
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set the canvas dimensions to match the image dimensions
                canvas.width = mapElement.width;
                canvas.height = mapElement.height;

                // Draw the image onto the canvas
                ctx.drawImage(mapElement, 0, 0);

                // Convert the canvas content to a data URL (imageDataUrl)
                const imageDataUrl = canvas.toDataURL();

                // Create a download link for the image
                const imageLink = document.createElement('a');
                imageLink.href = imageDataUrl;
                imageLink.download = filename || 'image.png'; // Specify the desired image filename
                imageLink.textContent = 'Download Image';

                // Append the image download link to the body
                document.body.appendChild(imageLink);

                // Programmatically trigger a click event on the image link to start the download
                imageLink.click();

                // Remove the image download link after the download is initiated
                imageLink.remove();
                },

//For Loading...

                handleFileInputChange: (event) => {
                const file = event.target.files[0];
                if (file) {
                const reader = new FileReader();
                reader.onload = (e) => Array.handleFileLoad(e.target.result);
                reader.readAsText(file);
                }
                },  

                handleFileLoad(fileContent) {
                const data = JSON.parse(fileContent);

                try {
                //Handle Location Information
                console.log(data.locations)
                this.displayLoadedLocationsOnMap(data.locations);
                } catch (error) {
                console.error('Error loading file:', error);
                }

                try{
                NPCs.npcArray = data.npcArray;
                console.log(NPCs.npcArray);
                } catch (error) {
                console.error('Error loading NPC information:', error);
                }
        

                try{
                //Handle General Information
                this.handleGeneralInformation(data.generalInformation);
                //Ambience.initializeAmbienceDropdowns();
                Ambience.simConDrop();
                Ambience.simMainDrop();
                Ambience.radiateDisplay();
                } catch (error) {
                console.error('Error loading general information:', error);
                }

                },

                handleGeneralInformation: function (generalInfo) {
                const { interiorOrExterior, context, mainAmbience, secondAmbience } = generalInfo;

                //console.log(generalInfo);
                // Set the values of the dropdowns
                document.getElementById('radianceDropdown').value = interiorOrExterior;
                document.getElementById('contextDropdown').value = context;
                document.getElementById('mainAmbienceDropdown').value = mainAmbience;
                document.getElementById('secondAmbienceDropdown').value = secondAmbience;
                },


                displayLoadedLocationsOnMap(data) {
                //  // Clear the existing content
                var oldData = document.getElementsByClassName('selection');

                while(oldData[0]) {
                oldData[0].parentNode.removeChild(oldData[0]);
                }

                this.locationArray=[];

                //Set Colour
                const colorList = ["lime", "orange", "cyan", "hotpink", "gold"];

                // Add the loaded locations to the map and the array
                data.forEach((locationData) => {
                const newLoc = this.addSaveLocation(locationData);

                // Choose a random color from the colorList
                const randomColorIndex = Math.floor(Math.random() * colorList.length);
                const randomColor = colorList[randomColorIndex];

                // Set the chosen random color as the background color
                newLoc.style.backgroundColor = randomColor;

                const imageContainer = document.querySelector('.image-container');
                const firstChild = imageContainer.firstChild;
                imageContainer.insertBefore(newLoc,firstChild);

                //imageContainer.appendChild(newLoc);

                this.addLocationToArray(locationData);
                //console.log("Adding to Map and Array: " + JSON.stringify(newLoc, null, 2));

                //Add Events to Divs
                this.addLocationEvents()

                // Generate options for primary and secondary locations dropdowns
                this.generateLocationOptions();

                });
                },

                addSaveLocation(locationData) {
                const { left, top, width, height, divId} = locationData;

                // Create a new location element with the specified properties
                const newLoc = document.createElement('div');
                newLoc.className = 'position-div selection';
                newLoc.style.left = left + 'px';
                newLoc.style.top = top + 'px';
                newLoc.style.width = width + 'px';
                newLoc.style.height = height + 'px';
                newLoc.id = divId;

                // Create a label element for the div ID
                const imageContainer = document.querySelector('.image-container');
                const labelElement = document.createElement('div');
                labelElement.className = 'div-id-label';
                labelElement.textContent = divId;
                newLoc.appendChild(labelElement);

                //console.log("Created: " + JSON.stringify(newLoc, null, 2));
                generateTable.click();

                return newLoc;
                },   

                addLocationToArray(locationData) {
                const { left, top, width, height, divId, player, gm, misc, spreadsheetData } = locationData;

                // Create a new location object with the specified properties
                const newLocation = {
                left,
                top,
                width,
                height,
                divId,
                player,
                gm,
                misc,
                spreadsheetData,
                };

                this.locationArray.push(newLocation);
                //console.log("Adding to Array: " + JSON.stringify(newLocation, null, 2));
                },

                //Add Events to Divs when created or loaded. 

                addLocationEvents() {
                const locations = document.querySelectorAll('.selection');

                locations.forEach((location) => {
                if (!location.dataset.hasListener) {


                location.addEventListener('click', () => {
                Storyteller.changeContent(location);
                Edit.moveLocation(location);

                });

                location.dataset.hasListener = true;
                }
                });
                },

                generateLocationOptions() {
                        const primaryLocationDropdown = document.getElementById('primaryLocation');
                        const secondaryLocationDropdown = document.getElementById('secondaryLocation');
                
                        // Clear existing options
                        primaryLocationDropdown.innerHTML = '<option value=""></option>';
                        secondaryLocationDropdown.innerHTML = '<option value="">None</option>';
                
                        // Generate options based on .selection div IDs
                        this.locationArray.forEach((location) => {
                            const option = document.createElement('option');
                            option.value = location.divId;
                            option.textContent = location.divId;
                            primaryLocationDropdown.appendChild(option);
                
                            const secondaryOption = document.createElement('option');
                            secondaryOption.value = location.divId;
                            secondaryOption.textContent = location.divId;
                            secondaryLocationDropdown.appendChild(secondaryOption);
                        });
                    },

};

export default Array;

