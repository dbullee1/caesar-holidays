function Platform(type, positionX, positionY, width, height){
	switch(type){
	case "roof":
		this.spriteName = 'roof';
		break;
	case "roof-ice":
		this.spriteName = 'roof-ice';
		break;
	case "normal":
		this.spriteName = 'normal';
		break;
	case "ice":
		this.spriteName = 'ice';
		break;
	case "mud":
		this.spriteName = 'mud';
		break;
	}
	
	var platformPhaserObj = game.add.tileSprite(positionX, positionY, width, height, this.spriteName);
	game.physics.arcade.enable(platformPhaserObj);
	platformPhaserObj.body.immovable = true;
	
	return platformPhaserObj;
}