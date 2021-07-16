const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//constructor empty array for particles
particlesArray = [];
MLparticlesArray = [];
avoiddata = [];
sizedata = [];
speeddata = [];
timedata = [];

//constructor for mouse data
mouse = {
	x: 100,
	y: 100,
}
goleft = false;
goright= false;
goup = false;
godown= false;
breeding=false;
started=false;
gameover = false;
restart = false;
//Resize window if necessary
var score = 0;
var averageavoid = 1;
var averagespeed = 1;
var averagesize = 1;
var starttime = Date.now();
console.log(starttime);
var timeelapsed = 0;
var lasttime = 0;
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//ctx.fillStyle = 'white';
	//ctx.fillRect(10,10,150,50);
})

//INPUT
//listen for mouse click
canvas.addEventListener('click', function(event){
	mouse.x = event.x;
	mouse.y = event.y;
	if(!started){
		started = true;
	}
	if(gameover){
		restart = true;
		gameover=false;
	}

})

//listen for mouse move
canvas.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.y;

})

canvas.addEventListener('keydown', function(event) {
	//console.log(event)
    if(event.keyCode == 65 || event.keyCode == 37) {
        goleft= true;
    }
    if(event.keyCode == 68 || event.keyCode == 39) {
        goright= true;
    }
	if(event.keyCode == 87 || event.keyCode == 38) {
        goup= true;
    }
	if(event.keyCode == 83 || event.keyCode == 40) {
        godown= true;
    }
	if(event.keyCode == 32) {
		gameover = true;
		console.log('gameover');
	}
});
canvas.addEventListener('keyup', function(event) {
	//console.log(event)
    if(event.keyCode == 65 || event.keyCode == 37) {
        goleft= false;
    }
    if(event.keyCode == 68 || event.keyCode == 39) {
        goright= false;
    }
	if(event.keyCode == 87 || event.keyCode == 38) {
        goup= false;
    }
	if(event.keyCode == 83 || event.keyCode == 40) {
        godown= false;
    }
});
class MLParticle {
	constructor (){
		this.color = 'rgb('+Math.random()*255+',' +Math.random()*255+','+Math.random()*255+')'; 
		this.x = Math.random()*canvas.width;
		this.y = Math.random()*canvas.height;
		this.speedX = 3;
		this.speedY = 3;
		this.size = 20;
		this.goleft = false;
		this.goright = false;
		this.goup = false;
		this.godown = false;
	}
	update(P1x, P1y){
		//Structure
		//this.x ---   goright
		//this.y ---   goleft
		//P1x    ---   godown
		//P1y    ---   goup
		this.x += this.speedX;
		this.y += this.speedY;	
	}
	draw(){
		
		ctx.fillStyle = this.color;
		ctx.strokeStyle = 'white';
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.size,0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}	
}


