import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import ConnectedUsers from "../components/ConnectedUsers.js"
import { store, actions } from '../components/store.js';
import { useTranslation } from 'react-i18next';

var Phaser = null;
var obj = null;
var ownerLobby;

import('phaser')
  .then((module) => {
    Phaser = module;
  })

function Game({ socket , sharedValue, sharedId}) {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const userInfo = useSelector((state) => state.data);
    const gameInfo = useSelector((state) => state.gameInfo);
    const pathGame = useSelector((state) => state.pathGame);
    const token = localStorage.getItem('access_token');
  
    const [lobbyId, setLobbyId] = useState(null);
    const [lobbyIdInput, setLobbyIdInput] = useState(null);
    const [displayCanvas, setDisplayCanvas] = useState(false);
    const [gameModeSelected, setGameModeSelected] = useState(false);
    const [singlePlayer, setSinglePlayer] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [singlePlayerUserName, setSinglePlayerUserName] = useState(null);
    const [multiPlayerUserName, setMultiPlayerUserName] = useState(null);
    const [createRoomOwner, setcreateRoomOwner] = useState(null);
    const [notRoomOwner, setNotRoomOwner] = useState(null);
    const [optionSelected, setOptionSelected] = useState(false);
    const [lobbyStarted, setLobbyStarted] = useState(false);
    const [lobbyJoined, setLobbyJoined] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [hasMultiplayer, setHasMultiplayer] = useState(null);
    const [hasSingleplayer, setHasSingleplayer] = useState(null);
    const [messageError, setMessageError] = useState("Error");
    const [buttonText, setButtonText] = useState("Playrerewr");
    const { t } = useTranslation();
  


  useEffect(() => {
    return () => {
      if (obj != null || obj != undefined) {
        obj.destroyGame();
      }
      socket.emit("leave_lobby");
    };
  }, []);

  console.log(sharedValue)
  console.log(sharedId)

  useEffect(() => {
    getScript();
  }, []);

  useEffect(() => {
    socket.on("message_error", (msg) => {
      setMessageError(msg);
      setSinglePlayerUserName(null);
      setGameModeSelected(false);
      setSinglePlayer(false);
      setGameStarted(false);
      setLobbyJoined(false);

      document.getElementById("popup").style.display = "block";
      setTimeout((() => {
        document.getElementById("popup").style.display = "none";
      }), 3000)
    });

    socket.on("message_error_start_game", (msg) => {
      setMessageError(msg);
      setGameStarted(false);
      document.getElementById("popup").style.display = "block";
      setTimeout((() => {
        document.getElementById("popup").style.display = "none";
      }), 3000)
    });

    socket.on("message_error_alone", (msg) => {
      setMessageError(msg);
      document.getElementById("popup").style.display = "block";
      setTimeout((() => {
        document.getElementById("popup").style.display = "none";
      }), 3000)
    });

    socket.on("message_button_play", (msg) => {
      setButtonText(msg);
    });
  }, []);

  useEffect(() => {
    socket.on("lobby_info", (data) => {
      setLobbyId(data.lobbyIdentifier);
      ownerLobby = data;
      console.log(ownerLobby);
    });

    socket.on("start_game", () => {
      setDisplayCanvas(true);
      socket.emit("get_players_in_lobby");
      const myTimeout = setTimeout(play, 500);
    });

    socket.on('send_datagame_to_platform', (data) => {
      if (obj != null) {
        obj.recibirInfoFromPlatform(data);
      }
    });

    if (isLoggedIn) {
      setUsername(userInfo.name);
      setOwnerName(userInfo.name)
    }

    return () => {
      socket.off("start_game");
      socket.off("lobby_info");
      socket.off("send_datagame_to_platform");
    };
  }, [userInfo, isLoggedIn, displayCanvas]);

  //Funciones lobby single player.
  function saveUsername() {
    if (singlePlayerUserName != null) {
      socket.emit("new_lobby", {
        username: singlePlayerUserName,
        max_players: obj.config_game.max_players,
        gameId: gameInfo,
      });
      setLobbyStarted(true);
    } else {
      setDisplayCanvas(false)
      console.log("El nombre no puede estar vacio");
    }
  };

  function gameMode() {
    setGameModeSelected(true);
  }

  function handleSaveUsernameOnClick() {
    if (singlePlayerUserName != null) {
      socket.emit("new_lobby", {
        username: singlePlayerUserName,
        max_players: obj.config_game.max_players,
        gameId: gameInfo
      });
      setLobbyStarted(true);
    } else {
      console.log("El nombre no puede estar vacio");
      setDisplayCanvas(false)
    }
  };

  //Funciones lobby multiplayer.
  function joinRoom() {
    setcreateRoomOwner(false);
    setNotRoomOwner(true);
    setOptionSelected(true);
  }

  function createRoom() {
    setcreateRoomOwner(true);
    setNotRoomOwner(false);
    setOptionSelected(true);
  }

  function handleSetLobbyIdNoOwner(e) {
    setLobbyIdInput(e.target.value);
  }

  function handleSetMultiPlayerUsername(e) {
    setMultiPlayerUserName(e.target.value);
  }

  function joinLobby() {
    if ((lobbyIdInput || lobbyIdInput != null) && (multiPlayerUserName || multiPlayerUserName != null)) {
      setLobbyJoined(true);
      socket.emit("join_room", {
        lobbyIdentifier: lobbyIdInput,
        username: multiPlayerUserName,
        gameID: gameInfo,
      });
    }
    else {
      if (!lobbyIdInput) {
        setMessageError("Lobby id can't be null");
      }
      else if (!multiPlayerUserName) {
        setMessageError("Username can't be null");
      }

      document.getElementById("popup").style.display = "block";
      setTimeout((() => {
        document.getElementById("popup").style.display = "none";
      }), 3000)
    }

  }

  function toggleForm() {
    setDisplayForm(true);
    setcreateRoomOwner(false);
    setOptionSelected(true);
  }

  function handleChangeLobbyId(e) {
    setLobbyIdInput(e.target.value);
  }

  function handleChangeUsername(e) {
    setUsername(e.target.value);
  }

  function startGame() {
    if (singlePlayerUserName != null || multiPlayerUserName != null) {
      socket.emit("can_start_game", singlePlayer);
      setGameStarted(true);
    } else {
      console.log("El nombre del owner no puede estar vacio");
    }
  }

  function getScript() {
    fetch(process.env.REACT_APP_NODE_FITXERS_URL + pathGame, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Request-Method":"POST, GET, PUT, OPTIONS"
      //'Access-Control-Allow-Headers': 'API-Key'
      },
    })
      .then(response =>
        //  console.log("Response == ", response.text())
        response.text()
      )
      .then(scriptText => {
        console.log("ScriptText ===", scriptText.length);
        console.log("ScriptText FI");
        const scriptFn = new Function(scriptText + '; return executeGame()');
        obj = scriptFn();
        setHasMultiplayer(obj.config_game.multiplayer);
        setHasSingleplayer(obj.config_game.singleplayer);
      })
  }

  function play() {
    if (document.getElementById('canvas')) {
      obj.init(sendInfoGame, finalJuego);
      obj.recibirInfoLobby(ownerLobby);
    }
  }

  function sendInfoGame(infoGame) {
    socket.emit("datagame", infoGame);
  }

  async function finalJuego(points) {
    var totalScore = points;

    if (totalScore > 300) {
      totalScore = 150;
    }
    var gameId = gameInfo;
    var score = totalScore;
    setGameEnded(true);

    if (isLoggedIn) {
      try {
        const response = await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/saveScore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ totalScore }),
        });
        const data = await response.json();
        store.dispatch(actions.saveData(data));
        const userId = data.id;

        await fetch(process.env.REACT_APP_LARAVEL_URL + '/api/createPlayedGame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, gameId, score }),
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <canvas id="canvas_image" className="hidden"></canvas>
      <div id="popup" className="hidden">{messageError}</div>
      <div className="flex h-screen justify-center items-center min-h-screen bg-image-all bg-cover bg-no-repeat bg-center bg-fixed">
        <div className="g-6 flex h-full flex-wrap items-center justify-center">
          <div className="block rounded-lg bg-gray-800 shadow-lg dark:bg-neutral-800">
            <div className="relative p-4 md:m-6 md:p-12 text-center">
              {!gameModeSelected && !displayCanvas ?
                <div>
                  <h3 className="text-white">{t('gameMode')}</h3>
                  <br></br>
                  <div>
                    {hasSingleplayer ?
                      <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setGameModeSelected(true); setSinglePlayer(true); }}>{t('gameModeSP')}</button>
                      :
                      <></>
                    }
                    {hasMultiplayer ?
                      <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setGameModeSelected(true); setSinglePlayer(false); }}>{t('gameModeMP')}</button>
                      :
                      <></>
                    }
                  </div>
                </div>
                :
                <div>
                  {singlePlayer && !gameStarted ?
                    <div>
                      <button className="bg-violet-500 absolute left-0 top-0 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setGameModeSelected(false); setSinglePlayer(false); }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
                      </svg></button>
                      {isLoggedIn ?
                        <div>
                          <h3 className="text-white">{t('gameModePlayerNameLoggedIn')}</h3>
                          <div>
                            {singlePlayerUserName && <p className="text-white">{singlePlayerUserName}</p>}
                            <br></br>
                            <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { saveUsername(); startGame(); }}>{t('gamesPlay')}</button>
                          </div>
                        </div>
                        :
                        <div>
                          <label>
                            <div>
                              <input
                                className="text-white peer block min-h-[auto] w-full border-2 border-fuchsia-600 rounded bg-transparent px-3 py-[0.32rem] 
                                          leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                                          data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 
                                          [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                id="singlePNotLoggedIn" type="text"
                                required placeholder="Username" onChange={handleSetSinglePlayerUsername} />

                              <label className="text-white">
                                {t('gameModePlayerNameNotLoggedIn')}
                              </label><br></br>
                              <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { handleSaveUsernameOnClick(); startGame(); }}>{t('gamesPlay')}</button>
                            </div>
                          </label>
                        </div>
                      }
                    </div>
                    :
                    <div>
                      {!optionSelected && !gameStarted ?
                        <div>
                          <button className="bg-violet-500 absolute left-0 top-0 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { setGameModeSelected(false); }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
                          </svg></button>

                          <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={createRoom}>{t('createLobby')}</button><br></br><br></br>
                          <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={joinRoom}>{t('joinLobby')}</button>
                        </div> :
                        <></>
                      }
                      {createRoomOwner ?
                        <div>
                          <h1 className="text-white text-3xl font-bold">{lobbyId}</h1>
                          <ConnectedUsers socket={socket} />
                          {isLoggedIn ?
                            <div>
                              {!lobbyStarted ?
                                <div>
                                  {singlePlayerUserName && <p className="text-white">{singlePlayerUserName}</p>}
                                  <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { saveUsername() }}>{t('setLobby')}</button>
                                </div>
                                :
                                <div>
                                  {!gameStarted ?
                                    <div>
                                      <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { startGame(); }}>{buttonText}</button>
                                    </div>
                                    :
                                    <></>
                                  }
                                </div>
                              }
                            </div>
                            :
                            <div>
                              {!lobbyStarted ?
                                <div>
                                  <label>
                                    <div>
                                      <input
                                        className="text-white peer block min-h-[auto] w-full border-2 border-fuchsia-600 rounded bg-transparent px-3 py-[0.32rem] 
                                          leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                                          data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 
                                          [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="singlePNotLoggedIn" type="text"
                                        required placeholder="Username" onChange={handleSetSinglePlayerUsername} />
                                      <label className="text-white">
                                        {t('gameModePlayerNameNotLoggedIn')}
                                      </label><br></br>
                                      <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { handleSaveUsernameOnClick() }}>{t('setLobby')}</button>
                                    </div>
                                  </label>
                                </div>
                                :
                                <div>
                                  {!gameStarted ?
                                    <div>
                                      <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { startGame(); }}>{buttonText}</button>
                                    </div>
                                    :
                                    <></>
                                  }
                                </div>
                              }
                            </div>
                          }
                        </div>
                        :
                        <></>
                      }
                      {notRoomOwner ?
                        <div>
                          {!lobbyJoined ?
                            <div>
                              {isLoggedIn ?
                                <div>
                                  {multiPlayerUserName && <p className="text-white">{multiPlayerUserName}</p>}
                                  <input
                                    className="text-white peer block min-h-[auto] w-full border-2 border-fuchsia-600 rounded bg-transparent px-3 py-[0.32rem] 
                                          leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                                          data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 
                                          [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="singlePNotLoggedIn" type="text"
                                    required placeholder="Lobby ID" value={lobbyIdInput} onChange={handleSetLobbyIdNoOwner} />
                                  <label className="text-white">{t('intLobbyID')}</label><br></br>
                                  <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { joinLobby() }}>{t('joinLobby')}</button>
                                </div>
                                :
                                <div>
                                  <label>
                                    <div>
                                      <label>
                                        <div>
                                          <input
                                            className="text-white peer block min-h-[auto] w-full border-2 border-fuchsia-600 rounded bg-transparent px-3 py-[0.32rem] 
                                          leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                                          data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 
                                          [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                            id="multiPNotLoggedIn" type="text"
                                            required placeholder="Username" value={multiPlayerUserName} onChange={handleSetMultiPlayerUsername} />
                                          <label className="text-white">
                                          {t('gameModePlayerNameNotLoggedIn')}
                                          </label><br></br>
                                        </div>
                                      </label>
                                      <input
                                        className="text-white peer block min-h-[auto] w-full border-2 border-fuchsia-600 rounded bg-transparent px-3 py-[0.32rem] 
                                          leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                                          data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:placeholder:text-neutral-200 
                                          [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="singlePNotLoggedIn" type="text"
                                        required placeholder="Lobby ID" value={lobbyIdInput} onChange={handleSetLobbyIdNoOwner} />
                                      <label className="text-white">{t('intLobbyID')}</label><br></br>
                                      <button className="bg-violet-500 m-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded" onClick={() => { joinLobby() }}>{t('joinLobby')}</button>
                                    </div>
                                  </label>
                                </div>
                              }
                            </div> :
                            <ConnectedUsers socket={socket} />
                          }
                        </div>
                        :
                        <></>
                      }
                    </div>
                  }
                </div >
              }
              {displayCanvas ?
                <div>
                  <div>
                  </div>
                  <div id="game">
                    <canvas id="canvas" className="canvasGame"></canvas>
                  </div>
                </div>
                :
                <></>
              }
            </div >
          </div></div></div>
    </div>
  )
}

export default Game;