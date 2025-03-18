const configGame = {
    multiplayer: true,
    singleplayer: true,
    max_players: 2,
};

var sendInfoGame = null;
var finalJuego = null;
var game;
var ownerDelLobby;
var user;
var faune;
var faune2;
var fauneCreated = false;
var wallsLayer;
let self = null;
var lastPosition = { x: 0, y: 0 };
var lizardLastPosition = { x: 0, y: 0 };
let direction = '';
var lizard;

function init(_sendInfoGame, _finalJuego) {
    sendInfoGame = _sendInfoGame;
    finalJuego = _finalJuego;

    var config = {
        type: Phaser.canvas,
        width: 400,
        height: 300,
        canvas: document.getElementById('canvas'),
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true,
            },
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
        scale: {
            zoom: 2,
        },
    };
    game = new Phaser.Game(config);
    return game;
}

function preload() {
    this.load.image('tiles', '../GamesFiles/Dungeon/tiles/dungeon_tiles.png');
    this.load.tilemapTiledJSON('dungeon', '../GamesFiles/Dungeon/tiles/dungeon-01.json');
    this.load.atlas('faune', '../GamesFiles/Dungeon/character/fauna.png', '../GamesFiles/Dungeon/character/fauna.json');
    this.load.atlas('lizard', '../GamesFiles/Dungeon/enemies/lizard.png', '../GamesFiles/Dungeon/enemies/lizard.json');

    this.cursors = this.input.keyboard.createCursorKeys();
}
function createAnimations() {
    this.anims.create({
        key: 'faune-idle-down',
        frames: [{ key: 'faune', frame: 'walk-down-3.png' }],
    });
    this.anims.create({
        key: 'faune-idle-up',
        frames: [{ key: 'faune', frame: 'walk-up-3.png' }]
    })

    this.anims.create({
        key: 'faune-idle-side',
        frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
    })

    this.anims.create({
        key: 'faune-run-down',
        frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
        repeat: -1,
        frameRate: 15
    })

    this.anims.create({
        key: 'faune-run-up',
        frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
        repeat: -1,
        frameRate: 15
    })

    this.anims.create({
        key: 'faune-run-side',
        frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
        repeat: -1,
        frameRate: 15
    })

    this.anims.create({
        key: 'lizard-idle',
        frames: this.anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_idle_anim_f', suffix: '.png' }),
        repeat: -1,
        frameRate: 10
    })

    this.anims.create({
        key: 'lizard-run',
        frames: this.anims.generateFrameNames('lizard', { start: 0, end: 3, prefix: 'lizard_m_run_anim_f', suffix: '.png' }),
        repeat: -1,
        frameRate: 10
    })
}

function create() {
    self = this;
    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tiles');
    map.createLayer('Ground', tileset);
    wallsLayer = map.createLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    createAnimations.call(this);

    if (ownerDelLobby) {
        faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png');
        faune.body.setSize(faune.width * 0.5, faune.height * 0.8);
        faune.anims.play('faune-idle-down');
        this.physics.add.collider(faune, wallsLayer);
        this.cameras.main.startFollow(faune, true);

        const speedEnemy = 70;

        lizard = this.physics.add.sprite(256, 128, 'lizard', 'lizard_m_idle_anim_f0.png');
        lizard.anims.play('lizard-run');
        this.physics.add.collider(lizard, wallsLayer); // Add a collider with wallsLayer
        lizard.setVelocity(Phaser.Math.Between(-speedEnemy, speedEnemy), Phaser.Math.Between(-speedEnemy, speedEnemy));

        // Set the lizard's bounce to 1 to make it bounce off the walls.
        lizard.body.setBounce(1);
    } else {
        faune2 = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png');
        faune2.body.setSize(faune2.width * 0.5, faune2.height * 0.8);
        faune2.anims.play('faune-idle-down');
        this.physics.add.collider(faune2, wallsLayer);
        this.cameras.main.startFollow(faune2, true);
    }
}

