import './App.css';
import "./video-react.css";
import { Player, BigPlayButton } from 'video-react';
import React, { useEffect, useState } from 'react';
import { useWindowSize } from '@react-hook/window-size';

function App() {

  const playerIns = React.createRef();

  const [videoLink, setVideoLink] = useState("");
  const [nextVideo, setNextVideo] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [showInteraction, setShowInteraction] = useState(false);
  const [disableIntercation, setDisableIntercation] = useState(false);
  const [interection, setInterection] = useState("");
  const [changes, setChanges] = useState({});
  const [progressBarPor, setProgressBarPor] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);


  const [width, height] = useWindowSize()

  let progressBar = { width: progressBarPor + "%" }

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

    if (sequence.videoUrl != currentVideo.videoUrl)
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
    loadVideo("start");
  }

  const startInteraction = () => {
    if (!showInteraction && !disableIntercation) {
      setShowInteraction(true)
    }
  }

  const endInteraction = () => {
    if (showInteraction) {
      setShowInteraction(false)
    }
    if (disableIntercation) {
      setDisableIntercation(false)
    }
  }

  const endVideo = () => {
    if (nextVideo) {
      setAutoPlay(true);
      loadVideo(nextVideo);
    }
  }

  useEffect(() => {

    let current_time = changes.currentTime;
    let round_current_time = Math.round(changes.currentTime);
    let interaction_start = currentVideo.interactionStart;
    let interaction_end = currentVideo.interactionEnd;

    let interaction_time = interaction_end - interaction_start;
    let current_interaction_time = current_time - interaction_start;

    let interction_percentage = Math.ceil(((current_interaction_time * 100) / interaction_time) + 4);

    if (interction_percentage >= 0 && interction_percentage <= 100) {
      setProgressBarPor(interction_percentage)
    }

    if (round_current_time >= interaction_start && round_current_time < interaction_end) {
      startInteraction()
    }

    if (round_current_time >= interaction_end) {
      endInteraction()
      setProgressBarPor(0)
    }

    if (round_current_time >= currentVideo.endVideo) {
      endVideo()
      setProgressBarPor(0)
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
    if (autoPlay) player.play();

  }, [currentVideo]);

  useEffect(() => {
    if (interection) {
      setNextVideo(interection);
      setDisableIntercation(true);
      setShowInteraction(false);
    }

  }, [interection])

  return (
    <div className="player_box">

      <Player src={videoLink} ref={playerIns} className="player" fluid={false} width={width} height={height}>
          
       <BigPlayButton position="center"/> 
         
        <div className="decisions">
          <div className="decisions_container">
            {showInteraction &&
              currentVideo.decisions && currentVideo.decisions.map((el) =>
                <div className="decision" key={el.text} onClick={() => {
                  setInterection(el.sequenceVideoId)
                }}>
                  {el.text}
                </div>
              )}
          </div>
          {showInteraction &&
            <div className="base_progress_bar">
              <div className="progress_bar" style={progressBar}></div>
            </div>
          }
        </div>


      </Player>





    </div>
  );
}

export default App;
