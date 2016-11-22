var height = 600;
var width = 800;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', {
	preload : preload,
	create : create,
	update : update
});
game.state.add('Game', game);

var playerHitSound;
var snowballSplitSound;
var harpoonHitRoofSound;
var harpoonLaunchSound;
var backgroundMusic;

var background;
var groundSprite;

var maxSnow = 0;
var snowEmitter;
var updateSnowInterval = 4 * 60;
var snowInterval = 0;

var spaceBar;

var player;
var playerDying;
var playerOnIce;

var numOfProjectiles = 1;
var projectilesInUse = 0;
var projectiles;

var cachedLevel;
var levelUrl = '../resources/levels/level';
var levelExtension = '.json'
var level = 1;
var finalLevel = 3;

var platforms = {};
platforms.children = [];
var icePlatforms = {};
platforms.children = [];

var bounds;
var deathPit;
var floor;

var balls;

var levelProgressText;

var playerVelocity = 500;
var projectileStartLocationY;
var splashScreen;
var splashScreenVisible = false;

function preload() {

	// audio
	game.load.audio('bgmusic', '../resources/sounds/bgmusic.mp3');
	game.load.audio('auw', '../resources/sounds/auw.mp3');
	game.load.audio('snowball_split', '../resources/sounds/snowball_split.mp3')
	game.load.audio('harpoon_roof', '../resources/sounds/harpoon_roof.mp3')
	game.load.audio('harpoon_launch', '../resources/sounds/harpoon_launch.mp3')

	// sprites
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
	game.load.image('roof-ice', '../resources/images/platforms/roof-ice.png');
	game.load.image('normal', '../resources/images/platforms/cartoon-roof.jpg');
	game.load.image('ice', '../resources/images/platforms/roof-ice.png');
	game.load.image('mud', '../resources/images/platforms/cartoon-roof.jpg');
	game.load.image('splash1', '../resources/images/splash1.png')
	game.load.image('splash2', '../resources/images/splash2.png')
	game.load.image('splash3', '../resources/images/splash3.png')

	game.load.image('snowball_16', '../resources/images/snowballs/snowball_16.png');
	game.load.image('snowball_32', '../resources/images/snowballs/snowball_32.png');
	game.load.image('snowball_48', '../resources/images/snowballs/snowball_48.png');
}

function create() {

	// game
	game.physics.startSystem(Phaser.Physics.ARCADE);
	createSnowEmitter();

	// audio
	backgroundMusic = game.add.audio('bgmusic');
	backgroundMusic.onStop.add(startBackgroundMusic, this);

	playerHitSound = game.add.audio('auw');
	snowballSplitSound = game.add.audio('snowball_split');
	harpoonHitRoofSound = game.add.audio('harpoon_roof');
	harpoonLaunchSound = game.add.audio('harpoon_launch');

	// groups
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

	// sprites
	groundSprite = game.add.tileSprite(0, game.world.height - 32, width, 32, 'roof');
	levelProgressText = game.add.text(10, 10, 'level: ' + level + '/' + finalLevel, {
		fontSize : '32px',
		fill : '#ffffff'
	});
	
	var top = bounds.create(0, -32, 'ground_invisible');
	top.body.immovable = true;
	var bottom = deathPit.create(0, 599, 'ground_invisible');
	bottom.body.immovable = true;

	// properties
	projectileStartLocationY = game.world.height - 100
	cursors = game.input.keyboard.createCursorKeys();

	startBackgroundMusic();
	createSplashScreen(getLevel(level));
}

function createSnowEmitter() {
	snowEmitter = game.add.emitter(game.world.centerX, -32, 400);
	game.world.bringToTop(snowEmitter);
	snowEmitter.makeParticles('snowflakes', [ 0, 1, 2, 3, 4, 5 ]);
	snowEmitter.maxParticleScale = 0.6;
	snowEmitter.minParticleScale = 0.2;
	snowEmitter.setYSpeed(20, 100);
	snowEmitter.gravity = 0;
	snowEmitter.width = game.world.width * 2;
	snowEmitter.minRotation = 0;
	snowEmitter.maxRotation = 40;

	snowEmitter.start(false, 14000, 20);
}

function changeSnowDirection(){
	var multi = Math.floor((maxSnow + 200) / 4), frag = (Math.floor(Math.random() * 100) - multi);
	maxSnow = maxSnow + frag;
	
	if (maxSnow > 200) maxSnow = 150;
	if (maxSnow < -200) maxSnow = -150;
	
	snowEmitter.setXSpeed(maxSnow - 20, maxSnow);
	snowEmitter.forEachAlive(setParticleXSpeed, this, maxSnow);
}

