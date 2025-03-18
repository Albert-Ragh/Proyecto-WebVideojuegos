const configGame = {
  multiplayer: true,
  singleplayer: true,
  max_players: 4,
}

let teams = [];
let playersArray = [];
let playersActors = [];
let otherPlayers = [];
let jugadores;
let yourId = 0;
let team = 'blue';
let ownerDelLobby;
let self = null;
var scores = {
  blue: 0,
  red: 0
};
let canvasWidth = 800;
let canvasHeight = 600;

let textWin;
let button;

let gameEnded = false;

var game;

function init(_sendInfoGame, _finalJuego) {

  //traspasamos la funciones recibidas a variables globales
  sendInfoGame = _sendInfoGame;
  finalJuego = _finalJuego;


  var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    canvas: document.getElementById('canvas'),
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
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


function preload() {
  this.load.image('blue_ship_1', './fitxers/GamesFiles/Starfinder/images/spaceShips_blue.png');
  this.load.image('red_ship_1', './fitxers/GamesFiles/Starfinder/images/spaceShips_red.png');
  this.load.image('blue_ship_2', './fitxers/GamesFiles/Starfinder/images/enemy_blue.png');
  this.load.image('red_ship_2', './fitxers/GamesFiles/Starfinder/images/enemy_red.png');
  this.load.image('star', './fitxers/GamesFiles/Starfinder/images/star_gold.png');
  this.load.image('background', './fitxers/GamesFiles/Starfinder/images/spaceBackground.png');


}

function create() {
  self = this;

  otherPlayers = this.physics.add.group();
  playersActors = this.physics.add.group();



  //this.otherPlayers = this.physics.add.group();

  addPlayers(this);
  this.cursors = this.input.keyboard.createCursorKeys();

  this.blueScoreText = this.add.text(16, 16, 'Blue: ' + scores.blue, { fontSize: '32px', fill: '#0000FF' });
  this.redScoreText = this.add.text(584, 16, 'Red: ' + scores.red, { fontSize: '32px', fill: '#FF0000' });

  //     if (self.star) self.star.destroy();
  //     self.star = self.physics.add.image(star.x, star.y, 'star');
  //     self.physics.add.overlap(self.ship, self.star, function () {
  //     }, null, self);


  if (ownerDelLobby) {
    newStar(self);
  }
  else {
    console.log("ownerdellobby", ownerDelLobby);
  }
}

function update() {
  if (this.ship) {
    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-150);
    } else if (this.cursors.right.isDown) {
      this.ship.setAngularVelocity(150);
    } else {
      this.ship.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
    } else {
      this.ship.setAcceleration(0);
    }

    this.physics.world.wrap(this.ship, 5);

    // emit player movement
    var x = this.ship.x;
    var y = this.ship.y;
    var r = this.ship.rotation;
    if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
      //this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
      sendInfoGame({ action: "shipMovement", id: yourId, posX: this.ship.x, posY: this.ship.y, rotation: this.ship.rotation })
    }
    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    };
  }

}

function recibirInfoFromPlatform(data) {
  //console.log("data", data);
  if (data.infoGame.action == "shipMovement") {
    //console.log("Ship hace la movicion");
    playerMoved(data);
  }
  else if (data.infoGame.action == "new_game") {
    gameEnded = false;
    textWin.destroy();

    playersArray.forEach((player) => {
      
      if (player.self == true) {
        self.ship.setPosition(player.posX, player.posY);
        self.ship.setRotation(0, 0);
      }

    })

  }
  else if (data.infoGame.action == "self_ship_movement") {
    if (data.infoGame.id === self.ship.playerId) {
      self.ship.setRotation(data.infoGame.rotation);
      self.ship.setPosition(data.infoGame.posX, data.infoGame.posY);
    }
  }
  else if (data.infoGame.action == 'starLocation' && !ownerDelLobby) {

    //console.log("Location star", data);
    if (self.star) {
      self.star.destroy();
    }
    self.star = self.physics.add.image(data.infoGame.posX, data.infoGame.posY, 'star');
    self.physics.add.overlap(self.ship, self.star, function () {
      //this.socket.emit('starCollected');
      self.star.destroy();
      sendInfoGame({ action: "starCollectedByUser" });
      playersArray.forEach((player) => {
        console.log("PlayerPlayerPlayer", player);
        if (player.id == yourId) {
          console.log("PlayerTeam", player);
          sendInfoGame({ action: "update_score", team: player.team })
        }
      });
      //sendInfoGame({ action: "update_score", team: self.ship })

    }, null, self);
  }

  else if (data.infoGame.action == 'starCollectedByUser' && ownerDelLobby) {
    if (self.star) {
      self.star.destroy();
    }
    if (!gameEnded) {
      newStar(self);
    }
  }
  else if (data.infoGame.action == 'update_score') {
    //console.log("AAAAAAAA", data);
    if (data.infoGame.team === 'red') {
      scores.red += 10;
    } else {
      scores.blue += 10;
    }
    self.blueScoreText.setText('Blue: ' + scores.blue);
    self.redScoreText.setText('Red: ' + scores.red);

    if (scores.blue == 20) {

      gameEnded = true;


      if (ownerDelLobby) {

        button = self.add.rectangle(400, 300, 200, 80, 0xff0000);
        button.setInteractive();
        button.on('pointerdown', startNewGame);
      }

      textWin = self.add.text(300, 200, 'Blue wins ', { fontSize: '32px', fill: '#FFFFFF' });


      playersArray.forEach(player => {
        if (player.id == yourId) {
          if (player.team == 'blue') {
            finalJuego(25);
          }
          else {
            finalJuego(10);
          }
        }
      });
    }

    if (scores.red == 20) {

      gameEnded = true;

      if (ownerDelLobby) {
        button = self.add.rectangle(300, 200, 200, 80, 0xff0000);
        button.setInteractive();
        button.on('pointerdown', startNewGame);
      }

      textWin = self.add.text(584, 16, 'Red wins ', { fontSize: '32px', fill: '#FFFFFF'});

      playersArray.forEach(player => {
        if (player.id == yourId) {
          if (player.team == 'red') {
            finalJuego(25);
          }
          else {

            finalJuego(10);
          }
        }
      });
    }

  }

  else if (data.infoGame.action == 'reset_score') {
    scores.red = 0;
    scores.blue = 0;

    self.blueScoreText.setText('Blue: ' + scores.blue);
    self.redScoreText.setText('Red: ' + scores.red);
  }
}

