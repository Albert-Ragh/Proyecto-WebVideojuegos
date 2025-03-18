const configGame = {
    multiplayer: true,
    singleplayer: true,
    max_players: 2,
  }

var contador = 0;
var textoContador;
var textoTiempo;
var textoGameOver;
var textoWinner;
var sendInfoGame = null;
var finalJuego = null;
var tiempoObjeto = 1000;
var ownerDelLobby;
var objects;
var object;
var user;
var tiempoRestante = 30;
var usuarios = [];
var game;

function init(_sendInfoGame, _finalJuego) {
    sendInfoGame = _sendInfoGame;
    finalJuego = _finalJuego;

    var config = {
        type: Phaser.canvas,
        width: 800,
        height: 600,
        canvas: document.getElementById('canvas'),
        scene: {
            preload: preload,
            create: create,
        },
    };

    game = new Phaser.Game(config);
    return game;
}
function preload() {
    this.load.image("background", "./fitxers/GamesFiles/AimGame/images/bgImage.jpg");
    this.load.image("object", "./fitxers/GamesFiles/AimGame/images/object.jpg");
}

function create() {
    objects = this.add.group();
    var background = this.add.image(0, 0, "background").setOrigin(0);
    background.setScale(800 / background.width, 600 / background.height);
    textoContador = this.add.text(10, 10, usuarios, { font: '32px Arial', fill: '#FFFF' });
    textoTiempo = this.add.text(750, 10, tiempoRestante, { font: '32px Arial', fill: '#FFFF' });
    textoGameOver = this.add.text(400, 250, "", { font: '46px Arial', fill: '#FFFF' });
    textoGameOver.setOrigin(0.5, 0.5);
    textoWinner = this.add.text(400, 350, "", { font: '46px Arial', fill: '#FFFF' });
    textoWinner.setOrigin(0.5, 0.5);
    if (ownerDelLobby) {
        timerEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: function () {
                tiempoRestante--;

                if (tiempoRestante <= 0) {
                    var infoGame = {
                        "object": null,
                        "user": user,
                        "score": contador,
                        "tiempo": tiempoRestante,
                    };
                    sendInfoGame(infoGame);
                    timerEvent.remove();
                    finalJuego(contador);
                } else {
                    object = objects.create(
                        Phaser.Math.Between(50, 750),
                        Phaser.Math.Between(50, 550),
                        "object"
                    );
                    var infoGame = {
                        "object": object,
                        "user": user,
                        "score": contador,
                        "tiempo": tiempoRestante,
                    };

                    object.setScale(0.2);
                    object.setInteractive();
                    if (sendInfoGame != null) {
                        sendInfoGame(infoGame);
                    }

                    object.on("pointerdown", function () {
                        object.destroy(true, false);
                        contador += 10;
                        var infoGame = {
                            "user": user,
                            "score": contador,
                            "tiempo": tiempoRestante
                        };
                        sendInfoGame(infoGame);

                    });

                    this.time.addEvent({
                        delay: tiempoObjeto - 100,
                        callback: function () {
                            if (object.active) {
                                object.destroy();
                            }
                        },
                        callbackScope: this
                    });
                }
            },
            callbackScope: this
        });
    }
}

function recibirInfoFromPlatform(data) {
    if (!ownerDelLobby) {
        if (data.infoGame.tiempo == 0) {
            finalJuego(contador);
        }
        if (data.infoGame && data.infoGame.object) {
            var infoGame = {
                "user": user,
                "score": contador,
                "tiempo": data.infoGame.tiempo
            };
            sendInfoGame(infoGame);
            var object = objects.create(data.infoGame.object.x, data.infoGame.object.y, data.infoGame.object.textureKey);
            object.setScale(data.infoGame.object.scale.x);
            object.setInteractive();
            object.on("pointerdown", function () {
                object.destroy();
                contador += 10;
                var infoGame = {
                    "user": user,
                    "score": contador,
                    "tiempo": data.infoGame.tiempo
                };
                sendInfoGame(infoGame);
            });
            setTimeout(() => {
                if (object.active) {
                    object.destroy();
                }
            }, tiempoObjeto - 100);
        }
    }
    textoTiempo.setText(data.infoGame.tiempo);

    if (data.infoGame.tiempo == 0) {
        let maxScore = 0;
        let maxScoreUser = "";
        for (const [usuario, score] of Object.entries(usuarios)) {
            if (score > maxScore) {
                maxScore = score;
                maxScoreUser = usuario;
            }
        }
        textoGameOver.setText("GAME OVER");
        textoWinner.setText("El ganador es: " + maxScoreUser + " (" + maxScore + " puntos)");
        textoTiempo.setText(null);

    } else {
        usuarios[data.infoGame.user] = data.infoGame.score;

        const usuariosOrdenados = Object.entries(usuarios).sort((a, b) => b[1] - a[1]);
        let texto = '';
        for (const [usuario, score] of usuariosOrdenados) {
            texto += usuario + ': ' + score + '\n';
        }
        textoContador.setText(texto);
    }
}

function recibirInfoLobby(lobby) {
    lobby.members.forEach((member) => {
        if (member.idUser == lobby.yourId) {
            user = member.username;
        }
        if (lobby.ownerId == lobby.yourId) {
            ownerDelLobby = true;
        } else {
            ownerDelLobby = false;
        }
    });
}

function userLeft(user) {
    console.log("User left: ", user);
  }

  function destroyGame() {
    if (game != null || game != undefined) {
      game.destroy(true, false);
    }
  }

function executeGame() {
    var obj = [];

    obj.init = init;
    obj.config_game = configGame;
    obj.recibirInfoFromPlatform = recibirInfoFromPlatform;
    obj.recibirInfoLobby = recibirInfoLobby;
    obj.userLeft = userLeft;
    obj.destroyGame = destroyGame;
    return obj;
}

executeGame();