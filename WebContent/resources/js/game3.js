var height = 600;
var width = 800;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', {
	preload : preload,
	create : create,
	update : update
});
game.state.add('Game', game);

var background;
var groundSprite;

function preload() {
	game.load.image('sky', '../resources/assets/misc/starfield.jpg');
	game.load.image('ground_invisible', '../resources/images/platforms/dak_invisible.png');
	game.load.image('ground', '../resources/images/platforms/cartoon-roof.jpg');
	game.load.image('chimney', '../resources/images/chimney.png');
	game.load.image('star', '../resources/images/present.png');
	game.load.image('obstacle', '../resources/images/snowballs/snow.png');
	game.load.spritesheet('dude', '../resources/images/santa-walking.png', 91,
			115);
}

var player;
var platforms;
var stars;
var traps;

var score = 0;
var scoreText;

var backgroundSpeed = 1;
var playerVelocity = 500;
var starSpawnRate = 1000;
var obstacleSpawnRate = 2800;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Background
	background = game.add.tileSprite(0, 0, width, height, 'sky');
	groundSprite = game.add.tileSprite(0, game.world.height - 32, width, 32, 'ground');

	// Platforms
	platforms = game.add.group();
	platforms.enableBody = true;

	ground = platforms.create(0, game.world.height - 32, 'ground_invisible');
	ground.body.immovable = true;

	// Player
	player = game.add.sprite(32, game.world.height - 300, 'dude');
	game.physics.arcade.enable(player);

	player.body.bounce.y = 0;
	player.body.gravity.y = 1500;
	player.body.collideWorldBounds = true;

	player.animations.add('right', [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 20, true);

	cursors = game.input.keyboard.createCursorKeys();

	// stars
	stars = game.add.group();
	stars.enableBody = true;

	// obstacles
	obstacles = game.add.group();
	obstacles.enableBody = true;	

	// Score
	scoreText = scoreText = game.add.text(width / 2, 16, 'score: 0', {
		fontSize : '32px',
		fill : '#ffffff'
	});
	scoreText.anchor.setTo(0.5, 0.5);
	
	starSpawnLoop();
	obstacleSpawnLoop();

}

function starSpawnLoop() {
	setTimeout(function() {
		spawnStar();
		starSpawnLoop();
	}, starSpawnRate);
}

function spawnStar() {
	var star = stars.create(800, (Math.random() * (100)) + 380, 'star');
	star.body.velocity.x = -playerVelocity;
}

function obstacleSpawnLoop() {
	setTimeout(function() {
		spawnobstacle();
		obstacleSpawnLoop();
	}, (Math.random() * (1000)) + obstacleSpawnRate - 1000);
}

function spawnobstacle() {
	
	if(Math.random() * (4) > 3) {
		var obstacle = obstacles.create(800, 468, 'chimney');
		obstacle.body.velocity.x = -playerVelocity;
	} else {
		var obstacle = obstacles.create(800, (Math.random() * (100)) + 378, 'obstacle');
		obstacle.body.velocity.x = -playerVelocity;
	}
	
}

function update() {
	var hitPlatform = game.physics.arcade.collide(player, platforms);

	game.physics.arcade.collide(stars, platforms);
	background.tilePosition.x -= backgroundSpeed;
	groundSprite.tilePosition.x -= backgroundSpeed + 2;
	
	
	// Allow the player to jump if they are touching the ground.
	if (game.input.activePointer.isDown && player.body.touching.down && hitPlatform) {
	//if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.animations.stop();
        player.frame = 0;
		player.body.velocity.y = -750;
	} else if(player.body.touching.down && hitPlatform) {
		player.animations.play('right');
	}

	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, obstacles, playerDies, null, this);

	var tobeDestroyed = [];
	for (var i = 0; i < stars.children.length; i++) {
		var star = stars.children[i];
		if (star.body.x < -50) {
			tobeDestroyed.push(star);
		}
	}
	for (var i = 0; i < obstacles.children.length; i++) {
		var obstacle = obstacles.children[i];
		if (obstacle.body.x < -50) {
			tobeDestroyed.push(obstacle);
		}
	}

	var toDestroy;
	while ((toDestroy = tobeDestroyed.pop()) != undefined) {
		toDestroy.destroy();
	}
}

function collectStar(player, star) {

	// Removes the star from the screen
	star.kill();
	score += 10;
	scoreText.text = 'Score: ' + score;

	switch (score) {
	case 50:
		playerVelocity = 650;
		starSpawnRate = 1000;
		obstacleSpawnRate = 2300;
		backgroundSpeed = 2;
		break;
	case 100:
		playerVelocity = 800;
		starSpawnRate = 1000;
		obstacleSpawnRate = 1800;
		backgroundSpeed = 3;
		break;
	case 150:
		window.location = "./message"
		break;
	}
}

function reset() {

	playerVelocity = 500;
	starSpawnRate = 1000;
	obstacleSpawnRate = 2000;

	var tobeDestroyed = [];
	for (var i = 0; i < stars.children.length; i++) {
		var star = stars.children[i];
		tobeDestroyed.push(star);
	}
	for (var i = 0; i < obstacles.children.length; i++) {
		var obstacle = obstacles.children[i];
		tobeDestroyed.push(obstacle);
	}

	var toDestroy;
	while ((toDestroy = tobeDestroyed.pop()) != undefined) {
		toDestroy.destroy();
	}

	player.body.x = 32;
	player.body.y = game.world.height - 300;
	player.body.velocity.y = 0;
	score = 0;
	scoreText.text = 'Score: ' + score;
}

function playerDies(player, trap) {
	reset();
}