function newStar(self) {
  var star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
  };

  if (!gameEnded) {

    if (self.star) self.star.destroy();
    self.star = self.physics.add.image(star.x, star.y, 'star');
    sendInfoGame({ action: "starLocation", star_object: self.star, posX: star.x, posY: star.y })

    self.physics.add.overlap(self.ship, self.star, function () {

      self.star.destroy();
      playersArray.forEach((player) => {
        console.log("PlayerPlayerPlayer", player);
        if (player.id == yourId) {
          console.log("PlayerTeam", player);
          sendInfoGame({ action: "update_score", team: player.team })
        }
      });

      newStar(self);
    }, null, self);

  }
}

function recibirInfoLobby(lobby) {
  console.log("aux", lobby);
  let distanceFromCorner = 50;
  teams = [
    {
      color: "blue",
      sprite: "blue_ship_1",
      x: 100 + distanceFromCorner,
      y: 100 + distanceFromCorner,
    },
    {
      color: "red",
      sprite: "red_ship_1",
      x: canvasWidth - 100 - distanceFromCorner,
      y: 100 + distanceFromCorner

    },
    {
      color: "blue",
      sprite: "blue_ship_2",
      x: canvasWidth - 100 - distanceFromCorner,
      y: canvasHeight - 100 - distanceFromCorner
    },
    {
      color: "red",
      sprite: "red_ship_2",
      x: 100 + distanceFromCorner,
      y: canvasHeight - 100 - distanceFromCorner
    },
  ]


  let aux = 0;
  lobby.members.forEach((member) => {
    user = member.username;
    //console.log("MEENEBEEH", member);
    if (lobby.ownerId == lobby.yourId) {
      ownerDelLobby = true;
    } else {
      ownerDelLobby = false;
    }
    let newX = Math.floor(Math.random() * 700) + 50;
    let newY = Math.floor(Math.random() * 700) + 50;
    //console.log("newX", newX, "newY", newY);

    let player = {
      id: member.idUser,
      nombre: member.username,
      posX: teams[aux].x,
      posY: teams[aux].y,
      self: false,
      team: teams[aux].color,
      sprite: teams[aux].sprite
    }

    if (lobby.yourId == member.idUser) {
      player.self = true;
      yourId = lobby.yourId;
    }

    playersArray.push(player);

    aux++;
  });
}

function addPlayers(self) {

  playersArray.forEach((player) => {
    console.log("Player", player);


    if (player.self == true) {
      self.ship = self.physics.add.image(player.posX, player.posY, player.sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);
      self.ship.setDrag(100);
      self.ship.setAngularDrag(100);
      self.ship.setMaxVelocity(200);
      self.ship.playerId = player.id
    }
    else {
      let other = self.physics.add.image(player.posX, player.posY, player.sprite).setOrigin(0.5, 0.5).setDisplaySize(53, 40);

      other.playerId = player.id;
      otherPlayers.add(other);


    }

  })
}

function playerMoved(data) {
  // if (data.infoGame.id === self.ship.playerId){
  //   self.ship.setRotation(data.infoGame.rotation);
  //   self.ship.setPosition(data.infoGame.posX, data.infoGame.posY);
  // }

  otherPlayers.getChildren().forEach(function (otherPlayer) {
    if (data.infoGame.id === otherPlayer.playerId) {
      otherPlayer.setRotation(data.infoGame.rotation);
      otherPlayer.setPosition(data.infoGame.posX, data.infoGame.posY);
    }
  });
}

function userLeft(user) {
  console.log("User left (juego.js)", user);
}

function destroyGame() {
  if (game != null || game != undefined) {
    game.destroy(true, false);
  }
}

function startNewGame() {

  sendInfoGame({ action: "new_game" })

  if (ownerDelLobby) {
    button.destroy();
  }
  textWin.destroy();

  sendInfoGame({ action: "reset_score" })


  playersArray.forEach((player) => {
    console.log("PLAyer", player);
    console.log("Self ship", self.ship);
    console.log("others ship", otherPlayers);

    // if (player.self == true) {
    //   self.ship.setPosition(player.posX, player.posY);
    //   self.ship.setRotation(0, 0);
    //   //sendInfoGame({ action: "self_ship_movement", id: self.ship.playerId, posX: self.ship.x, posY: self.ship.y, rotation: self.ship.rotation })

    // }

    otherPlayers.getChildren().forEach(function (other) {
      if (player.id === other.playerId) {
        other.setPosition(player.posX, player.posY);
        other.setRotation(0, 0);
        sendInfoGame({ action: "shipMovement", id: other.playerId, posX: other.x, posY: other.y, rotation: other.rotation })
      }
    });

  })
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