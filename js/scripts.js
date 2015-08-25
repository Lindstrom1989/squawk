(function() {
    var textFile = null, makeTextFile = function(text) {
        var data = new Blob([ text ], {
            type: "text/vtt"
        });
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };
    var create = document.getElementById("create"), textbox = document.getElementById("code");
    create.addEventListener("click", function() {
        var link = document.getElementById("downloadlink");
        link.href = makeTextFile(textbox.value);
        link.style.display = "inline-block";
    }, false);
})();

"use strict";

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
console.log("  ____                             _         _   _ \r\n / ___|  __ _ _   _  __ ___      _| | __    / | / |\r\n \\___ \\ / _` | | | |/ _` \\ \\ /\\ / / |/ /    | | | |\r\n  ___) | (_| | |_| | (_| |\\ V  V /|   <     | |_| |\r\n |____/ \\__, |\\__,_|\\__,_| \\_/\\_/ |_|\\_\\    |_(_)_|\r\n           |_|                                     ");

console.log("A PROGRAM FOR CREATING SUBTITLE FILES IN .vtt FORMAT");

// ** VARIABLES **
var videoUrl;

var loadButton = document.getElementById("load");

var playButton = document.getElementById("playButton");

var recordButton = document.getElementById("record");

var video = document.getElementById("video");

var buttonDown;

var buttonUp;

var listId = 1;

var captionSection = document.getElementById("captionSection");

var resetCaptionsButton;

var orderedList = document.getElementById("timeList");

var generateButton = document.getElementById("generate");

var createFileButton = document.getElementById("create");

var codeOutput = document.getElementById("code");

// ** FUNCTIONS **
// Add video to page
function loadVideo() {
    videoUrl = document.getElementById("userUrl").value;
    var video = document.getElementById("video");
    video.setAttribute("src", videoUrl);
    console.log(videoUrl);
    // Call function to check file extension and apply attribute type
    checkVideoType();
}

// Function to set the video file type depending on the extension of the url
function checkVideoType() {
    var videoExtension = videoUrl.substr(videoUrl.lastIndexOf(".") + 1);
    var video = document.getElementById("video");
    video.setAttribute("type", videoExtension);
    if (videoExtension !== "mp4" && videoExtension !== "ogg") {
        alert("Squawk does not support this file type and it may not behave as expected. Squawk supports .mp4 and .ogg formats please check your url for typos or find a different format of the video");
    }
}

// Function that enables play button if url exhists
function enablePlayButton() {
    videoUrl = document.getElementById("userUrl").value;
    if (videoUrl === "") {
        playButton.setAttribute("disabled", "");
        alert("A url must be entered");
    } else {
        playButton.removeAttribute("disabled", "");
        console.log("The video has been loaded");
    }
}

// Function that logs the time on mouse events
var logTime = function() {
    var timeStamp = video.currentTime.toFixed(3);
    return timeStamp;
};

// Two functions that update down and up time using logtime function
var logDownTime = function() {
    var time = logTime();
    buttonDown = time;
    console.log("Recording Started at: " + buttonDown);
};

var logUpTime = function() {
    var time = logTime();
    buttonUp = time;
    console.log("Recording stopped at: " + buttonUp);
};

// Function to take the time stamp in seconds and convert it to .webvtt format (hh:mm:ss.sss)
function convertToTimeFormat(time) {
    var tick = time;
    var hrs = Math.floor(tick / 3600);
    tick = tick - 3600 * hrs;
    var mins = Math.floor(tick / 60);
    tick = tick - 60 * mins;
    // Get seconds to 3 decimal places
    var secs = tick.toFixed(3);
    var tock = (hrs < 10 ? "0" : "") + hrs + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    // Return the output
    return tock;
}