//Particle class
class Particle { 
	//constructor(hue, s1a, s1b, s2a, s2b, s3a, s3b, s4a, s4b, z1a, z1b, z2a, z2b, z3a, z3b, z4a, z4b, a1a, a1b){
	constructor(input_chromosome){
		this.x = Math.random()*canvas.width;
		this.y = Math.random()*canvas.height;
		
		this.currentlybreeding = false;
		this.breedingtime = 0;
		
		this.chromosome = input_chromosome;
		this.red = 0;
		for (let i = 1; i < 9; i++){
			this.red = this.red + this.chromosome[i]
		}
		this.Maxspeed = ((this.red)+2)*1.5;
		this.Maxspeed = (this.Maxspeed*this.Maxspeed)/6
		this.direction = Math.random()*360;
		this.speedX = Math.random()*10*Math.cos(this.direction*Math.PI/180)/(Math.random()*5);
		this.speedY = Math.random()*10*Math.sin(this.direction*Math.PI/180)/(Math.random()*5);

		
		

		
		this.blue = 0;
		for (let i = 9; i < 17; i++){
			this.blue = this.blue + this.chromosome[i]
		}
		this.size = (this.blue)*4+2;  //between 2 and 26
		this.green = this.chromosome[17]+this.chromosome[18];
		this.accel = 1/(this.size*this.size)*this.Maxspeed;
		this.color = 'rgb('+Math.floor(255-(this.red/8*255))+',' +Math.floor(this.green/2*255)+','+Math.floor(255-(this.blue/8*255))+')'; 
			
		
	}
	update(){
		
		//ACCELERATE
		if(this.x < -this.size/2) {
			this.x = canvas.width + this.size/2
		}
		else if(this.x > canvas.width+this.size/2) {
			this.x = - this.size/2
		}
		if(this.y < -this.size/2) {
			this.y = canvas.height + this.size/2
		}
		else if(this.y > canvas.height+this.size/2) {
			this.y = - this.size/2
		}
		
		
		//MAX SPEED
        if((this.speedX*this.speedX + this.speedY*this.speedY) > this.Maxspeed){
            var v=Math.sqrt(this.speedX*this.speedX+this.speedY*this.speedY)
            this.speedX = this.speedX*(Math.sqrt(this.Maxspeed)/v)
            this.speedY = this.speedY*(Math.sqrt(this.Maxspeed)/v)
		}			
		
		//AVOID PLAYER BEHAVIOR
		if(this.chromosome[17]+this.chromosome[18] >=2){
			
			if(Math.abs(this.x-P1.x)+Math.abs(this.y-P1.y) <300){
				if(this.x-P1.x > 0){
					this.speedX = this.speedX+this.accel*2*Math.abs(this.x-P1.x)/(Math.abs(this.x-P1.x)+Math.abs(this.y-P1.y));
				}
				if((this.x-P1.x)<0){
					this.speedX = this.speedX-this.accel*2*Math.abs(this.x-P1.x)/(Math.abs(this.x-P1.x)+Math.abs(this.y-P1.y));
				}
				if((this.y-P1.y)>0){
					this.speedY = this.speedY+this.accel*2*Math.abs(this.y-P1.y)/(Math.abs(this.x-P1.x)+Math.abs(this.y-P1.y));;
				}
				if((this.y-P1.y)<0){
					this.speedY = this.speedY-this.accel*2*Math.abs(this.y-P1.y)/(Math.abs(this.x-P1.x)+Math.abs(this.y-P1.y));;
				}
			}
			
		
		}
		this.x += this.speedX;
		this.y += this.speedY;
	}
	draw(){
		
		ctx.fillStyle = this.color;
		ctx.strokeStyle = 'white';
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.size,0, Math.PI * 2);
		ctx.fill();
		if(this.currentlybreeding){
			ctx.beginPath()
			ctx.arc(this.x,this.y,this.size*2,0, Math.PI * 2);
			ctx.stroke();
			if(this.breedingtime>0){
				this.breedingtime = this.breedingtime-1;
			}
			else{
				this.currentlybreeding=false;
			}
		}
	}
	
}
class Player {
	constructor(){
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.size = 25;
		this.speedX = 0;
		this.speedY = 0;
		this.hunger = 200;
	}
	update(){
		
		//ACCELERATE
		if(goup){
			this.speedY = this.speedY - 0.2;
		}
		if(godown){
			this.speedY = this.speedY + 0.2;
		}
		if(goleft){
			this.speedX = this.speedX - 0.2;
		}
		if(goright){
			this.speedX = this.speedX + 0.2;
		}
		//Friction
		this.speedX = this.speedX*0.97
		this.speedY = this.speedY*0.97
		
		//UPDATE POSITITION
		this.x += this.speedX;
		this.y += this.speedY;
		
		//GOES OFF THE PAGE
		if(this.x < -this.size/2) {
			this.x = canvas.width + this.size/2
		}
		else if(this.x > canvas.width+this.size/2) {
			this.x = - this.size/2
		}
		if(this.y < -this.size/2) {
			this.y = canvas.height + this.size/2
		}
		else if(this.y > canvas.height+this.size/2) {
			this.y = - this.size/2
		}
	}
	draw(){
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'red';
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.size,0, Math.PI * 2);
		ctx.fill();
	}

}

//Initial state
function init(){
	starttime = Date.now();

	P1 = new Player();
	for (let i = 0; i < 100; i++){
		particlesArray.push(new Particle([Math.random()*360, Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)]));
		//ALL FAST particlesArray.push(new Particle([Math.random()*360, 1, 1, 1, 1, 1, 1, 1, 1,Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)]));
		
	}
	//for (let i=0; i< 100; i++){
	//	MLparticlesArray.push(new MLParticle())
	//}
	
}

