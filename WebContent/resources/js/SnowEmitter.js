var snowEmitter;

var maxSnow = 0;
var updateSnowInterval = 4 * 60;
var snowInterval = 0;

function SnowEmitter(){
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