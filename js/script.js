'use strict';
// problem: adding subtitles for videos on the web means learning code and takes a lot of time
// solution: create a way to produce the code for somebody to add to there video

// add an input for users video
	// create a url input
	// create button to insert input into video element
	// think of a way to link youtube videos

	// output times to file

// create input for subtitle text
	// add input elements to time list items
	// add a button to comit comment
	// add a button to edit comment

console.log('  ____                             _         _   _ \r\n \/ ___|  __ _ _   _  __ ___      _| | __    \/ | \/ |\r\n \\___ \\ \/ _` | | | |\/ _` \\ \\ \/\\ \/ \/ |\/ \/    | | | |\r\n  ___) | (_| | |_| | (_| |\\ V  V \/|   <     | |_| |\r\n |____\/ \\__, |\\__,_|\\__,_| \\_\/\\_\/ |_|\\_\\    |_(_)_|\r\n           |_|                                     ');
console.log('A PROGRAM FOR CREATING SUBTITLE FILES IN .vtt FORMAT');

// ** VARIABLES **
var videoUrl;
var loadButton = document.getElementById('load');
var playButton = document.getElementById('playButton');
var recordButton = document.getElementById('record');
var video = document.getElementById('video');
var buttonDown;
var buttonUp;
var listId = 1;
var captionSection = document.getElementById('captionSection');
var resetCaptionsButton;
var orderedList = document.getElementById('timeList');

var generateButton = document.getElementById('generate');
var createFileButton = document.getElementById('create');
var codeOutput = document.getElementById('code');

// ** FUNCTIONS **
// Add video to page
var loadVideo = function () {
	videoUrl = document.getElementById('userUrl').value;
	var video = document.getElementById('video');
	video.setAttribute('src', videoUrl);
	console.log('The video has been loaded');
	console.log(videoUrl);
	// Call function to check file extension and apply attribute type
	checkVideoType();
}

// Add function to set the video file type depending on the extension of the url
function checkVideoType () {
	var videoExtension = videoUrl.substr(videoUrl.indexOf('.')+1);
	var video = document.getElementById('video');
	video.setAttribute('type', videoExtension);
	if (videoExtension !== 'mp4' && videoExtension !== 'ogg') {
		alert('Squawk does not support this file type and it may not behave as expected. Squawk supports .mp4 and .ogg formats please check your url for typos or find a different format of the video');
	}
}
// have user interaction to log time intervals
	// create a record button that triggers an event on mousedown and mouseup
		// create a logtime function
var logTime = function () {
	var timeStamp = video.currentTime.toFixed(3);
	return timeStamp;
}

// create two functions that update down and up time using logtime function
var logDownTime = function () {
	var time = logTime();
	buttonDown = time;
	console.log('Recording Started at: ' + buttonDown);
}

var logUpTime = function () {
	var time = logTime();
	buttonUp = time;
	console.log('Recording stopped at: ' + buttonUp);
}

// Create function to take the time stamp in seconds and convert it to .webvtt format (hh:mm:ss.sss)
function convertToTimeFormat (time) {
	var tick = time
	var hrs = Math.floor(tick/3600);
	tick = tick - 3600 * hrs;
	var mins = Math.floor(tick/60);
	tick = tick - 60 * mins;
	// Get seconds to 3 decimal places
	var secs = tick.toFixed(3);
	var tock = (hrs < 10 ? "0" : "" ) + hrs + ":" 
         + (mins < 10 ? "0" : "" ) + mins + ":" 
         + (secs < 10 ? "0" : "" ) + secs;
    // Return the output
    return tock;
}

