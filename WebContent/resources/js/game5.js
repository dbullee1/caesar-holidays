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
	game.load.image('ground_invisible', '../resources/images/dak_invisible.png');
	game.load.image('ground', '../resources/images/cartoon-roof.jpg');
	game.load.image('projectile', '../resources/images/xmas-harpoon.png')
	game.load.spritesheet('santa', '../resources/images/santa.png', 91,	118);
	
	game.load.image('snowball_16', '../resources/images/snowballs/snowball_16.png');
    game.load.image('snowball_32', '../resources/images/snowballs/snowball_32.png');
    game.load.image('snowball_48', '../resources/images/snowballs/snowball_48.png');
}

var player;
var playerDying;

var numOfProjectiles = 1;
var projectilesInUse = 0;
var projectiles;

var platforms;
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
	
	space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(useProjectile, this);

	// Background
	background = game.add.tileSprite(0, 0, width, height, 'starfield');
	groundSprite = game.add.tileSprite(0, game.world.height - 32, width, 32, 'ground');

	// Platforms
	platforms = game.add.group();
	platforms.enableBody = true;
	
	bounds = game.add.group();
	bounds.enableBody = true;

	floor = platforms.create(0, game.world.height - 32, 'ground_invisible');
	floor.body.immovable = true;
	
	var top = bounds.create(0, -32, 'ground_invisible');
	top.body.immovable = true;

	// Player
	player = game.add.sprite(32, game.world.height - 300, 'santa');
	game.physics.arcade.enable(player);

	player.body.bounce.y = 0;
	player.body.gravity.y = 2000;
	player.body.collideWorldBounds = true;
	player.checkWorldBounds = true;
	player.events.onOutOfBounds.add(reset, this);

	player.animations.add('right', [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 20, true);
	player.animations.add('left', [ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 20, true);

	cursors = game.input.keyboard.createCursorKeys();

	//Balls
	balls = game.add.group();
    balls.enableBody = true;
    
    balls.add(new Ball(1, 200));
	
	// Score
	scoreText = scoreText = game.add.text(width / 2, 16, 'score: 0', {
		fontSize : '32px',
		fill : '#ffffff'
	});
	scoreText.anchor.setTo(0.5, 0.5);
	
	// projectiles
	projectiles = game.add.group();
	projectiles.enableBody = true;
}

function useProjectile() {
	if(projectilesInUse < numOfProjectiles) {
		let startLocationX = player.body.x + (player.width/4);
		var projectile = projectiles.create(startLocationX, projectileStartLocationY, 'projectile');
		projectilesInUse++; 
		game.world.bringToTop(groundSprite);
	}
}

function update() {
	//Collisions
	if(!playerDying){
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.overlap(player, balls, playerHit, null, this);
	}
	
	game.physics.arcade.collide(projectiles, platforms);
	game.physics.arcade.collide(projectiles, bounds);
	
	game.physics.arcade.overlap(projectiles, bounds, destroyProjectile, null, this);
	game.physics.arcade.overlap(projectiles, balls, projectileBallCollision, null, this);
	
	handleBallPhysics();
	
	if(!playerDying){
		handlePlayerMovement();
    }
    
    //Projectile
    for (var i = 0; i < projectiles.children.length; i++) {
		var projectile = projectiles.children[i];
		projectile.body.y -= 7.35;
	}
}

function destroyProjectile(projectile) {
	projectile.destroy();
	projectilesInUse--;
}

function projectileBallCollision(projectile, ball){
	//TODO play destroy snowball sound
	
	destroyProjectile(projectile);
	
	if(ball.key === 'snowball_48'){
		splitBall(ball, 2);
	} else if(ball.key === 'snowball_32'){
		splitBall(ball, 1);
	}
	ball.destroy();
	
	if(balls.children.length === 0){
		window.alert("Level complete");
	}
}

function splitBall(original, newBallSize){
	let velocityX = original.body.velocity.x;
	let velocityY = original.body.velocity.y;
	balls.add(new Ball(newBallSize, velocityX, velocityY, original.body.x, original.body.y));
	balls.add(new Ball(newBallSize, -velocityX, velocityY, original.body.x, original.body.y));
}

function playerHit(player, ball){
	//TODO play death sound
	
	playerDying = true;
	player.body.collideWorldBounds = false;
	player.body.velocity.y = -400;
}

function reset(player){
	//TODO load current level again
	window.alert('press F5');
}

function handleBallPhysics(){
	if(game.physics.arcade.collide(balls, floor)){
		for (var i = 0; i < balls.children.length; i++) {
			var ball = balls.children[i];
			if(ball.body.touching.down){
				ball.body.velocity.y = -900;
			}
		}
	}
	game.physics.arcade.collide(balls, platforms);
}

function handlePlayerMovement(){
	player.body.velocity.x = 0;

    if (cursors.left.isDown){
        player.body.velocity.x = -250;
        player.animations.play('left');
    } else if (cursors.right.isDown){
        player.body.velocity.x = 250;
        player.animations.play('right');
    } else{
        player.animations.stop();
        player.frame = 32;
    }
}