//Update functions for large groups
function handleParticles(){
	//if((Date.now()-starttime)>lasttime+30000){
	//	breeding = true;
	//	lasttime = Date.now()-starttime
	//}
	if(particlesArray.length < 25){
		breeding = true;
	}
	if (particlesArray.length > 200){
		breeding = false;
	}
	for (let i=0; i< particlesArray.length; i++){
		particlesArray[i].update();
		particlesArray[i].draw();
	}
	for (let i =0; i<particlesArray.length; i++){
		if (collided(particlesArray[i], P1)){
			P1.hunger += particlesArray[i].size/2
			if(P1.hunger>1000){
				P1.hunger = 1000;
			}
			particlesArray.splice(i, 1); 
            i--;
			score = score +1;
			
		}
	}
	if(Math.random()*200<((1/(particlesArray.length))*200)){
		var mom=Math.floor(Math.random()*(particlesArray.length))
		var dad=Math.floor(Math.random()*(particlesArray.length))
		while(dad ==mom){
			dad=Math.floor(Math.random()*(particlesArray.length))
		}
		particlesArray[mom].currentlybreeding = true;
		particlesArray[mom].breedingtime = 50;
		particlesArray[dad].currentlybreeding = true;
		particlesArray[dad].breedingtime = 50;
		babychromosome = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		for (let j =0; j<9; j++){
				
			momaorb = Math.floor(Math.random() * 2);
			dadaorb = Math.floor(Math.random() * 2);
			if(momaorb ==1){
				babychromosome[j*2+1] = particlesArray[mom].chromosome[j*2+1];
			}
			else {
				babychromosome[j*2+1] = particlesArray[mom].chromosome[j*2+2];
			}
			if(dadaorb ==1){
				babychromosome[j*2+2] = particlesArray[mom].chromosome[j*2+1];
			}
			else {
				babychromosome[j*2+2] = particlesArray[mom].chromosome[j*2+2];
			}
		}
		momaorb = Math.floor(Math.random() * 2);
		dadaorb = Math.floor(Math.random() * 2);
		if(momaorb ==1){
			babychromosome[17] = particlesArray[mom].chromosome[17];
		}
		else{
			babychromosome[17] = particlesArray[mom].chromosome[18];
		}
		if(dadaorb ==1){
			babychromosome[18] = particlesArray[dad].chromosome[17];
		}
		else{
			babychromosome[18] = particlesArray[dad].chromosome[18];
		}
		particlesArray.push(new Particle(babychromosome));
		
		
	}
	if(breeding){
		
		for (let i =0; i<particlesArray.length/2; i++){
			var mom=Math.floor(Math.random()*(particlesArray.length))
			var dad=Math.floor(Math.random()*(particlesArray.length))
			
			babychromosome = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			for (let j =0; j<9; j++){
				
				momaorb = Math.floor(Math.random() * 2);
				dadaorb = Math.floor(Math.random() * 2);
				if(momaorb ==1){
					babychromosome[j*2+1] = particlesArray[mom].chromosome[j*2+1];
				}
				else {
					babychromosome[j*2+1] = particlesArray[mom].chromosome[j*2+2];
				}
				if(dadaorb ==1){
					babychromosome[j*2+2] = particlesArray[mom].chromosome[j*2+1];
				}
				else {
					babychromosome[j*2+2] = particlesArray[mom].chromosome[j*2+2];
				}
			}
			momaorb = Math.floor(Math.random() * 2);
			dadaorb = Math.floor(Math.random() * 2);
			if(momaorb ==1){
				babychromosome[17] = particlesArray[mom].chromosome[17];
			}
			else{
				babychromosome[17] = particlesArray[mom].chromosome[18];
			}
			if(dadaorb ==1){
				babychromosome[18] = particlesArray[dad].chromosome[17];
			}
			else{
				babychromosome[18] = particlesArray[dad].chromosome[18];
			}
			particlesArray.push(new Particle(babychromosome));		
				
				
			
			//color, s1a, s1b, s2a, s2b, s3a, s3b, s4a, s4b, z1a, z1b, z2a, z2b, z3a, z3b, z4a, z4b, a1a, a1b, 
			//particlesArray.push(new Particle((particlesArray[mom].hue + particlesArray[dad].hue)/2, particlesArray[mom].speedgene1a, particlesArray[dad].speedgene1b, particlesArray[mom].speedgene2a, particlesArray[dad].speedgene2b, particlesArray[mom].speedgene3a, particlesArray[dad].speedgene3b, particlesArray[mom].speedgene4a, particlesArray[dad].speedgene4b, particlesArray[mom].sizegene1a,	particlesArray[dad].sizegene1b,	particlesArray[mom].sizegene2a,	particlesArray[dad].sizegene2b,	particlesArray[mom].sizegene3a,	particlesArray[dad].sizegene3b,	particlesArray[mom].sizegene4a,	particlesArray[dad].sizegene4b, particlesArray[mom].avoidplayergene1a,particlesArray[dad].avoidplayergene1b));
			
			

		}
		
			
		
		breeding = false;
	}
	//Trying to randomize diversity - doesn't work well
	//if(Math.random()*1000 <1){
	//	particlesArray.push(new Particle(0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1))
	//	particlesArray.push(new Particle(1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0))
	//}
	averageavoidoutputvalue = 0;
	averagespeedoutputvalue = 0;
	averagesizeoutputvalue = 0;

	for (let i=0; i< particlesArray.length; i++){
		
		averageavoidoutputvalue = averageavoidoutputvalue + (particlesArray[i].chromosome[17]+ particlesArray[i].chromosome[18]);
		for (let j=0; j<8; j++){
			averagespeedoutputvalue = averagespeedoutputvalue + particlesArray[i].chromosome[j+1];
			averagesizeoutputvalue = averagesizeoutputvalue + particlesArray[i].chromosome[j+9];
		}
	}
	averageavoid = averageavoidoutputvalue/particlesArray.length;
	averagesize = averagesizeoutputvalue/particlesArray.length;
	averagespeed = averagespeedoutputvalue/particlesArray.length;
	
}
function handleMLParticles (){
	for (let i=0; i< MLparticlesArray.length; i++){
		MLparticlesArray[i].update();
		
		MLparticlesArray[i].draw();
	}
}
//CHECKS COLLISIONS OF 2 CIRLCES
function collided(Pcheck, P1){
	dx = Math.abs(Pcheck.x-P1.x)
	dy = Math.abs(Pcheck.y-P1.y)
	R = P1.size+Pcheck.size
	if (dx + dy <= R){
		
		return true
	}
	if (dx > R){
		
		return false
	}
	if (dy > R){
		
		return false
	}
	if ((dx*dx + dy*dy) <= R*R){ 
		
		return true
	}
	else{
		
		return false
	}
}