function setParticleXSpeed(particle, maxSnow) {
    particle.body.velocity.x = maxSnow - Math.floor(Math.random() * 30);
}

function useProjectile() {
	if (projectilesInUse < numOfProjectiles) {
		let
		startLocationX = player.body.x + (player.width / 4);
		var projectile = projectiles.create(startLocationX, projectileStartLocationY, 'projectile');
		projectilesInUse++;
		//game.world.bringToTop(groundSprite);
		harpoonLaunchSound.play();
	}
}

function update() {
	// Collisions
	if (true && !playerDying) {
		game.physics.arcade.collide(player, platforms);
		playerOnIce = game.physics.arcade.collide(player, icePlatforms);
		
		game.physics.arcade.collide(player, deathPit, playerHit, null, this);
		game.physics.arcade.overlap(player, balls, playerHit, null, this);
		
		handlePlayerMovement();

		game.physics.arcade.collide(projectiles, platforms);
		game.physics.arcade.overlap(projectiles, bounds, projectileHitBounds, null, this);
		game.physics.arcade.overlap(projectiles, balls, projectileBallCollision, null, this);

		handleBallPhysics();

		// Projectile
		for (var i = 0; i < projectiles.children.length; i++) {
			var projectile = projectiles.children[i];
			projectile.body.y -= 7.35;
		}
	}
	
	
	snowInterval++;
    if (snowInterval === updateSnowInterval)
    {
        changeSnowDirection();
        updateSnowInterval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
        snowInterval = 0;
    }
}

function projectileHitBounds(projectile) {
	harpoonHitRoofSound.play();
	destroyProjectile(projectile);
}

function destroyProjectile(projectile) {
	projectile.destroy();
	projectilesInUse--;
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
			window.location = "./message?branch=" + theme;
		} else {
			level++;
			createSplashScreen(getLevel(level));
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
	playerHitSound.play();
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
	createSplashScreen(cachedLevel);
}

function handleBallPhysics() {
	if (floor != undefined) {
		game.physics.arcade.collide(balls, floor, ballBounce, null, this)
	}

	game.physics.arcade.collide(balls, platforms, ballBounce, null, this);
	game.physics.arcade.collide(balls, icePlatforms, ballBounce, null, this);
}

function ballBounce(){
	for (var i = 0; i < balls.children.length; i++) {
		var ball = balls.children[i];
		if (ball.body.touching.down) {
			ball.body.velocity.y = -800;
		}
	}
}

function handlePlayerMovement() {
	if (!!player) {
		if ((game.input.activePointer.isDown || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) 
				&& player.body.touching.down) {
			useProjectile();
		}
		
		let slideDecrease = 6;
		let newVelocity = 0;
		let maxVelocity = 250;
		
		if(playerOnIce){
			if(player.body.velocity.x < 0){
				newVelocity = player.body.velocity.x + slideDecrease;
			} else if(player.body.velocity.x > 0){
				newVelocity = player.body.velocity.x - slideDecrease;
			}
		}

		slideDecrease++;
		
		if (cursors.left.isDown) {
			if(playerOnIce){
				if(player.body.velocity.x > 0){
					newVelocity = player.body.velocity.x - slideDecrease;
				} else{
					let baseVelocity = player.body.velocity.x;
					if(baseVelocity === 0){
						baseVelocity = -1;
					}
					newVelocity = baseVelocity + (baseVelocity * 1.1);
				}
			} else{
				newVelocity = -maxVelocity;
			}
			player.animations.play('left');
		} else if (cursors.right.isDown) {
			if(playerOnIce){
				if(player.body.velocity.x < 0){
					newVelocity = player.body.velocity.x + slideDecrease;
				} else{
					let baseVelocity = player.body.velocity.x;
					if(baseVelocity === 0){
						baseVelocity = 1;
					}
					newVelocity = baseVelocity + (baseVelocity * 1.1);
				}
			} else{
				newVelocity = maxVelocity;
			}
			player.animations.play('right');
		} else {
			player.animations.stop();
			player.frame = 32;
		}
		
		if(newVelocity > maxVelocity){
			player.body.velocity.x = maxVelocity;
		} else if(newVelocity < -maxVelocity) {
			player.body.velocity.x = -maxVelocity;
		} else{
			player.body.velocity.x = newVelocity;
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
	createPlayer(playerPosition);

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
	//create splashscreen
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

	// fallback
	if (platforms.children.length == 0) {
		groundSprite = game.add.tileSprite(0, game.world.height - 32, width, 32, 'roof');
		floor = platforms.create(0, game.world.height - 32, 'ground_invisible');
		floor.body.immovable = true;
	}
}

function clearGroup(group){
	let i = group.children.length;
	while (i--) {
		group.children[i].destroy();
	}
}

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