// Create a caption list item
var addCaptionHolder = function(down, up) {
    console.log("Time stamp added to caption number: " + listId);
    var li = document.createElement("li");
    // Create li
    li.setAttribute("id", "caption" + listId);
    // Set unique id
    var input = document.createElement("input");
    // Create caption input
    input.setAttribute("id", "input" + listId);
    // Set unique id
    input.setAttribute("tabindex", listId);
    // Set tab index
    input.setAttribute("type", "text");
    // Set input type
    var saveButton = document.createElement("button");
    // Create save button
    // Set save button attribute to call function
    saveButton.setAttribute("onclick", 'saveEditCaption("' + "input" + listId + '", "save' + listId + '")');
    var playSnippetButton = document.createElement("button");
    // Create play snippet button
    // Set play snippet button attribute to call function and pass the start record time value
    playSnippetButton.setAttribute("onclick", 'playSnippet("' + listId + '", "' + down + '")');
    var deleteButton = document.createElement("button");
    // Create delete button
    // Set delete button attribute to call function
    deleteButton.setAttribute("onclick", 'deleteCaptionHolder("' + "caption" + listId + '")');
    var startSpan = document.createElement("span");
    // Create spans for time stamp
    var endSpan = document.createElement("span");
    // Create spans for time stamp
    // Add each aditional list item to the end
    orderedList.appendChild(li);
    // Add children element to list item
    orderedList.lastChild.appendChild(input);
    orderedList.lastChild.appendChild(saveButton).innerHTML = "Save";
    orderedList.lastChild.appendChild(playSnippetButton).innerHTML = "Play snippet";
    orderedList.lastChild.appendChild(deleteButton).innerHTML = "Delete";
    orderedList.lastChild.appendChild(startSpan);
    orderedList.lastChild.appendChild(endSpan);
    // Add id to elements
    saveButton.setAttribute("id", "save" + listId);
    startSpan.setAttribute("id", "rec_down" + listId);
    startSpan.className = "rec_down";
    endSpan.setAttribute("id", "rec_up" + listId);
    endSpan.className = "rec_up";
    playSnippetButton.className = "play";
    deleteButton.className = "delete";
    // Send the time stamp to the convertToTimeFormat function
    // Add start and end time to spans
    startSpan.innerHTML = convertToTimeFormat(down);
    endSpan.innerHTML = convertToTimeFormat(up);
    listId += 1;
    // Add 1 to list item for next id
    // Disable generate button untill its saved
    console.log("not all captions are saved");
    generateButton.setAttribute("disabled", "");
    createFileButton.setAttribute("disabled", "");
    codeOutput.setAttribute("placeholder", "All captions must be saved before you can generate your file.");
};

// Create function to delete caption list item, pass caption id to function
function deleteCaptionHolder(captionID) {
    console.log("Deleted: " + captionID);
    // Create a variable from element with passed id
    var item = document.getElementById(captionID);
    // Remove list item with passed id name from the list
    orderedList.removeChild(item);
    // Cycle through captions and see if they are saved using checkIfAllCaptionsAreComplete function
    var countList = orderedList.childNodes.length;
    checkIfAllCaptionsAreComplete(countList);
    // Call function to see if it was the last li and remove reset button if
    removeResetButton();
}

// Create a function to disable/enable caption input
function saveEditCaption(inputID, buttonID) {
    // Get elements by id supplied through the function values
    var item = document.getElementById(inputID);
    var item2 = document.getElementById(buttonID);
    // When user clicks button check if the disabled attribute is set
    // If it is already set remove it and change the button to save
    if (item.hasAttribute("disabled")) {
        item.removeAttribute("disabled");
        item2.innerHTML = "Save";
        console.log(inputID + " can be edited");
        if (item.parentElement.querySelector(".saveTick")) {
            var getSaveTick = item.parentElement.getElementsByClassName("saveTick");
            item.parentElement.removeChild(getSaveTick[0]);
            console.log("not all captions are saved");
            generateButton.setAttribute("disabled", "");
            createFileButton.setAttribute("disabled", "");
            codeOutput.setAttribute("placeholder", "All captions must be saved before you can generate your file.");
        } else {}
    } else {
        // if it is not set set it to disabled and change the button to edit
        item.setAttribute("disabled", "");
        item2.innerHTML = "Edit";
        console.log(inputID + " has been saved");
        if (item.parentElement.querySelector(".saveTick")) {} else {
            var saveCheck = document.createElement("div");
            saveCheck.className = "saveTick";
            saveCheck.appendChild(document.createTextNode("✔"));
            item.parentElement.appendChild(saveCheck);
        }
        // Cycle through captions and see if they are saved using checkIfAllCaptionsAreComplete function
        var countList = orderedList.childNodes.length;
        checkIfAllCaptionsAreComplete(countList);
    }
}

// Function to run through list items and see if they are saved, if they are enable generate button!
function checkIfAllCaptionsAreComplete(numberOfCaptionsToCheck) {
    for (var i = 1; i <= numberOfCaptionsToCheck; i += 1) {
        var checkForCompleteCaption = document.getElementById("caption" + i);
        if (checkForCompleteCaption === null) {
            numberOfCaptionsToCheck += 1;
        } else if (checkForCompleteCaption.querySelector(".saveTick")) {
            console.log(i + " is saved");
        } else {
            break;
        }
        if (i === numberOfCaptionsToCheck) {
            console.log("All captions are saved!");
            generateButton.removeAttribute("disabled");
            codeOutput.setAttribute("placeholder", "Press generate to preview your code here.");
        } else {}
    }
}

