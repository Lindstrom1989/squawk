'use strict';
/*
  ____                             _         _   _
 / ___|  __ _ _   _  __ ___      _| | __    / | / |
 \___ \ / _` | | | |/ _` \ \ /\ / / |/ /    | | | |
  ___) | (_| | |_| | (_| |\ V  V /|   <     | |_| |
 |____/ \__, |\__,_|\__,_| \_/\_/ |_|\_\    |_(_)_|
           |_|
*/
// problem: adding subtitles for videos on the web means learning code and takes a lot of time
// solution: create a way to produce the code for somebody to add to there video

// TO DO LIST //
// [x] Think of a way to link youtube videos.
// [x] Mobile support for record button.
// [x] Think of a way to load the output back into the video (subtitle preview).
// [x] Check if caption input contains text.


console.log('  ____                             _         _   _ \r\n \/ ___|  __ _ _   _  __ ___      _| | __    \/ | \/ |\r\n \\___ \\ \/ _` | | | |\/ _` \\ \\ \/\\ \/ \/ |\/ \/    | | | |\r\n  ___) | (_| | |_| | (_| |\\ V  V \/|   <     | |_| |\r\n |____\/ \\__, |\\__,_|\\__,_| \\_\/\\_\/ |_|\\_\\    |_(_)_|\r\n           |_|                                     ');
console.log('A PROGRAM FOR CREATING SUBTITLE FILES IN .vtt FORMAT');

// ** VARIABLES **
let videoUrl;
const video = document.getElementById('video');
let buttonDown;
let buttonUp;
let listId = 1;
let captionSection = document.getElementById('captionSection');
let resetCaptionsButton;
let orderedList = document.getElementById('timeList');
let codeOutput = document.getElementById('code');


const loadingVideo = (() => {

    var isLoaded = false;

    function loadVideo() {
    	videoUrl = document.getElementById('userUrl').value;
        video.setAttribute("src", videoUrl);
        console.log(videoUrl);
        // Call function to check file extension and apply attribute type
        _checkVideoType();
    }

    function _checkVideoType() {
        var videoExtension = videoUrl.substr(videoUrl.lastIndexOf(".") + 1);
        console.log(videoExtension);
        video.setAttribute("type", videoExtension);
        if (videoExtension !== "mp4" && videoExtension !== "ogg") {
            alert("Squawk does not support this file type and it may not behave as expected. Squawk supports .mp4 and .ogg formats please check your url for typos or find a different format of the video");
        }
        loadingVideo.isLoaded = true;
    }

	return {
		'loadVideo': loadVideo,
		'isLoaded': isLoaded
	};

})();

// Function that logs the time on mouse events
const logTime = () => {
	var timeStamp = video.currentTime.toFixed(3);
	return timeStamp;
};

// Two functions that update down and up time using logtime function
const logDownTime = () => {
	var time = logTime();
	buttonDown = time;
	console.log('Recording Started at: ' + buttonDown);
};

const logUpTime = () => {
	var time = logTime();
	buttonUp = time;
	console.log('Recording stopped at: ' + buttonUp);
};

// Function to take the time stamp in seconds and convert it to .webvtt format (hh:mm:ss.sss)
const convertToTimeFormat = (time) => {
	var tick = time;
	var hrs = Math.floor(tick/3600);
	tick = tick - 3600 * hrs;
	var mins = Math.floor(tick/60);
	tick = tick - 60 * mins;
	// Get seconds to 3 decimal places
	var secs = tick.toFixed(3);
	var tock = (hrs < 10 ? "0" : "" ) + hrs + ":" + (mins < 10 ? "0" : "" ) + mins + ":" + (secs < 10 ? "0" : "" ) + secs;
  // Return the output
  return tock;
}