// Create a caption list item
var addCaptionHolder = function (down, up) {
	console.log('Time stamp added to caption number: ' +listId);
	// Create li
	var li = document.createElement('li');
	// Set unique id
	li.setAttribute('id','caption' + listId);
	// Create caption input
	var input = document.createElement('input');
	// Set unique id
	input.setAttribute('id','input' + listId);
	// Set tab index
	input.setAttribute('tabindex', listId);
	// Set input type
	input.setAttribute('type', 'text');
	// Create save button
	var saveButton = document.createElement('button');
		// Set save button attribute to call function
		saveButton.setAttribute('onclick', 'saveEditCaption("' + 'input' + listId + '", "save' + listId +'")');
	// Create play snippet button
	var playSnippetButton = document.createElement('button');
		// Set play snippet button attribute to call function and pass the start record time value
		playSnippetButton.setAttribute('onclick', 'playSnippet("' +  listId + '", "' + down +'")');
	// Create delete button
	var deleteButton = document.createElement('button');
		// Set delete button attribute to call function
		deleteButton.setAttribute('onclick','deleteCaptionHolder("' + 'caption' + listId + '")');
	// Create spans for time stamp
	var startSpan = document.createElement('span');
	var endSpan = document.createElement('span');
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
	// Add 1 to list item for next id
	listId += 1;
	// Disable generate button untill its saved
	console.log('not all captions are saved');
	generateButton.setAttribute('disabled', '');
	createFileButton.setAttribute('disabled','');
	codeOutput.setAttribute('placeholder','All captions must be saved before you can generate your file.');
}

// Delete caption list item, pass caption id to function
function deleteCaptionHolder (captionID) {
	console.log('Deleted: ' + captionID);
	// Create a variable from element with passed id
	var item = document.getElementById(captionID);
	// Remove list item with passed id name from the list
	orderedList.removeChild(item);
	// Cycle through captions and see if they are saved using checkIfAllCaptionsAreComplete function
	var countList = orderedList.childNodes.length;
	checkIfAllCaptionsAreComplete(countList);

}

// Create a function to disable/enable caption input
function saveEditCaption (inputID, buttonID) {
	// Get elements by id supplied through the function values
	var item = document.getElementById(inputID);
	var item2 = document.getElementById(buttonID);
	// When user clicks button check if the disabled attribute is set
	// If it is already set remove it and change the button to save
	if (item.hasAttribute('disabled')) {
		item.removeAttribute('disabled');
		item2.innerHTML = 'Save';
		console.log(inputID + ' can be edited');
		if (item.parentElement.querySelector('.saveTick')) {
			var getSaveTick = item.parentElement.getElementsByClassName('saveTick');
			item.parentElement.removeChild(getSaveTick[0]);
			console.log('not all captions are saved');
			generateButton.setAttribute('disabled', '');
			createFileButton.setAttribute('disabled','');
			codeOutput.setAttribute('placeholder','All captions must be saved before you can generate your file.');
		} else {

		}

	} else {
	// if it is not set set it to disabled and change the button to edit
		item.setAttribute('disabled','');
		item2.innerHTML = 'Edit';
		console.log(inputID + ' has been saved');
		
		if (item.parentElement.querySelector('.saveTick')) {

		} else {
			var saveCheck = document.createElement('div');
			saveCheck.className = 'saveTick';
			saveCheck.appendChild(document.createTextNode('\u2714'));
			item.parentElement.appendChild(saveCheck);
		}
		// Cycle through captions and see if they are saved using checkIfAllCaptionsAreComplete function
		var countList = orderedList.childNodes.length;
		checkIfAllCaptionsAreComplete(countList);
	}
}

// Function to run through list items and see if they are saved, if they are enable generate button!
function checkIfAllCaptionsAreComplete (numberOfCaptionsToCheck) {
	
	for (var i = 1; i <= numberOfCaptionsToCheck; i += 1 ) {
	
		var checkForCompleteCaption = document.getElementById('caption' + i);
		
		if (checkForCompleteCaption === null) {
			numberOfCaptionsToCheck += 1;
		} else if (checkForCompleteCaption.querySelector('.saveTick')) {
			console.log(i + ' is saved');
		} else {
			break;
		}

		if (i === numberOfCaptionsToCheck) {
			console.log('All captions are saved!');
			generateButton.removeAttribute('disabled');
			codeOutput.setAttribute('placeholder','Press generate to preview your code here.');
		} else {
		
		}
	}
}

function playSnippet (captionID, startTime) {
	console.log('Play snippet ' + captionID + ' from: ' + startTime);
	video.currentTime = startTime;
	console.log(video.currentTime);
	video.play();
}

