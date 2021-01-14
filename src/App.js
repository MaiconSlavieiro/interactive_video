import './App.css';
import "./video-react.css";
import { Player, BigPlayButton  } from 'video-react';
import React, { useEffect, useState } from 'react';

function App() {   

  const playerIns = React.createRef();

  const [videoLink, setVideoLink] = useState("");
  const [nextVideo, setNextVideo] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [showInteraction, setShowInteraction] = useState(false);
  const [interection, setInterection] = useState("");
  const [changes, setChanges] = useState({});


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
      interactionStart: '17',
      interactionEnd: '22',
      decisions: [
        {
          text: '🥽',
          imgUrl: '',
          sequenceVideoId: 'pool',
          default: true
        },
        {
          text: '🌊',
          imgUrl: '',
          sequenceVideoId: 'ocean'
        }
      ]
    },
    quarto: {
      videoUrl: './20210107_175954.mp4',
      startVideo: '0',
      endVideo: '07',
      interactionStart: '2',
      interactionEnd: '6',
      decisions: [
        {
          text: '👁',
          imgUrl: '',
          sequenceVideoId: 'eye',
          default: true
        },
        {
          text: '🌞',
          imgUrl: '',
          sequenceVideoId: 'light'
        },
        {
          text: '🌚',
          imgUrl: '',
          sequenceVideoId: 'moon'
        }
      ]
    },

    pool: {
      videoUrl: './pool.mp4',
      startVideo: '0',
      endVideo: '35',
    },
    ocean: {
      videoUrl: './ocean.mp4',
      startVideo: '0',
      endVideo: '29',
    },
    eye: {
      videoUrl: './eye.mp4',
      startVideo: '0',
      endVideo: '24',
    },
    moon: {
      videoUrl: './moon.mp4',
      startVideo: '0',
      endVideo: '23',
    },
    light: {
      videoUrl: './light_on_bed.mp4',
      startVideo: '0',
      endVideo: '10',
    },

  }

  const loadVideo = (id) => {     
    let sequence = script[id];
    setShowInteraction(false);
    setCurrentVideo(sequence);  
    
    if(sequence.videoUrl != currentVideo.videoUrl)
    setVideoLink(sequence.videoUrl); 
  }

  function loadDefaultNextVideo(sequence) {    
    let next_video;
    let next_config;
    if (sequence.decisions) {
      next_config = sequence.decisions.find(element => element.default);
      if (!next_config) {
        next_config = sequence.decisions[0]
      }
      next_video = next_config.sequenceVideoId
    } else {
      next_video = undefined;
    }
    
    setNextVideo(next_video);
    console.log('loadDefaultNextVideo try set', next_video, 'nextVideo', nextVideo)
  }

  const initPlayer = () => {
    loadVideo("start")
  }

  const startInteraction = () => {
    console.log('startInteraction')
    if(!showInteraction) {  
      setShowInteraction(true)
    }
  }

  const endInteraction = () => {
    console.log('startInteraction')
    if(!showInteraction) {  
      setShowInteraction(false)
    }
  }

  const endVideo = () => {
    if(nextVideo) {
      loadVideo(nextVideo);      
    }     
  }

  useEffect(() => {    
    let state = changes;
    if (Math.round(state.currentTime) >= currentVideo.interactionStart) {
      startInteraction()
    }

    if (Math.round(state.currentTime) >= currentVideo.interactionEnd) {
      endInteraction()
    }

    if (Math.round(state.currentTime) >= currentVideo.endVideo) {
      endVideo()
    }
  }, [changes]);

  useEffect(() => {    
    initPlayer();
    playerIns.current.subscribeToStateChange(setChanges);    
  }, []);
 

  useEffect(() => {    
    let player = playerIns.current; 
    loadDefaultNextVideo(currentVideo);
    player.load();      
    player.seek(currentVideo.startVideo);
    player.play(); 
  }, [currentVideo]);

  useEffect(()=> {  
    if(interection)
    setNextVideo(interection);
  }, [interection])

  return (
    <div className="player_box">
       
      <Player src={videoLink} ref={playerIns} playsInline >
      <BigPlayButton position="center" hidden />
      </Player>

      <div className="decisions">
        {showInteraction && currentVideo.decisions && currentVideo.decisions.map((el) => 
        <button className="decision" key={el.text} onClick={ () => {
          setInterection(el.sequenceVideoId)
          } }> 
          {el.text}
        </button>   
      )}
      </div>
     

      
    </div>
  );
}

export default App;
