function Player(playerPositionX, playerPositionY) {
	let playerObject = game.add.sprite(playerPositionX, playerPositionY, 'santa');
	
	playerObject.playerHitSound = game.add.audio('auw');
	
	playerObject.playerDying = false;
	playerObject.playerOnIce = false;
	playerObject.playerVelocity = 500;	
	playerObject.playerDying = false;
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

	playerObject.handleCollisions = function() {
		game.physics.arcade.collide(playerObject, platforms);
		playerObject.playerOnIce = game.physics.arcade.collide(playerObject, icePlatforms);

		game.physics.arcade.collide(playerObject, deathPit, playerObject.playerHit, null, this);
		game.physics.arcade.overlap(playerObject, balls, playerObject.playerHit, null, this);
	};

	playerObject.playerHit = function(player, ball) {
		playerObject.playerHitSound.play();
		playerObject.playerDying = true;
		playerObject.body.collideWorldBounds = false;
		playerObject.body.velocity.y = -400;
		playerObject.animations.stop();
		playerObject.frame = 32;

		for (var i = 0; i < balls.children.length; i++) {
			var ball = balls.children[i];
			ball.body.velocity.setTo(0, 0);
			ball.body.gravity = 0;
		}
	};

	playerObject.handleMovement = function() {
		if ((game.input.activePointer.isDown || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) && playerObject.body.touching.down) {
			playerObject.useProjectile();
		}

		let
		slideDecrease = 6;
		let
		newVelocity = 0;
		let
		maxVelocity = 250;

		if (playerObject.playerOnIce) {
			if (playerObject.body.velocity.x < 0) {
				newVelocity = playerObject.body.velocity.x + slideDecrease;
			} else if (playerObject.body.velocity.x > 0) {
				newVelocity = playerObject.body.velocity.x - slideDecrease;
			}
		}

		slideDecrease++;

		if (cursors.left.isDown) {
			if (playerObject.playerOnIce) {
				if (playerObject.body.velocity.x > 0) {
					newVelocity = playerObject.body.velocity.x - slideDecrease;
				} else {
					let
					baseVelocity = playerObject.body.velocity.x;
					if (baseVelocity === 0) {
						baseVelocity = -1;
					}
					newVelocity = baseVelocity + (baseVelocity * 1.1);
				}
			} else {
				newVelocity = -maxVelocity;
			}
			playerObject.animations.play('left');
		} else if (cursors.right.isDown) {
			if (playerObject.playerOnIce) {
				if (playerObject.body.velocity.x < 0) {
					newVelocity = playerObject.body.velocity.x + slideDecrease;
				} else {
					let
					baseVelocity = playerObject.body.velocity.x;
					if (baseVelocity === 0) {
						baseVelocity = 1;
					}
					newVelocity = baseVelocity + (baseVelocity * 1.1);
				}
			} else {
				newVelocity = maxVelocity;
			}
			playerObject.animations.play('right');
		} else {
			playerObject.animations.stop();
			playerObject.frame = 32;
		}

		if (newVelocity > maxVelocity) {
			playerObject.body.velocity.x = maxVelocity;
		} else if (newVelocity < -maxVelocity) {
			playerObject.body.velocity.x = -maxVelocity;
		} else {
			playerObject.body.velocity.x = newVelocity;
		}
	};

	playerObject.useProjectile = function() {
		if (projectilesInUse < numOfProjectiles) {
			let
			startLocationX = playerObject.body.x + (playerObject.width / 4);
			var projectile = projectiles.create(startLocationX, projectileStartLocationY, 'projectile');
			projectilesInUse++;
			// game.world.bringToTop(groundSprite);
			harpoonLaunchSound.play();
		}
	};	
	return playerObject;
}