var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
game.state.add('Game', game);

var background;

function preload() {
	game.load.image('sky', '../resources/assets/tests/sky.png');
    game.load.image('ground', '../resources/images/cartoon-roof.jpg');
    game.load.image('ground_invisible', '../resources/images/dak_invisible.png');
    game.load.image('star', '../resources/assets/particlestorm/star.png');
    game.load.image('snowball_16', '../resources/images/snowball_16.png');
    game.load.image('snowball_32', '../resources/images/snowball_32.png');
    game.load.spritesheet('dude', '../resources/assets/games/starstruck/dude.png', 32, 48);
}

var player;
var platforms;
var ground;
var stars;
var traps;
var balls;

var score = 0;
var scoreText;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Background
	background = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('sky').height, 'sky');
	game.add.tileSprite(0, game.world.height - 32, 800, 32, 'ground');
	
	//Platforms
	platforms = game.add.group();
	platforms.enableBody = true;
	
	ground = platforms.create(0, game.world.height - 32, 'ground_invisible');
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;
	
	var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
	
	//Player
	player = game.add.sprite(32, game.world.height - 150, 'dude');
	game.physics.arcade.enable(player);
	
	player.body.bounce.y = 0.2;
    player.body.gravity.y = 1000;
    player.body.collideWorldBounds = true;
	
	player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
	
	cursors = game.input.keyboard.createCursorKeys();
	
	//stars
	stars = game.add.group();

    stars.enableBody = true;

    /*for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 600;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }*/
    
    //balls
    balls = game.add.group();
    balls.enableBody = true;
    
    balls.add(new Ball(1, 2, 100));
    balls.add(new Ball(2, 2, 200));
	
	//traps
	traps = game.add.group();
	traps.enableBody = true;
	
	//Score
	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	
}

function update() {	
	//hit detection
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	
	if(game.physics.arcade.collide(balls, ground)){
		for (var i = 0; i < balls.children.length; i++) {
			var ball = balls.children[i];
			if(ball.body.touching.down){
				ball.body.velocity.y = -900;
			}
		}
	}
	game.physics.arcade.collide(balls, platforms);
	
	/* Does not work as expected, hitbox acts weird when angling
	var rotationSpeed = 3;
	for (var i = 0; i < balls.children.length; i++) {
		var ball = balls.children[i];
		if(ball.velocity > 0){
			ball.angle += rotationSpeed;
		} else{
			ball.angle += -rotationSpeed;
		}
	}*/
	
	//  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -250;

        player.animations.play('left');
		background.tilePosition.y -= 1;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 250;

        player.animations.play('right');
		background.tilePosition.y += 1;
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -600;
    }
	
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, traps, playerDies, null, this);
}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();
	score += 10;
    scoreText.text = 'Score: ' + score;
	
	if(score === 100){
		window.location ="./message";
	}
}

function playerDies (player, trap) {
    player.body.x = 32;
	player.body.y = game.world.height - 150;
	score = 0;
	scoreText.text = 'Score: ' + score;
	game.state.start('Game');
}