// Create a caption list item
const addCaptionHolder = (down, up) => {
	console.log('Time stamp added to caption number: ' +listId);
	let li = document.createElement('li');// Create li
	li.setAttribute('id','caption' + listId);// Set unique id
	let input = document.createElement('input');// Create caption input
	input.setAttribute('id','input' + listId);// Set unique id
	input.setAttribute('tabindex', listId);// Set tab index
	input.setAttribute('type', 'text');// Set input type
	let saveButton = document.createElement('button');// Create save button
	// Set save button attribute to call function
	saveButton.setAttribute('onclick', 'saveEditCaption("' + 'input' + listId + '", "save' + listId +'")');
	let playSnippetButton = document.createElement('button');// Create play snippet button
	// Set play snippet button attribute to call function and pass the start record time value
	playSnippetButton.setAttribute('onclick', 'PLAYER.playSnippet("' +  listId + '", "' + down +'")');
	let deleteButton = document.createElement('button');// Create delete button
	// Set delete button attribute to call function
	deleteButton.setAttribute('onclick','deleteCaptionHolder("' + 'caption' + listId + '")');
	let startSpan = document.createElement('span');// Create spans for time stamp
	let endSpan = document.createElement('span');// Create spans for time stamp
	// Add each aditional list item to the end
	orderedList.appendChild(li);
	// Add children element to list item
	orderedList.lastChild.appendChild(input);
	orderedList.lastChild.appendChild(saveButton).innerHTML = 'Save';
	orderedList.lastChild.appendChild(playSnippetButton).innerHTML = 'Play snippet';
	orderedList.lastChild.appendChild(deleteButton).innerHTML = 'Delete';
	orderedList.lastChild.appendChild(startSpan);
	orderedList.lastChild.appendChild(endSpan);
	// Add id to elements
	saveButton.setAttribute('id','save' + listId);
	startSpan.setAttribute('id', 'rec_down' + listId);
	startSpan.className = 'rec_down';
	endSpan.setAttribute('id', 'rec_up' + listId);
	endSpan.className = 'rec_up';
	playSnippetButton.className = 'play';
	deleteButton.className = 'delete';
	// Send the time stamp to the convertToTimeFormat function
	// Add start and end time to spans
	startSpan.innerHTML = convertToTimeFormat(down);
	endSpan.innerHTML = convertToTimeFormat(up);
	listId ++;// Add 1 to list item for next id
	// Disable generate button untill its saved
	console.log('not all captions are saved');
	UI.generateButton.setAttribute('disabled', '');
	UI.createFileButton.setAttribute('disabled','');
	codeOutput.setAttribute('placeholder','All captions must be saved before you can generate your file.');
};

// Create function to delete caption list item, pass caption id to function
const deleteCaptionHolder = (captionID) => {
	console.log('Deleted: ' + captionID);
	// Create a variable from element with passed id
	let item = document.getElementById(captionID);
	// Remove list item with passed id name from the list
	orderedList.removeChild(item);
	// Cycle through captions and see if they are saved using checkIfAllCaptionsAreComplete function
	let countList = orderedList.childNodes.length;
	checkIfAllCaptionsAreComplete(countList);
	// Call function to see if it was the last li and remove reset button if
	UI.removeResetButton();
}

// Create a function to disable/enable caption input
const saveEditCaption = (inputID, buttonID) => {
	// Get elements by id supplied through the function values
	let item = document.getElementById(inputID);
	let item2 = document.getElementById(buttonID);
	// When user clicks button check if the disabled attribute is set
	// If it is already set remove it and change the button to save
	if (item.hasAttribute('disabled')) {
		item.removeAttribute('disabled');
		item2.innerHTML = 'Save';
		console.log(inputID + ' can be edited');
		if (item.parentElement.querySelector('.saveTick')) {
			let getSaveTick = item.parentElement.getElementsByClassName('saveTick');
			item.parentElement.removeChild(getSaveTick[0]);
			console.log('not all captions are saved');
			UI.generateButton.setAttribute('disabled', '');
			UI.createFileButton.setAttribute('disabled','');
			codeOutput.setAttribute('placeholder','All captions must be saved before you can generate your file.');
		} else {

		}

	} else {
	// if it is not set set it to disabled and change the button to edit
		item.setAttribute('disabled','');
		item2.innerHTML = 'Edit';
		console.log(inputID + ' has been saved');
		if (!item.parentElement.querySelector('.saveTick')) {
			let saveCheck = document.createElement('div');
			saveCheck.className = 'saveTick';
			saveCheck.appendChild(document.createTextNode('\u2714'));
			item.parentElement.appendChild(saveCheck);
		}
		// Cycle through captions and see if they are saved using checkIfAllCaptionsAreComplete function
		let countList = orderedList.childNodes.length;
		checkIfAllCaptionsAreComplete(countList);
	}
}