//Add any update functions
function animate(){

		
	if(restart){
		restart = false;
		breeding=false;
		started=false;
		gameover = false;
		particlesArray = [];
		MLparticlesArray = [];
		avoiddata = [];
		sizedata = [];
		speeddata = [];
		timedata = [];
		score = 0;
		averageavoid = 1;
		averagespeed = 1;
		averagesize = 1;
		starttime = Date.now();
		timeelapsed = 0;
		lasttime = 0;
		console.log('restart');
		init();
		P1.hunger = 200;
		
	}
		
	if(started && !gameover){
		
		if(P1.hunger <0)
		{
			gameover = true;
		}
		//ctx.clearRect(0,0, canvas.width, canvas.height);
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.fillRect(0,0,canvas.width, canvas.height);
		
		//ENEMIES
		handleParticles();
		handleMLParticles();
		//PLAYER
		P1.update()
		P1.draw();
		P1.hunger = P1.hunger -0.15;
		
		
		
		
		//HEADS UP DISPLAY - GRAPH THE THREE TRAITS
		ctx.font = "30px Arial";
		ctx.textAlign = "left";
		ctx.fillStyle = "white";
		//console.log(Date.now()-starttime)
		console.log(starttime)
		ctx.fillText('Time Elapsed: '+((Date.now()-starttime)/1000).toFixed(0),20,67)
		ctx.fillText('Score: '+score, 20, 107);
		//ctx.fillText('Player sketchy: '+(averageavoid*50).toFixed(2)+'%', 50, 130);
		//ctx.fillText('Average Size: '+(averagesize/4*100).toFixed(2)+'%', 50, 160);
		//ctx.fillText('Average Speed: '+(averagespeed/4*100).toFixed(2)+'%', 50, 190);
		ctx.fillStyle = 'rgba(255,0,0,1)';
		ctx.fillRect(0,0,canvas.width*P1.hunger/1000, 30);
		ctx.fillStyle = "black";
		ctx.fillText('HUNGER',20,27);
		
		avoiddata.push((averageavoid*50).toFixed(2))
		sizedata.push((averagesize/4*100).toFixed(2))
		speeddata.push((averagespeed/4*100).toFixed(2))
		timedata.push(((Date.now()-starttime)/1000).toFixed(0))
	}
	//END SCREEN
	else if(gameover){
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0,0,canvas.width, canvas.height);

		ctx.fillStyle = "white";


		
		
		ctx.textAlign = "right";
		ctx.fillText('0%',canvas.width/2-80,200+15);
		ctx.fillText('100%',canvas.width/2-80,200-85);
		ctx.fillText('0%',canvas.width/2-80,400+15);
		ctx.fillText('100%',canvas.width/2-80,400-85);
		ctx.fillText('0%',canvas.width/2-80,600+15);
		ctx.fillText('100%',canvas.width/2-80,600-85);
		
		ctx.strokeRect(canvas.width/2-80,200-100,200,100);
		ctx.strokeRect(canvas.width/2-80,400-100,200,100);		
		ctx.strokeRect(canvas.width/2-80,600-100,200,100);

		
		for (let i=0; i< avoiddata.length; i++){ 
			ctx.fillRect(i/avoiddata.length*200+canvas.width/2-80,200-avoiddata[i],3,3);
			ctx.fillRect(i/sizedata.length*200+canvas.width/2-80,400-sizedata[i]/2,3,3);
			ctx.fillRect(i/speeddata.length*200+canvas.width/2-80,600-speeddata[i]/2,3,3);
			
		}
		ctx.textAlign = "center";
		ctx.fillText('Percent that think you are sketchy',canvas.width/2+20, 80);
		ctx.fillText('Average Size',canvas.width/2+20, 280);
		ctx.fillText('Average speed',canvas.width/2+20, 480);
		ctx.fillText('Click to return to title screen',canvas.width/2, 720);
		ctx.fillText('Gameover. Your score: '+score,canvas.width/2, 680);
		
		//return;
	}
	//startscreen
	else{
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0,0,canvas.width, canvas.height);
		ctx.font = "30px Arial";
		ctx.textAlign = "center";

		ctx.fillStyle = "white";
		ctx.fillText('You are the white circle', canvas.width/2, canvas.height/2-60);
		ctx.fillStyle = 'white';
		ctx.beginPath()
		ctx.arc(canvas.width/2, canvas.height/2,25,0, Math.PI * 2);
		ctx.fill();
		ctx.fillText('Eat as many of these as you can to sustain yourself:', canvas.width/2, canvas.height/2+60);
		ctx.fillStyle = 'rgb(200,122,12)'; 
		ctx.beginPath()
		ctx.arc(canvas.width/2-60, canvas.height/2+120,12,0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = 'rgb(122,255,197)'; 
		ctx.beginPath()
		ctx.arc(canvas.width/2, canvas.height/2+120,25,0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = 'rgb(90,20,255)';
		ctx.beginPath()
		ctx.arc(canvas.width/2+60, canvas.height/2+120,20,0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle= 'White';
		ctx.fillText('Larger circles are worth more', canvas.width/2, canvas.height/2+180);
		ctx.fillText('Pay attention to the change in the population', canvas.width/2, canvas.height/2+230);
		ctx.fillText('Click to begin', canvas.width/2, canvas.height/2+270);
		
		
		
		
		
		
		
		
	}
		


	requestAnimationFrame(animate);
}


//Begin main
console.log('i fixed it')
init();
animate();