function update() {
    if (!this.cursors || (!faune && !faune2)) {
        return;
    }
    const speed = 100;
    const { left, right, up, down } = this.cursors;
    let character = ownerDelLobby ? faune : faune2;

    if (left.isDown) {
        character.anims.play('faune-run-side', true);
        character.setVelocity(-speed, 0);
        character.scaleX = -1;
        character.body.offset.x = 24;
        direction = 'left';
    } else if (right.isDown) {
        character.anims.play('faune-run-side', true);
        character.setVelocity(speed, 0);
        character.scaleX = 1;
        character.body.offset.x = 8;
        direction = 'right';
    } else if (up.isDown) {
        character.anims.play('faune-run-up', true);
        character.setVelocity(0, -speed);
        direction = 'up';
    } else if (down.isDown) {
        character.anims.play('faune-run-down', true);
        character.setVelocity(0, speed);
        direction = 'down';
    } else {
        const parts = character.anims.currentAnim.key.split('-');
        parts[1] = 'idle';
        character.play(parts.join('-'));
        character.setVelocity(0, 0);
    }

    var currentPosition = { x: character.x, y: character.y }; // Usar 'character' en lugar de 'faune'
    if (currentPosition.x !== lastPosition.x || currentPosition.y !== lastPosition.y) {
        lastPosition = currentPosition;
        var data = {
            faune: ownerDelLobby ? { x: currentPosition.x, y: currentPosition.y } : null,
            faune2: !ownerDelLobby ? { x: currentPosition.x, y: currentPosition.y } : null,
            direction: direction,
            animation: character.anims.currentAnim.key,
            scaleX: character.scaleX,
        };
        sendInfoGame(data);
    }

    if (lizard) {
        var lizardCurrentPosition = { x: lizard.x, y: lizard.y };
        if (lizardCurrentPosition.x !== lizardLastPosition.x || lizardCurrentPosition.y !== lizardLastPosition.y) {
            lizardLastPosition = lizardCurrentPosition;
            var lizardPosition = { x: lizard.x, y: lizard.y };
            sendInfoGame({ lizard: lizardPosition });
        }
    }
}

function recibirInfoFromPlatform(data) {
    if (!ownerDelLobby && data.infoGame.faune) {
        if (!faune) {
            faune = self.physics.add.sprite(data.infoGame.faune.x, data.infoGame.faune.y, 'faune', 'walk-down-3.png');
            faune.body.setSize(faune.width * 0.5, faune.height * 0.8);
            self.physics.add.collider(faune, wallsLayer);
            self.cameras.main.startFollow(faune2, true);
        } else {
            var newPosition = data.infoGame.faune;
            if (newPosition.x !== faune.x || newPosition.y !== faune.y) {
                faune.setPosition(newPosition.x, newPosition.y);
                faune.anims.play(data.infoGame.animation, true);
                faune.scaleX = data.infoGame.scaleX;
                faune.body.offset.x = data.infoGame.scaleX === -1 ? 24 : 8;
            }
        }
    }

    if (ownerDelLobby && data.infoGame.faune2) {
        if (!faune2) {
            faune2 = self.physics.add.sprite(data.infoGame.faune2.x, data.infoGame.faune2.y, 'faune', 'walk-down-3.png');
            faune2.body.setSize(faune2.width * 0.5, faune2.height * 0.8);
            self.physics.add.collider(faune2, wallsLayer);
            self.cameras.main.startFollow(faune, true);
        } else {
            var newPosition = data.infoGame.faune2;
            if (newPosition.x !== faune2.x || newPosition.y !== faune2.y) {
                faune2.setPosition(newPosition.x, newPosition.y);
                faune2.anims.play(data.infoGame.animation, true);
                faune2.scaleX = data.infoGame.scaleX;
                faune2.body.offset.x = data.infoGame.scaleX === -1 ? 24 : 8;
            }
        }
    }
    if (!ownerDelLobby && data.infoGame.lizard) {
        if (!lizard) {
            lizard = self.physics.add.sprite(data.infoGame.lizard.x, data.infoGame.lizard.y, 'lizard', 'lizard_m_idle_anim_f0.png');
        } else {
            var newPosition = data.infoGame.lizard;
            if (newPosition.x !== lizard.x || newPosition.y !== lizard.y) {
                lizard.setPosition(newPosition.x, newPosition.y);
            }
        }
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