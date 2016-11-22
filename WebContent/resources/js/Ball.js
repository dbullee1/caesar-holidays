function Ball(size, velocityX, velocityY, positionX, positionY){
	velocityY = velocityY || 0;
	positionX = positionX || game.world.centerX;
	positionY = positionY || 25;
	
	switch(size){
	case 1:
		this.spriteName = 'snowball_16';
		this.gravity = 1000;
		break;
	case 2:
		this.spriteName = 'snowball_32';
		this.gravity = 850;
		break;
	case 3:
		this.spriteName = 'snowball_48';
		this.gravity = 700;
		break;
	}
	
	var ballPhaserObj = game.add.sprite(positionX, positionY, this.spriteName);
	game.physics.arcade.enable(ballPhaserObj);
	ballPhaserObj.body.collideWorldBounds=true;
	ballPhaserObj.body.bounce.setTo(1,1);
	ballPhaserObj.body.gravity.y = this.gravity;
	ballPhaserObj.body.velocity.x = velocityX;
	ballPhaserObj.body.velocity.y = velocityY;
	
	return ballPhaserObj;
}

function handleBallCollisions(){
	if (defaultFloor != undefined) {
		game.physics.arcade.collide(balls, defaultFloor, ballBounce, null, this)
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

function splitBall(originalBall, newBallSize) {
	let
	velocityX = originalBall.body.velocity.x;
	let
	velocityY = originalBall.body.velocity.y;
	balls.add(new Ball(newBallSize, velocityX, velocityY, originalBall.body.x, originalBall.body.y));
	balls.add(new Ball(newBallSize, -velocityX, velocityY, originalBall.body.x, originalBall.body.y));
}