const UI = (() => {

  const loadButton = document.getElementById('load');
  const playButton = document.getElementById('playButton');
  const recordButton = document.getElementById('record');
  const generateButton = document.getElementById('generate');
  const createFileButton = document.getElementById('create');

  const enablePlayButton = () => {
    videoUrl = loadingVideo.isLoaded;
    if (!videoUrl) {
      playButton.setAttribute('disabled', '');
      alert('A url must be entered');
    } else {
      playButton.removeAttribute('disabled', '');
      console.log('The video has been loaded');
    }
  }

  const addResetButton = () => {
  	// Check to see if the reset button already exhists
  	if (!captionSection.querySelector('#resetButton')) {
    	// If it doesnt then add the reset button
  		console.log('Reset button added');
  		resetCaptionsButton = document.createElement('button');// Create reset button
  		// Set click attribute to call removeAllCaptions function
  		resetCaptionsButton.setAttribute('onclick','UI.removeAllCaptions("")');
  		// Set the id of the button to be called in other functions
  		resetCaptionsButton.setAttribute('id','resetButton');
  		resetCaptionsButton.appendChild(document.createTextNode('Reset all Captions'));// Set button text
  		captionSection.appendChild(resetCaptionsButton);// Add button as a child to the and of parent element
  	}
  }

  // Create a function to remove reset button if no list items exhist
  const removeResetButton = () => {
  	if (orderedList.childNodes.length === 0) {
  		// Get the reset button by id and remove it from the dom
  		let removeResetButton = document.getElementById('resetButton');
  		captionSection.removeChild(removeResetButton);
  	}
  }

  const removeAllCaptions = () => {
  	// while the list has a first child remove it (removes all children)
  	while (orderedList.firstChild) {
  		orderedList.removeChild(orderedList.firstChild);
  	}
  	console.log('Removed all captions & reset button');
  	removeResetButton();// Call function to remove the reset button
  	generateButton.setAttribute('disabled', '');// Disable generate button
  	createFileButton.setAttribute('disabled','');// Disable create file button
  	listId = 1;// Reset the captions id counter
  }

  // Enable the record button & set the play/pause button
  const enableRecord = () => {
  	recordButton.removeAttribute('disabled', '');
  	if (playButton.innerHTML === 'Play') {
  		playButton.innerHTML = 'Pause';
  	}
  }

  // Disable the record button & set the play/pause button
  const disableRecord = () => {
  	recordButton.setAttribute('disabled', '');
  	if (playButton.innerHTML === 'Pause') {
  		playButton.innerHTML = 'Play';
  	}
  }

  // Toggle play/pause
  const playPause = () => {
  	if (playButton.innerHTML === 'Play') {
  		let isPlaying = true;
      return isPlaying;
  		playButton.innerHTML = 'Pause';
  	} else if (playButton.innerHTML === 'Pause') {
  		let isPlaying = false;
      return isPlaying;
  		playButton.innerHTML = 'Play';
  	}
  }

  let iFace = {
    loadButton: loadButton,
    playButton: playButton,
    recordButton: recordButton,
    generateButton: generateButton,
    createFileButton: createFileButton,
    enablePlayButton: enablePlayButton,
    addResetButton: addResetButton,
    removeResetButton: removeResetButton,
    removeAllCaptions: removeAllCaptions,
    enableRecord: enableRecord,
    disableRecord: disableRecord,
    togglePlayPause: playPause
  };

  return iFace;
})();
