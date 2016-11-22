var player;
var playerDying;
var playerOnIce;
var playerVelocity = 500;

function Player(playerPositionX, playerPositionY){
	if (!!player) {
		player.destroy();
	}
	playerObject = game.add.sprite(playerPositionX, playerPositionY, 'santa');
	playerDying = false;
	game.physics.arcade.enable(playerObject);
	playerObject.body.bounce.y = 0;
	playerObject.body.gravity.y = 1500;
	playerObject.body.collideWorldBounds = true;
	playerObject.animations.add('right', [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], 20, true);
	playerObject.animations.add('left', [ 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ], 20, true);
	playerObject.checkWorldBounds = true;
	playerObject.events.onOutOfBounds.add(function() {
		setTimeout(reset, 1000);
	}, this);
	
	player = playerObject;
}

function handlePlayerCollisions(){
	game.physics.arcade.collide(player, platforms);
	playerOnIce = game.physics.arcade.collide(player, icePlatforms);
	
	game.physics.arcade.collide(player, deathPit, playerHit, null, this);
	game.physics.arcade.overlap(player, balls, playerHit, null, this);
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