// Add reset all captions button if needed
function addResetButton () {
	// Check to see if the reset button already exhists
	if (captionSection.querySelector('#resetButton')) {

	} else {
	// If it doesnt then add the reset button
		console.log('Reset button added');
		// Create reset button
		resetCaptionsButton = document.createElement('button');
		// Set click attribute to call removeAllCaptions function
		resetCaptionsButton.setAttribute('onclick','removeAllCaptions("")');
		// Set the id of the button to be called in other functions
		resetCaptionsButton.setAttribute('id','resetButton');
		// Set button text
		resetCaptionsButton.appendChild(document.createTextNode('Reset all Captions'));
		// Add button as a child to the and of parent element
		captionSection.appendChild(resetCaptionsButton);
	}
}

// Create a function to remove all exhisting captions to be called by the reset button
function removeAllCaptions () {
	// while the list has a first child remove it (removes all children)
	while (orderedList.firstChild) {
		orderedList.removeChild(orderedList.firstChild)
	}
	console.log('Removed all captions & reset button');
	// Get the reset button by id and remove it from the dom
	var removeResetButton = document.getElementById('resetButton');
	captionSection.removeChild(removeResetButton);
	// Disable generate button
	generateButton.setAttribute('disabled', '');
	// Disable create file button
	createFileButton.setAttribute('disabled','');
	// Reset the captions id counter
	listId = 1;
}

// Create a function to grab data from each element
var getDataFromCaptions = function () {
	console.log('generate called');
	// Create a way to put data to text area
	codeOutput.innerHTML = '';
	// Add header to webvtt
	codeOutput.appendChild(document.createTextNode('WEBVTT' + '\u000a'));
	// Create a loop to go through each caption
	var captionCount = orderedList.childNodes.length;
	for (var i = 1; i <= captionCount; i += 1) {
		console.log('getting data from caption ' + i);
		// Get input data
		var input = document.getElementById('input' + i);
		// If the input is missing (has been deleted) increase the captionCount to compensate 
		if (input === null) {
			captionCount += 1;
		} else {
			input = '- ' + input.value;
			// log it
			console.log(input);
			// Get time stamp data
			var startTime = document.getElementById('rec_down' + i);
			startTime = startTime.textContent;
			var endTime = document.getElementById('rec_up' + i);
			endTime = endTime.textContent;
			// log it
			console.log(startTime + ' --> ' + endTime);
			
			// Unicode - u000a line feed, u000d carriage return
			codeOutput.appendChild(document.createTextNode('\u000d' + i + '\u000a' ));
			codeOutput.appendChild(document.createTextNode(startTime + ' --> ' + endTime + '\u000a' ));
			codeOutput.appendChild(document.createTextNode(input + '\u000d'));
		}
	}
	console.log(i);
}

// Enable the record button & set the play/pause button
var enableRecord = function () {
	recordButton.removeAttribute('disabled', '');
	if (playButton.innerHTML === 'Play') {
		playButton.innerHTML = 'Pause';
	}
}

// Disable the record button & set the play/pause button
var disableRecord = function () {
	recordButton.setAttribute('disabled', '');
	if (playButton.innerHTML === 'Pause') {
		playButton.innerHTML = 'Play';
	}
}

// Toggle play/pause
var playPause = function () {
	if (playButton.innerHTML === 'Play') {
		video.play();
		playButton.innerHTML = 'Pause';
	} else if (playButton.innerHTML === 'Pause') {
		video.pause();
		playButton.innerHTML = 'Play';
	}
}

// ** RUN PROGRAM **

// Load video button
loadButton.onclick = loadVideo;
// Play button
playButton.onclick = playPause;
// Record button
recordButton.onmousedown = logDownTime;
recordButton.onmouseup = function () {
	logUpTime();
	// generate list item
	addCaptionHolder(buttonDown, buttonUp);
	// call addResetButton function
	addResetButton();
}
// Generate button
generateButton.onclick = function () {
	getDataFromCaptions();
	createFileButton.removeAttribute('disabled');
}


video.addEventListener('play', enableRecord);
video.addEventListener('pause', disableRecord);
video.addEventListener('ended', disableRecord);


