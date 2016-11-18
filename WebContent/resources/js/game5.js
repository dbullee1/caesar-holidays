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
	game.load.image('starfield', '../resources/assets/misc/starfield.jpg');

	game.load.image('projectile', '../resources/images/xmas-harpoon.png')
	game.load.spritesheet('santa', '../resources/images/santa.png', 91, 118);

	game.load.image('ground_invisible', '../resources/images/platforms/dak_invisible.png');
	game.load.image('roof', '../resources/images/platforms/cartoon-roof.jpg');
	game.load.image('roof-ice', '../resources/images/platforms/roof-ice.png');
	game.load.image('normal', '../resources/images/platforms/cartoon-roof.jpg');
	game.load.image('ice', '../resources/images/platforms/roof-ice.png');
	game.load.image('mud', '../resources/images/platforms/cartoon-roof.jpg');

	game.load.image('snowball_16', '../resources/images/snowballs/snowball_16.png');
	game.load.image('snowball_32', '../resources/images/snowballs/snowball_32.png');
	game.load.image('snowball_48', '../resources/images/snowballs/snowball_48.png');
}

var player;
var playerDying;
var playerOnIce;

var numOfProjectiles = 1;
var projectilesInUse = 0;
var projectiles;

var cachedLevel;
var levelUrl = '../resources/levels/level';
var levelExtension = '.json'
var level = 2;
var finalLevel = 3;

var platforms = {};
platforms.children = [];
var icePlatforms = {};
platforms.children = [];

var bounds;
var floor;

var balls;

var score = 0;
var scoreText;

var playerVelocity = 500;
var projectileStartLocationY;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	projectileStartLocationY = game.world.height - 100

	groundSprite = game.add.tileSprite(0, game.world.height - 32, width, 32, 'roof');

	// Platforms
	platforms = game.add.group();
	platforms.enableBody = true;
	
	icePlatforms = game.add.group();
	icePlatforms.enableBody = true;

	bounds = game.add.group();
	bounds.enableBody = true;

	var top = bounds.create(0, -32, 'ground_invisible');
	top.body.immovable = true;

	cursors = game.input.keyboard.createCursorKeys();

	// Balls
	balls = game.add.group();
	balls.enableBody = true;

	// Score
	scoreText = scoreText = game.add.text(10, 10, 'level: ' + level + '/4', {
		fontSize : '32px',
		fill : '#ffffff'
	});

	// projectiles
	projectiles = game.add.group();
	projectiles.enableBody = true;

	loadLevel(getLevel(level));
}

function useProjectile() {
	if (projectilesInUse < numOfProjectiles) {
		let
		startLocationX = player.body.x + (player.width / 4);
		var projectile = projectiles.create(startLocationX, projectileStartLocationY, 'projectile');
		projectilesInUse++;
		game.world.bringToTop(groundSprite);
	}
}

function update() {
	// Collisions
	if (!playerDying) {
		game.physics.arcade.collide(player, platforms);
		playerOnIce = game.physics.arcade.collide(player, icePlatforms);
		game.physics.arcade.overlap(player, balls, playerHit, null, this);
		handlePlayerMovement();

		game.physics.arcade.collide(projectiles, platforms);
		game.physics.arcade.overlap(projectiles, bounds, destroyProjectile, null, this);
		game.physics.arcade.overlap(projectiles, balls, projectileBallCollision, null, this);

		handleBallPhysics();

		// Projectile
		for (var i = 0; i < projectiles.children.length; i++) {
			var projectile = projectiles.children[i];
			projectile.body.y -= 7.35;
		}
	}
}

function destroyProjectile(projectile) {
	projectile.destroy();
	projectilesInUse--;
}

function projectileBallCollision(projectile, ball) {
	// TODO play destroy snowball sound

	destroyProjectile(projectile);

	if (ball.key === 'snowball_48') {
		splitBall(ball, 2);
	} else if (ball.key === 'snowball_32') {
		splitBall(ball, 1);
	}
	ball.destroy();

	if (balls.children.length === 0) {
		if (level === 3) {
			window.location = "./message";
		} else {
			level++;
			loadLevel(getLevel(level));
		}
	}
}

function splitBall(original, newBallSize) {
	let
	velocityX = original.body.velocity.x;
	let
	velocityY = original.body.velocity.y;
	balls.add(new Ball(newBallSize, velocityX, velocityY, original.body.x, original.body.y));
	balls.add(new Ball(newBallSize, -velocityX, velocityY, original.body.x, original.body.y));
}

