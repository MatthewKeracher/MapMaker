const Map = {

    async fetchAndProcessImage() {
        // Create an input element for file upload
        const inputElement = document.createElement("input");
        inputElement.type = "file";

        // Listen for the 'change' event on the input element
        inputElement.addEventListener("change", async (event) => {
            const file = event.target.files[0];

            if (file) {
                // Create a Blob from the uploaded file
                const imageBlob = new Blob([file], { type: file.type });

                // Do something with the imageBlob, such as displaying it or further processing
                const blobUrl = URL.createObjectURL(imageBlob);
                const mapElement = new Image();
                mapElement.src = blobUrl;
                mapElement.id = "mapElement";

                // Add a class to the <img> element for styling
                mapElement.className = "map-image";

                // Create a container div for the image
                const imageContainer = document.createElement('div');
                imageContainer.className = "image-container";
                imageContainer.appendChild(mapElement);

                // Add the container to the body
                document.body.appendChild(imageContainer);
            }
        });

        // Trigger a click event on the input element to open the file dialog
        inputElement.click();
    }
};

export default Map;
