function Ball(size, velocityX, velocityY, positionX, positionY){
	velocityY = velocityY || 0;
	positionX = positionX || game.world.centerX;
	positionY = positionY || 25;
	
	switch(size){
	case 1:
		this.spriteName = 'snowball_16';
		this.gravity = 1250;
		break;
	case 2:
		this.spriteName = 'snowball_32';
		this.gravity = 1000;
		break;
	case 3:
		this.spriteName = 'snowball_48';
		this.gravity = 750;
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