function playerHit(player, ball) {
	// TODO play death sound

	playerDying = true;
	player.body.collideWorldBounds = false;
	player.body.velocity.y = -400;
	player.animations.stop();
	player.frame = 32;

	for (var i = 0; i < balls.children.length; i++) {
		var ball = balls.children[i];
		ball.body.velocity.setTo(0, 0);
		ball.body.gravity = 0;
	}
}

function reset() {
	loadLevel(cachedLevel);
}

function handleBallPhysics() {
	if (game.physics.arcade.collide(balls, floor)) {
		for (var i = 0; i < balls.children.length; i++) {
			var ball = balls.children[i];
			if (ball.body.touching.down) {
				ball.body.velocity.y = -900;
			}
		}
	}
	game.physics.arcade.collide(balls, platforms);
	game.physics.arcade.collide(balls, icePlatforms);
}

function handlePlayerMovement() {
	if (!!player) {
		if(playerOnIce){
			let slideDecrease = 4;
			if(player.body.velocity.x < 0){
				player.body.velocity.x += slideDecrease;
			} else if(player.body.velocity.x > 0){
				player.body.velocity.x -= slideDecrease;
			}
		} else{
			player.body.velocity.x = 0;
		}
		
		if (game.input.activePointer.isDown && player.body.touching.down) {
			useProjectile();
		}

		if (cursors.left.isDown) {
			player.body.velocity.x = -250;
			player.animations.play('left');
		} else if (cursors.right.isDown) {
			player.body.velocity.x = 250;
			player.animations.play('right');
		} else {
			player.animations.stop();
			player.frame = 32;
		}
	}
}

function getLevel(levelName) {
	let
	levelObject;
	let
	jqXHR = $.ajax({
		dataType : "json",
		async : false,
		url : (levelUrl + levelName + levelExtension),
		beforeSend : function(xhr) {
			xhr.overrideMimeType("text/plain; charset=x-user-defined");
		}
	}).done(function(data) {
		levelObject = data;
	});
	return levelObject;
}

function loadLevel(levelObject) {
	let
	levelBalls = levelObject.balls;
	let
	levelPlatforms = levelObject.platforms;
	let
	playerPosition = levelObject.player.position;
	let
	backgroundName = levelObject.background;

	// destroy background and create new background
	createBackground(backgroundName);

	// destroy current balls and create new balls
	createBalls(levelBalls);

	// destroy player and create new player object
	createPlayer(playerPosition);

	// caches the level
	cachedLevel = levelObject

	// createPlatforms
	createPlatform(levelPlatforms);

	// destroy projectiles
	numOfProjectiles = 1;
	projectilesInUse = 0;
	let
	i = projectiles.children.length;
	while (i--) {
		projectiles.children[i].destroy();
	}
}

function createPlayer(playerPosition) {
	if (!!player) {
		player.destroy();
	}
	player = game.add.sprite(playerPosition.x, playerPosition.y, 'santa');
	playerDying = false;
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0;
	player.body.gravity.y = 1500;
	player.body.collideWorldBounds = true;
	player.animations.add('right', [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], 20, true);
	player.animations.add('left', [ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ], 20, true);
	player.checkWorldBounds = true;
	player.events.onOutOfBounds.add(function() {
		setTimeout(reset, 1000);
	}, this);
}

function createBalls(levelBalls) {
	let
	i = balls.children.length;
	while (i--) {
		balls.children[i].destroy();
	}

	for (i = 0; i < levelBalls.length; i++) {
		let
		ball = levelBalls[i];
		balls.add(new Ball(ball.size, ball.velocity));
	}
}

function createPlatform(levelPlatforms) {
	if (!!groundSprite) {
		groundSprite.destroy();
	}
	if (!!floor) {
		floor.destroy();
	}

	let
	i = platforms.children.length;
	while (i--) {
		platforms.children[i].destroy();
	}

	for (i = 0; i < levelPlatforms.length; i++) {
		let platform = levelPlatforms[i];
		let platformObject = new Platform(platform.type, platform.position.x, platform.position.y, platform.width, platform.height);
		if(platform.type === 'ice'){
			icePlatforms.add(platformObject);
		} else{
			platforms.add(platformObject);
		}
	}

	// fallback
	if (platforms.children.length == 0) {
		groundSprite = game.add.tileSprite(0, game.world.height - 32, width, 32, 'roof');
		floor = platforms.create(0, game.world.height - 32, 'ground_invisible');
		floor.body.immovable = true;
	}
}

function createBackground(backgroundName) {
	if (!!background) {
		background.destroy();
	}
	background = game.add.tileSprite(0, 0, width, height, backgroundName);
	game.world.sendToBack(background);
}
