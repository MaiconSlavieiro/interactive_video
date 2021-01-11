import './App.css';
import "../node_modules/video-react/dist/video-react.css";
import { Player } from 'video-react';
import React, { useEffect, useState } from 'react';

function App() {

  const playerIns = React.createRef();

const [videoLink, setVideoLink] = useState("");


let nextVideo;
let currentVideo;

const setNextVideo = (data) => {
  nextVideo = data;
};

const setCurrentVideo = (data) => {
  currentVideo = data;
};

let script = {
  start: {
    videoUrl: './20210107_175931.mp4',
    startVideo: '0',
    endVideo: '18',
    interactionStart: '10',
    interactionEnd: '18',
    decisions: [
      {
        text: 'Esqueda',
        imgUrl: '',
        sequenceVideoId: 'cozinha',
        default: true
      },
      {
        text: 'Direita',
        imgUrl: '',
        sequenceVideoId: 'quarto'
      }
    ]

  },
  cozinha: {
    videoUrl: './20210107_180011.mp4',
    startVideo: '0',
    endVideo: '25',
  },
  quarto: {
    videoUrl: './20210107_175954.mp4',
    startVideo: '0',
    endVideo: '07',
  },

}

const loadVideo = (id) => {
  let current = script[id];
  console.log('loadVideo current', current)
  let player = playerIns.current;
  setCurrentVideo(current);
  loadDefaultNextVideo(current);

  setVideoLink(current.videoUrl);
  player.load();
  player.seek(current.startVideo);
  player.play();
}

const loadDefaultNextVideo = (data) => {
  let nextConfig;
  if (data.decisions) {
    nextConfig = data.decisions.find(element => element.default);
    if (!nextConfig) {
      nextConfig = data.decisions[0]
    }
    let nextVideo = nextConfig.sequenceVideoId;
    setNextVideo(nextVideo)
  } else {
    setNextVideo(null)
  }
}

const initPlayer = () => {
  loadVideo("start")
}

const hasChanges = (state, prevState) => {
  console.log(state.currentTime, currentVideo)
}

const currentVideoChange = (state) => {
  console.log('currentVideoChange', state)
}

const testAction = () => {
  loadVideo(nextVideo);
  console.log("testAction nextVideo", nextVideo);
}

useEffect(() => {
  playerIns.current.subscribeToStateChange(hasChanges);
  initPlayer();
}, []);

  return (
    <div>
      <Player src={videoLink} ref={playerIns}></Player>
      <button onClick={testAction}>Next</button>
    </div>
  );
}

export default App;
