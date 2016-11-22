var height = 600;
var width = 800;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', {
	preload : preload,
	create : create,
	update : update
});
game.state.add('Game', game);

// Sounds
var snowballSplitSound;
var harpoonHitRoofSound;
var harpoonLaunchSound;
var backgroundMusic;

var spaceBar;

// Level
var background;

var cachedLevel;
var levelUrl = '../resources/levels/level';
var levelExtension = '.json'
var level = 1;
var finalLevel = 3;

var player;

// Platforms
var bounds;
var deathPit;

var platforms = {};
platforms.children = [];
var icePlatforms = {};
platforms.children = [];

// Moving entities
var numOfProjectiles = 1;
var projectilesInUse = 0;
var projectiles;
var projectileStartLocationY;

var balls;

// UI
var levelProgressText;

var splashScreen;
var splashScreenVisible = false;

function preload() {
	// Audio
	game.load.audio('bgmusic', '../resources/sounds/bgmusic.mp3');
	game.load.audio('auw', '../resources/sounds/auw.mp3');
	game.load.audio('snowball_split', '../resources/sounds/snowball_split.mp3')
	game.load.audio('harpoon_roof', '../resources/sounds/harpoon_roof.mp3')
	game.load.audio('harpoon_launch', '../resources/sounds/harpoon_launch.mp3')

	// Sprites
	game.load.image('starfield', '../resources/assets/misc/starfield.jpg');

	game.load.image('projectile', '../resources/images/xmas-harpoon.png')
	if (theme == "EXPERTS") {
		game.load.spritesheet('santa', '../resources/images/santa - experts.png', 91, 118);
	} else if (theme == "TENDERS") {
		game.load.spritesheet('santa', '../resources/images/santa - tenders.png', 91, 118);
	} else {
		game.load.spritesheet('santa', '../resources/images/santa.png', 91, 118);
	}

	game.load.spritesheet('snowflakes', '../resources/images/snowflakes.png', 17, 17);

	game.load.image('ground_invisible', '../resources/images/platforms/dak_invisible.png');
	game.load.image('roof', '../resources/images/platforms/cartoon-roof.jpg');
	game.load.image('ice', '../resources/images/platforms/roof-ice.png');

	game.load.image('splash1', '../resources/images/splash1.png')
	game.load.image('splash2', '../resources/images/splash2.png')
	game.load.image('splash3', '../resources/images/splash3.png')

	game.load.image('snowball_16', '../resources/images/snowballs/snowball_16.png');
	game.load.image('snowball_32', '../resources/images/snowballs/snowball_32.png');
	game.load.image('snowball_48', '../resources/images/snowballs/snowball_48.png');
}

function create() {
	// Game
	game.physics.startSystem(Phaser.Physics.ARCADE);
	new SnowEmitter();

	// Audio
	backgroundMusic = game.add.audio('bgmusic');
	backgroundMusic.onStop.add(startBackgroundMusic, this);

	snowballSplitSound = game.add.audio('snowball_split');
	harpoonHitRoofSound = game.add.audio('harpoon_roof');
	harpoonLaunchSound = game.add.audio('harpoon_launch');

	// Groups
	platforms = game.add.group();
	platforms.enableBody = true;

	icePlatforms = game.add.group();
	icePlatforms.enableBody = true;

	bounds = game.add.group();
	bounds.enableBody = true;

	deathPit = game.add.group();
	deathPit.enableBody = true;

	projectiles = game.add.group();
	projectiles.enableBody = true;

	balls = game.add.group();
	balls.enableBody = true;

	// Sprites
	var top = bounds.create(0, -32, 'ground_invisible');
	top.body.immovable = true;
	var bottom = deathPit.create(0, 599, 'ground_invisible');
	bottom.body.immovable = true;

	// Properties
	projectileStartLocationY = game.world.height - 100
	cursors = game.input.keyboard.createCursorKeys();

	// Audio
	startBackgroundMusic();

	// UI
	levelProgressText = game.add.text(10, 10, 'level: ' + level + '/' + finalLevel, {
		fontSize : '32px',
		fill : '#ffffff'
	});
	createSplashScreen(getLevel(level));
}

function update() {
	// Collisions
	if (!!player && !player.isDying()) {
		player.handleCollisions();		
		player.handleMovement();
		handleBallCollisions();
		handleProjectileCollisions();
	}

	updateSnowEmitter();
}

/**
 * Projectile methods
 */

function handleProjectileCollisions() {
	game.physics.arcade.collide(projectiles, platforms);
	game.physics.arcade.overlap(projectiles, bounds, projectileHitBounds, null, this);
	game.physics.arcade.overlap(projectiles, balls, projectileBallCollision, null, this);

	for (var i = 0; i < projectiles.children.length; i++) {
		var projectile = projectiles.children[i];
		projectile.body.y -= 7.35;
	}
}

function projectileHitBounds(projectile) {
	harpoonHitRoofSound.play();
	destroyProjectile(projectile);
}

function projectileBallCollision(projectile, ball) {
	snowballSplitSound.play();
	destroyProjectile(projectile);

	if (ball.key === 'snowball_48') {
		splitBall(ball, 2);
	} else if (ball.key === 'snowball_32') {
		splitBall(ball, 1);
	}
	ball.destroy();

	if (balls.children.length === 0) {
		if (level === finalLevel) {
			window.location = "./message";
		} else {
			level++;
			createSplashScreen(getLevel(level));
		}
	}
}

function destroyProjectile(projectile) {
	projectile.destroy();
	projectilesInUse--;
}

/**
 * Level/UI methods
 */

function reset() {
	createSplashScreen(cachedLevel);
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
	levelProgressText.setText('level: ' + level + '/' + finalLevel);
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

	// caches the level
	cachedLevel = levelObject

	// createPlatforms
	createPlatform(levelPlatforms);

	// destroy player and create new player object
	if(!!player) {
		player.destroy();
	}
	player = new Player(playerPosition.x, playerPosition.y);

	// destroy projectiles
	numOfProjectiles = 1;
	projectilesInUse = 0;
	let
	i = projectiles.children.length;
	while (i--) {
		projectiles.children[i].destroy();
	}
}

function createSplashScreen(levelObject) {
	// create splashscreen
	splashScreen = game.add.button(0, 0, 'splash' + level, function() {
		splashClicked(levelObject)
	}, this);
	splashScreenVisible = true;
}

function splashClicked(levelToLoad) {
	splashScreen.destroy();
	splashScreenVisible = false;
	loadLevel(levelToLoad);
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
	clearGroup(platforms);
	clearGroup(icePlatforms);

	for (i = 0; i < levelPlatforms.length; i++) {
		let
		platform = levelPlatforms[i];
		let
		platformObject = new Platform(platform.type, platform.position.x, platform.position.y, platform.width, platform.height);
		if (platform.type === 'ice') {
			icePlatforms.add(platformObject);
		} else {
			platforms.add(platformObject);
		}
	}
}

function clearGroup(group) {
	let
	i = group.children.length;
	while (i--) {
		group.children[i].destroy();
	}
}

/**
 * Audio methods
 */

function createBackground(backgroundName) {
	if (!!background) {
		background.destroy();
	}
	background = game.add.tileSprite(0, 0, width, height, backgroundName);
	game.world.sendToBack(background);
}

function startBackgroundMusic() {
	backgroundMusic.play();
}
