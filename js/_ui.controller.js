var UI = (function() {

  var loadButton = document.getElementById('load');
  var playButton = document.getElementById('playButton');
  var recordButton = document.getElementById('record');
  var generateButton = document.getElementById('generate');
  var createFileButton = document.getElementById('create');


  var interface = {
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


  function enablePlayButton() {
  	videoUrl = loadingVideo.isLoaded;
  	if (!videoUrl) {
  		playButton.setAttribute('disabled', '');
  		alert('A url must be entered');
  	} else {
  		playButton.removeAttribute('disabled', '');
  		console.log('The video has been loaded');
  	}
  }

  function addResetButton () {
  	// Check to see if the reset button already exhists
  	if (captionSection.querySelector('#resetButton')) {

  	} else {
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
  function removeResetButton () {
  	if (orderedList.childNodes.length === 0) {
  		// Get the reset button by id and remove it from the dom
  		var removeResetButton = document.getElementById('resetButton');
  		captionSection.removeChild(removeResetButton);
  	}
  }

  function removeAllCaptions () {
  	// while the list has a first child remove it (removes all children)
  	while (orderedList.firstChild) {
  		orderedList.removeChild(orderedList.firstChild)
  	}
  	console.log('Removed all captions & reset button');
  	UI.removeResetButton();// Call function to remove the reset button
  	generateButton.setAttribute('disabled', '');// Disable generate button
  	createFileButton.setAttribute('disabled','');// Disable create file button
  	listId = 1;// Reset the captions id counter
  }

  // Enable the record button & set the play/pause button
  function enableRecord() {
  	recordButton.removeAttribute('disabled', '');
  	if (playButton.innerHTML === 'Play') {
  		playButton.innerHTML = 'Pause';
  	}
  }

  // Disable the record button & set the play/pause button
  function disableRecord() {
  	recordButton.setAttribute('disabled', '');
  	if (playButton.innerHTML === 'Pause') {
  		playButton.innerHTML = 'Play';
  	}
  }

  // Toggle play/pause
  function playPause() {
  	if (playButton.innerHTML === 'Play') {
  		video.play();
  		playButton.innerHTML = 'Pause';
  	} else if (playButton.innerHTML === 'Pause') {
  		video.pause();
  		playButton.innerHTML = 'Play';
  	}
  }

  return interface;
})();