function playSnippet(captionID, startTime) {
    console.log("Play snippet " + captionID + " from: " + startTime);
    video.currentTime = startTime;
    console.log(video.currentTime);
    video.play();
}

// Add reset all captions button if needed
function addResetButton() {
    // Check to see if the reset button already exhists
    if (captionSection.querySelector("#resetButton")) {} else {
        // If it doesnt then add the reset button
        console.log("Reset button added");
        resetCaptionsButton = document.createElement("button");
        // Create reset button
        // Set click attribute to call removeAllCaptions function
        resetCaptionsButton.setAttribute("onclick", 'removeAllCaptions("")');
        // Set the id of the button to be called in other functions
        resetCaptionsButton.setAttribute("id", "resetButton");
        resetCaptionsButton.appendChild(document.createTextNode("Reset all Captions"));
        // Set button text
        captionSection.appendChild(resetCaptionsButton);
    }
}

// Create a function to remove reset button if no list items exhist
function removeResetButton() {
    if (orderedList.childNodes.length === 0) {
        // Get the reset button by id and remove it from the dom
        var removeResetButton = document.getElementById("resetButton");
        captionSection.removeChild(removeResetButton);
    }
}

// Create a function to remove all exhisting captions to be called by the reset button
function removeAllCaptions() {
    // while the list has a first child remove it (removes all children)
    while (orderedList.firstChild) {
        orderedList.removeChild(orderedList.firstChild);
    }
    console.log("Removed all captions & reset button");
    removeResetButton();
    // Call function to remove the reset button
    generateButton.setAttribute("disabled", "");
    // Disable generate button
    createFileButton.setAttribute("disabled", "");
    // Disable create file button
    listId = 1;
}

// Function to grab data from each element
var getDataFromCaptions = function() {
    console.log("generate called");
    // Create a way to put data to text area
    codeOutput.innerHTML = "";
    // Add header to webvtt
    codeOutput.appendChild(document.createTextNode("WEBVTT" + "\n"));
    // Create a loop to go through each caption
    var captionCount = orderedList.childNodes.length;
    for (var i = 1; i <= captionCount; i += 1) {
        console.log("getting data from caption " + i);
        // Get input data
        var input = document.getElementById("input" + i);
        // If the input is missing (has been deleted) increase the captionCount to compensate 
        if (input === null) {
            captionCount += 1;
        } else {
            input = "- " + input.value;
            // log it
            console.log(input);
            // Get time stamp data
            var startTime = document.getElementById("rec_down" + i);
            startTime = startTime.textContent;
            var endTime = document.getElementById("rec_up" + i);
            endTime = endTime.textContent;
            // log it
            console.log(startTime + " --> " + endTime);
            // Unicode - u000a line feed, u000d carriage return
            codeOutput.appendChild(document.createTextNode("\r" + i + "\n"));
            codeOutput.appendChild(document.createTextNode(startTime + " --> " + endTime + "\n"));
            codeOutput.appendChild(document.createTextNode(input + "\r"));
        }
    }
};

// Enable the record button & set the play/pause button
var enableRecord = function() {
    recordButton.removeAttribute("disabled", "");
    if (playButton.innerHTML === "Play") {
        playButton.innerHTML = "Pause";
    }
};

// Disable the record button & set the play/pause button
var disableRecord = function() {
    recordButton.setAttribute("disabled", "");
    if (playButton.innerHTML === "Pause") {
        playButton.innerHTML = "Play";
    }
};

// Toggle play/pause
var playPause = function() {
    if (playButton.innerHTML === "Play") {
        video.play();
        playButton.innerHTML = "Pause";
    } else if (playButton.innerHTML === "Pause") {
        video.pause();
        playButton.innerHTML = "Play";
    }
};

// ** RUN PROGRAM **
// Load video button
loadButton.onclick = function() {
    loadVideo();
    enablePlayButton();
};

// Play button
playButton.onclick = playPause;

// Record button
recordButton.onmousedown = logDownTime;

recordButton.onmouseup = function() {
    logUpTime();
    // generate list item
    addCaptionHolder(buttonDown, buttonUp);
    // call addResetButton function
    addResetButton();
};

// Generate button
generateButton.onclick = function() {
    getDataFromCaptions();
    createFileButton.removeAttribute("disabled");
};

video.addEventListener("play", enableRecord);

video.addEventListener("pause", disableRecord);

video.addEventListener("ended", disableRecord);