// Function to run through list items and see if they are saved, if they are enable generate button!
const checkIfAllCaptionsAreComplete = (numberOfCaptionsToCheck) => {
	for (let i = 1; i <= numberOfCaptionsToCheck; i++ ) {
		let checkForCompleteCaption = document.getElementById('caption' + i);
		if (checkForCompleteCaption === null) {
			numberOfCaptionsToCheck++;
		} else if (checkForCompleteCaption.querySelector('.saveTick')) {
			console.log(i + ' is saved');
		} else {
			break;
		}
		if (i === numberOfCaptionsToCheck) {
			console.log('All captions are saved!');
			UI.generateButton.removeAttribute('disabled');
			codeOutput.setAttribute('placeholder','Press generate to preview your code here.');
		} else {

		}
	}
}

// Function to grab data from each element
const getDataFromCaptions = () => {
	console.log('generate called');
	// Create a way to put data to text area
	codeOutput.innerHTML = '';
	// Add header to webvtt
	codeOutput.appendChild(document.createTextNode('WEBVTT' + '\u000a'));
	// Create a loop to go through each caption
	let captionCount = orderedList.childNodes.length;
	for (let i = 1; i <= captionCount; i++) {
		console.log('getting data from caption ' + i);
		// Get input data
		let input = document.getElementById('input' + i);
		// If the input is missing (has been deleted) increase the captionCount to compensate
		if (input === null) {
			captionCount ++;
		} else {
			input = '- ' + input.value;
			// log it
			console.log(input);
			// Get time stamp data
			let startTime = document.getElementById('rec_down' + i);
			startTime = startTime.textContent;
			let endTime = document.getElementById('rec_up' + i);
			endTime = endTime.textContent;
			// log it
			console.log(startTime + ' --> ' + endTime);
			// Unicode - u000a line feed, u000d carriage return
			codeOutput.appendChild(document.createTextNode('\u000d' + i + '\u000a' ));
			codeOutput.appendChild(document.createTextNode(startTime + ' --> ' + endTime + '\u000a' ));
			codeOutput.appendChild(document.createTextNode(input + '\u000d'));
		}
	}
};

// ** RUN PROGRAM **

// Load video button
UI.loadButton.onclick = () => {
	loadingVideo.loadVideo();
	if (loadingVideo.isLoaded) {
		UI.enablePlayButton();
	}
};
// Play button
UI.playButton.onclick = () => {
  let isPlaying = UI.togglePlayPause();
  if (isPlaying) {
    video.play();
  } else {
    video.pause();
  }
}
// Record button
UI.recordButton.onmousedown = logDownTime;
UI.recordButton.onmouseup = () => {
	logUpTime();
	// generate list item
	addCaptionHolder(buttonDown, buttonUp);
	// call addResetButton function
	UI.addResetButton();
};
// Generate button
UI.generateButton.onclick = () => {
	getDataFromCaptions();
	UI.createFileButton.removeAttribute('disabled');
};

video.addEventListener('play', UI.enableRecord);
video.addEventListener('pause', UI.disableRecord);
video.addEventListener('ended', UI.disableRecord);
