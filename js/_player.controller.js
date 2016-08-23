const PLAYER = (() => {

  const playSnippet = (captionID, startTime) => {
  	console.log('Play snippet ' + captionID + ' from: ' + startTime);
  	video.currentTime = startTime;
  	console.log(video.currentTime);
  	video.play();
  }

  let iFace = {
    playSnippet: playSnippet
  };

  return iFace;

})();
