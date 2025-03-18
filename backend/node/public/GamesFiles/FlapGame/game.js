const configGame = {
    multiplayer: true,
    singleplayer: true,
    max_players: 2,
  }

var bird;
var pipes;
var gameOverText;
var scoreEndText;
var pipe1;
var pipe2;
var score = 0;
var players = 0;
let playAgainButton;
var sendInfoGame;
var members = 0;
var finalJuego;
var ownerDelLobby;
var myID;
var GameInfo = {
    "upperPipe": "",
    "lowerPipe": "",
    "positionY": "",
};
var game;

function init(_sendInfoGame, _finalJuego) {

    sendInfoGame = _sendInfoGame;
    finalJuego = _finalJuego;

    var config = {
        type: Phaser.canvas,
        width: 800,
        height: 600,
        canvas: document.getElementById("canvas"),
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    game = new Phaser.Game(config);
    return game;
}
// Declare global variables


function preload() {
    // Preload assets
    this.load.image('bird', './fitxers/GamesFiles/FlapGame/assets/bird.png');
    this.load.image('bird2', './fitxers/GamesFiles/FlapGame/assets/bird2.png');
    this.load.image('pipe', './fitxers/GamesFiles/FlapGame/assets/pipe.png');
    this.load.image('background', './fitxers/GamesFiles/FlapGame/assets/background.png');
}

function create() {

    this.add.image(0, 0, 'background').setOrigin(0, 0);

    if (players > 1) {
        bird2 = this.physics.add.sprite(100, 300, 'bird2');
        bird2.setScale(0.2);
        bird2.setCollideWorldBounds(true);
        bird2.setGravityY(500);
    }




    // Create the bird
    bird = this.physics.add.sprite(100, 300, 'bird');
    bird.setScale(0.2);
    bird.setCollideWorldBounds(true);
    bird.setGravityY(500);



    // Add the background image


    // Create pipes group
    pipes = this.physics.add.group();


    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: 'black' });

    // Create collisions
    this.physics.add.collider(bird, pipes, gameOver, null, this);

    if (players > 1) {

        this.physics.add.collider(bird2, pipes, gameOver, null, this);
    }


    // Handle input
    this.input.on('pointerdown', flap, this);



    // Generate pipes
    pipeGenerationEvent = this.time.addEvent({
        delay: 1500,
        callback: generatePipes,
        callbackScope: this,
        loop: true
    });
}

function update() {

    // Update score
    pipes.getChildren().forEach(function (pipe) {
        if (pipe.getBounds().right < bird.getBounds().left && !pipe.scored) {
            pipe.scored = true;
            score++;
            scoreText.setText('Score: ' + score);
        }
    });
}

function flap() {
    // Apply vertical velocity to the bird

    bird.setVelocityY(-350);
    GameInfo = {
        "isBirdMoving": true,
        "IDjugador": myID,
    };
    sendInfoGame(GameInfo)
}

function generatePipes() {
    // Calculate a random pipe gap position
    if (ownerDelLobby) {
        var gapPosition = Phaser.Math.Between(300, 600);

        // Create the upper pipe
        var upperPipe = pipes.create(800, gapPosition - 500, 'pipe');
        upperPipe.setScale(0.5)
        upperPipe.flipY = true;
        upperPipe.body.allowGravity = false;

        // Create the lower pipe
        var lowerPipe = pipes.create(800, gapPosition + 100, 'pipe');
        lowerPipe.setScale(0.5)
        lowerPipe.body.allowGravity = false;

        // Set pipe velocity
        pipes.setVelocityX(-300);

        // Remove pipes when they're out of bounds
        pipes.getChildren().forEach(function (pipe) {
            if (pipe.getBounds().right < 0) {
                pipe.destroy();
            }
            pipe.scored = false;
        });

        GameInfo = {
            "isPipe": true,
            "upperPipe": upperPipe,
            "lowerPipe": lowerPipe,
        };
        if (sendInfoGame != null) {
            sendInfoGame(GameInfo);
        }
    }
}

function playAgain() {
    playAgainButton.visible = false;
}

function gameOver() {
    // Stop the game and display game over text
    scoreEndText = this.add.text(150, 450, 'Your Score is ' + score, { fontSize: '64px', fill: 'black' });
    /*playAgainButton = this.add.text(250, 350, 'Play Again', { fontSize: '64px', fill: 'white' })
        .setInteractive()
        .on('pointerup', playAgain);
    playAgainButton.visible = true;*/
    pipeGenerationEvent.remove();
    this.physics.pause();
    gameOverText = this.add.text(250, 250, 'Game Over', { fontSize: '64px', fill: 'black' });
    if (players > 1) {
        score = score * 2
    }
    if (finalJuego != null) {
        finalJuego(score)
    }
}

function recibirInfoFromPlatform(data) {
    if (!ownerDelLobby) {
        if (data.infoGame.isPipe) {
            var upperPipe = pipes.create(800, data.infoGame.upperPipe.y, 'pipe');
            upperPipe.setScale(0.5)
            upperPipe.flipY = true;
            upperPipe.body.allowGravity = false;

            // Create the lower pipe
            var lowerPipe = pipes.create(800, data.infoGame.lowerPipe.y, 'pipe');
            lowerPipe.setScale(0.5)
            lowerPipe.body.allowGravity = false;

            pipes.setVelocityX(-300);

            // Remove pipes when they're out of bounds
            pipes.getChildren().forEach(function (pipe) {
                if (pipe.getBounds().right < 0) {
                    pipe.destroy();
                }
                pipe.scored = false;
            });
        }
    }
    if (data.infoGame.isBirdMoving) {
        if (data.infoGame.IDjugador != myID) {
            bird2.setVelocityY(-350);
        }
    }
}

function recibirInfoLobby(lobby) {
    lobby.members.forEach((member) => {
        players++;
        if (member.idUser == lobby.yourId) {
            user = member.username;
            myID = lobby.yourId
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