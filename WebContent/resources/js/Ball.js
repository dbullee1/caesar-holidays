function Ball(size, angle, velocity){
	switch(size){
	case 1:
		this.spriteName = 'snowball_16';
		this.gravity = 500;
		break;
	case 2:
		this.spriteName = 'snowball_32';
		this.gravity = 1000;
		break;
	case 3:
		this.spriteName = 'snowball';
		this.gravity = 1500;
		break;
	}
	
	var ballPhaserObj = game.add.sprite(game.world.centerX, 25, this.spriteName);
	game.physics.arcade.enable(ballPhaserObj);
	ballPhaserObj.body.collideWorldBounds=true;
	ballPhaserObj.body.bounce.setTo(1,1);
	ballPhaserObj.body.gravity.y = this.gravity;
	ballPhaserObj.body.velocity.x = velocity;
	
	return ballPhaserObj;
}