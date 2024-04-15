import load from "./load.js";


const save = {


saveFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, filename);
    },
    
    exportArray: function () {
    
    const json = JSON.stringify(load.Data, null, 2);
    const mimeType = 'application/json';
    
    // Prompt the user to enter a filename
    const filename = prompt('Enter the filename for the JSON file:', load.fileName + '.json');
    
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
    
}

export default save;