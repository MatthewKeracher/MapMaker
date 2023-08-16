const Map = {

    async fetchAndProcessImage() {
    // Prompt the user for the image URL, with the default URL as initial value
    var imageUrl = prompt("Enter the image URL:", "https://i.redd.it/z6m7wtth36y51.png");
    
    // If the user cancels the prompt or doesn't provide a URL, exit the function
    if (!imageUrl) {
        return;
    }

    // Fetch the image and convert the response to a Blob
    var response = await fetch(imageUrl);
    var imageBlob = await response.blob();
    
    // Do something with the imageBlob, such as displaying it or further processing
    var blobUrl = URL.createObjectURL(imageBlob);
    var mapElement = new Image();
    mapElement.src = blobUrl;
    mapElement.id = "mapElement";

    // Add a class to the <img> element for styling
    mapElement.className = "map-image";

    // Create a container div for the image
    var imageContainer = document.createElement('div');
    imageContainer.className = "image-container";
    imageContainer.appendChild(mapElement);

    // Add the container to the body
    document.body.appendChild(imageContainer);
}


};

export default Map;


