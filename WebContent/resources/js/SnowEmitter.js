function SnowEmitter(){
	let snowEmitterObject = game.add.emitter(game.world.centerX, -32, 400);
	
	let maxSnow = 0;
	let updateSnowInterval = 4 * 60;
	let snowInterval = 0;
	
	snowEmitterObject.makeParticles('snowflakes', [ 0, 1, 2, 3, 4, 5 ]);
	snowEmitterObject.maxParticleScale = 0.6;
	snowEmitterObject.minParticleScale = 0.2;
	snowEmitterObject.setYSpeed(20, 100);
	snowEmitterObject.gravity = 0;
	snowEmitterObject.width = game.world.width * 2;
	snowEmitterObject.minRotation = 0;
	snowEmitterObject.maxRotation = 40;

	game.world.bringToTop(snowEmitterObject);
	snowEmitterObject.start(false, 14000, 20);
	
	snowEmitterObject.updateWind = function(){
		snowEmitterObject.snowInterval++;
		if (snowEmitterObject.snowInterval === snowEmitterObject.updateSnowInterval) {
			snowEmitterObject.changeSnowDirection();
			updateSnowInterval = Math.floor(Math.random() * 20) * 60;
			snowEmitterObject.snowInterval = 0;
		}
	}
	
	function changeSnowDirection(){
		var multi = Math.floor((snowEmitterObject.maxSnow + 200) / 4), frag = (Math.floor(Math.random() * 100) - multi);
		snowEmitterObject.maxSnow = snowEmitterObject.maxSnow + frag;
		
		if (snowEmitterObject.maxSnow > 200) snowEmitterObject.maxSnow = 150;
		if (snowEmitterObject.maxSnow < -200) snowEmitterObject.maxSnow = -150;
		
		snowEmitterObject.setXSpeed(snowEmitterObject.maxSnow - 20, snowEmitterObject.maxSnow);
		snowEmitterObject.forEachAlive(snowEmitterObject.setParticleXSpeed, this, snowEmitterObject.maxSnow);
	}
	
	function setParticleXSpeed(particle, maxSnow) {
	    particle.body.velocity.x = maxSnow - Math.floor(Math.random() * 30);
	}
	
	return snowEmitterObject;
}