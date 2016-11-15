var height = 600;
var width = 800;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', { preload: preload, create: create,update : update });

function preload() {

	game.load.spritesheet('button', '../resources/images/player_sprite.png', 82, 150);
    game.load.image('background','../resources/assets/misc/starfield.jpg');
}

var destroyTime = 1500;
var button;
var background;
var score = 0;
var scoreText;
var currentLevel = 1;

function create() {
    background = game.add.tileSprite(0, 0, width, height,'background');
    createTarget();
    scoreText = game.add.text(width/2, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff' });

}

function actionOnClick (sprite) {
    sprite.isClicked = true;
    sprite.destroy();
	$(".audio")[0].cloneNode(true).play();
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function createTarget() {
//	The numbers given in parameters are the indexes of the frames, in this order: over, out, down
	button = game.add.button(Math.random() * (width-123) + 41, Math.random() * (height-225) + 75, 'button', actionOnClick, this, 0, 0, 1);
    //	Set the anchor of the sprite in the center, otherwise it would rotate around the top-left corner
    button.anchor.setTo(0.5, 0.5);
    button.isClicked = false;
    setTimeout(function() { button.destroy(); createTarget()}, destroyTime-(160*currentLevel));
}

function update () {
	switch(score) {
		case 0:
			currentLevel = 2;
			break;
		case 50:
			currentLevel = 3;
			break;
		case 100: 
			currentLevel = 4;
			break;
		case 150:
			currentLevel = 5;
			break;
		case 200:
	    	window.location = "./message"
	    	break;
	}
}
