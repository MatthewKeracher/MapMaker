const Edit = {
    editMode : false,

    //Delete a Location

    //Move a Location

    //Edit Location Name

    //Edit other Location content

    //Add button; adding locations to the map. 
    

    handleMouseHover(e) {
        //console.log('Is hovering :-)');
        
        if (e.target && e.target.classList && e.target.classList.contains('selection')) {
            const divId = e.target.id;
            //console.log('Hovering over div with ID:', divId);
            e.target.style.backgroundColor = 'lime';
            e.target.style.opactiy = 0.9;
    
            // Add a listener to remove the hotpink color when hovering stops
            e.target.addEventListener('mouseleave', () => {
                e.target.style.backgroundColor = 'white';
            });
        }
    }

};
    
export default Edit;