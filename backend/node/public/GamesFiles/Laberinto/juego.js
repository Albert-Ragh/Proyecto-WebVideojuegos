const width = 10;
const height = 10;
const maze = [];
let self = null;
const monsters = [];
let crown;


function init(_sendInfoGame, _finalJuego) {

    //traspasamos la funciones recibidas a variables globales
    sendInfoGame = _sendInfoGame;
    finalJuego = _finalJuego;


    var config = {
        type: Phaser.canvas,
        width: 800,
        height: 600,
        canvas: document.getElementById('canvas'),
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false,
                depth: 1
            }
        },
        scene: {
            preload: preload,
            create: create,
        }
    };

    var game = new Phaser.Game(config);
    return game;
}

// Función preload
function preload() {
    this.load.image('player', '../GamesFiles/Laberinto/images/jugadorCaballero.png');
    this.load.image('monster', './images/troll.png');
    this.load.image('crown', './images/crown.png');
}

// Función create
function create() {
    self = this;
    generateMaze();
    generateMonsters(this);
    createCrown.call(this);

    // Crear jugadores
    const player1 = new Player(this, 64, 64);
    const player2 = new Player(this, (width - 1) * 64, (height - 1) * 64);

    // Configurar colisiones
    this.physics.add.collider(player1, player2);
    this.physics.add.collider(player1, monsters, handlePlayerMonsterCollision, null, this);
    this.physics.add.collider(player2, monsters, handlePlayerMonsterCollision, null, this);
    this.physics.add.overlap(player1, crown, handlePlayerCrownCollision, null, this);
    this.physics.add.overlap(player2, crown, handlePlayerCrownCollision, null, this);

    // Configurar controles del jugador
    this.input.keyboard.on('keydown-SPACE', () => {
        player1.attack();
    });
    this.input.keyboard.on('keydown-ENTER', () => {
        player2.attack();
    });

    // Crear animaciones
    createPlayerAnimations.call(this);
    createMonsterAnimations.call(this);
}

// Funciones de colisiones
function handlePlayerMonsterCollision(player, monster) {
    if (player.health > 0) {
        player.health -= 5;
        if (player.health <= 0) {
            player.disableBody(true, true);
            // Lógica para el jugador que muere sin la corona
        }
    }
    monster.destroy();
}

function handlePlayerCrownCollision(player, crown) {
    if (!player.hasCrown) {
        player.hasCrown = true;
        player.health += 50;
        crown.disableBody(true, true);
        // Lógica para el jugador que recoge la corona
    }
}


// Clase del jugador
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.health = 100;
    }

    attack() {
        // Lógica de ataque
    }
}

// Clase del monstruo
class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'monster');
        this.scene.add.existing(this);
        self.scene.physics.add.existing(self);
        self.setCollideWorldBounds(true);
        self.setBounce(1, 1);
        self.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        self.health = 10;
    }

    attack(player) {
        // Lógica de ataque al jugador
    }
}

// Clase de la corona
class Crown extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'crown');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}

// --- MAPA ---


function generateMaze() {
    for (let y = 0; y < height; y++) {
        maze[y] = [];
        for (let x = 0; x < width; x++) {
            maze[y][x] = { visited: false, wall: true };
        }
    }

    const stack = [];
    let current = { x: 0, y: 0 };

    maze[current.y][current.x].visited = true;

    while (true) {
        const neighbors = getUnvisitedNeighbors(current.x, current.y);

        if (neighbors.length > 0) {
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(current);

            removeWall(current, randomNeighbor);

            current = randomNeighbor;
            maze[current.y][current.x].visited = true;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break;
        }
    }
}

function getUnvisitedNeighbors(x, y) {
    const neighbors = [];

    if (x > 1 && !maze[y][x - 2].visited) {
        neighbors.push({ x: x - 2, y });
    }
    if (x < width - 2 && !maze[y][x + 2].visited) {
        neighbors.push({ x: x + 2, y });
    }
    if (y > 1 && !maze[y - 2][x].visited) {
        neighbors.push({ x, y: y - 2 });
    }
    if (y < height - 2 && !maze[y + 2][x].visited) {
        neighbors.push({ x, y: y + 2 });
    }

    return neighbors;
}

function removeWall(current, neighbor) {
    const dx = neighbor.x - current.x;
    const dy = neighbor.y - current.y;

    maze[current.y + dy / 2][current.x + dx / 2].wall = false;
}
// --- MAPA ---




// Creación de la corona en el centro del laberinto
function createCrown() {
    const centerX = Math.floor(width / 2) * 64 + 32;
    const centerY = Math.floor(height / 2) * 64 + 32;
    crown = new Crown(this, centerX, centerY);
}



// Animación de levantamiento de espada para el jugador
function createPlayerAnimations() {
    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });
}

// Animación de movimiento para los monstruos
function createMonsterAnimations() {
    this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('monster', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
}

// Generación de monstruos en el laberinto
function generateMonsters(context) {
    const numMonsters = 5; // Número de monstruos a generar
    let depth = 1; // Profundidad inicial de los monstruos

    for (let i = 0; i < numMonsters; i++) {
        let x, y;

        do {
            x = Phaser.Math.Between(0, width - 1);
            y = Phaser.Math.Between(0, height - 1);
        } while (!isCellEmpty(context, x, y));

        const monster = context.add.sprite(x * 64 + 32, y * 64 + 32, 'monster');
        monster.setDepth(depth); // Establecer la profundidad del monstruo
        monsters.push(monster);

        depth++; // Incrementar la profundidad para el siguiente monstruo
    }
}


// Verifica si una celda está vacía
function isCellEmpty(monsters, x, y) {
    for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        const rectA = new Phaser.Geom.Rectangle(x * 64, y * 64, 64, 64);
        const rectB = new Phaser.Geom.Rectangle(monster.x - monster.width / 2, monster.y - monster.height / 2, monster.width, monster.height);

        if (Phaser.Geom.Intersects.RectangleToRectangle(rectA, rectB)) {
            return false;
        }
    }

    return true;
}


// Verifica si hay superposición de objetos en una celda
function checkOverlap(context, x, y) {
    const overlappingObjects = self.physics.overlapRect(x * 64, y * 64, 64, 64);

    return overlappingObjects.length > 0;
}

function recibirInfoFromPlatform() {

}

function recibirInfoLobby() {

}


function executeGame() {
    var obj = [];

    obj.init = init;
    obj.recibirInfoFromPlatform = recibirInfoFromPlatform;
    obj.recibirInfoLobby = recibirInfoLobby;
    return obj;
}

executeGame();

