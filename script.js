const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//constructor empty array for particles
const particlesArray = [];
const avoiddata = [];
const sizedata = [];
const speeddata = [];
const timedata = [];

//constructor for mouse data
const mouse = {
	x: 100,
	y: 100,
}
goleft = false;
goright= false;
goup = false;
godown= false;
breeding=false;
graphit = false;
//Resize window if necessary
var score = 0;
var averageavoid = 1;
var averagespeed = 1;
var averagesize = 1;
var starttime = Date.now();
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

})

//listen for mouse move
canvas.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.y;

})

canvas.addEventListener('keydown', function(event) {
	//console.log(event)
    if(event.keyCode == 65) {
        goleft= true;
    }
    if(event.keyCode == 68) {
        goright= true;
    }
	if(event.keyCode == 87) {
        goup= true;
    }
	if(event.keyCode == 83) {
        godown= true;
    }
	if(event.keyCode == 32) {
		graphit = true;
	}
});
canvas.addEventListener('keyup', function(event) {
	//console.log(event)
    if(event.keyCode == 65) {
        goleft= false;
    }
    if(event.keyCode == 68) {
        goright= false;
    }
	if(event.keyCode == 87) {
        goup= false;
    }
	if(event.keyCode == 83) {
        godown= false;
    }
});
//Particle class
class Particle {
	constructor(hue, s1a, s1b, s2a, s2b, s3a, s3b, s4a, s4b,z1a, z1b, z2a, z2b, z3a, z3b, z4a, z4b, a1a, a1b){
		//this.hue = Math.random()*360 
		this.hue = hue;
		//this.color = "rgb('155, 102, 102)"; 
		//this.color = 'hsl('+this.hue+',100%,50%)';
		
		this.speedgene1a=s1a;
		this.speedgene1b=s1b;
		this.speedgene2a=s2a;
		this.speedgene2b=s2b;
		this.speedgene3a=s3a;
		this.speedgene3b=s3b;
		this.speedgene4a=s4a;
		this.speedgene4b=s4b;
		this.red = s1a+s1b+s2a+s2b+s3a+s3b+s4a+s4b;
		this.direction = Math.random()*360;
		
		this.sizegene1a=z1a;
		this.sizegene1b=z1b;
		this.sizegene2a=z2a;
		this.sizegene2b=z2b;
		this.sizegene3a=z3a;
		this.sizegene3b=z3b;
		this.sizegene4a=z4a;
		this.sizegene4b=z4b;
		this.blue = z1a+z1b+z2a+z2b+z3a+z3b+z4a+z4b;
		
		
		
		this.avoidplayergene1a = a1a;
		this.avoidplayergene1b = a1b;
		this.green = a1a+a1b;
		this.color = 'rgb('+this.red/8*255+',' +this.green/2*255+','+this.blue/8*255+')'; 
		
		//this.avoidplayergene1a =  Math.floor(Math.random() * 2)
		//this.avoidplayergene1b =  Math.floor(Math.random() * 2)

		this.x = Math.random()*canvas.width;
		this.y = Math.random()*canvas.height;
		
		this.size = (this.sizegene1a+this.sizegene1b+this.sizegene2a+this.sizegene2b+this.sizegene3a+this.sizegene3b+this.sizegene4a+this.sizegene4b)*4+2;  //between 2 and 26
		
		this.Maxspeed = (this.speedgene1a+this.speedgene1b+this.speedgene2a+this.speedgene2b+this.speedgene3a+this.speedgene3b+this.speedgene4a+this.speedgene4b)*2;
		this.Maxspeed = this.Maxspeed*this.Maxspeed/6
		this.speedX = this.Maxspeed*Math.cos(this.direction*Math.PI/180)/(Math.random()*5);
		this.speedY = this.Maxspeed*Math.sin(this.direction*Math.PI/180)/(Math.random()*5);
		
		this.accel = 1/(this.size*this.size)*this.Maxspeed;
		
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
		if(this.avoidplayergene1a + this.avoidplayergene1b >=2){
			
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
		//ctx.stroke();
	}
}
class Player {
	constructor(){
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.size = 25;
		this.speedX = 0;
		this.speedY = 0;
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
		this.speedX = this.speedX*0.98
		this.speedY = this.speedY*0.98
		
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
		//ctx.stroke();
	}
}

//Initial state
function init(){
	P1 = new Player();
	for (let i = 0; i < 100; i++){
		particlesArray.push(new Particle(Math.random()*360, Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2),Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)));
	}
	
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
			particlesArray.splice(i, 1); 
            i--;
			score = score +1;
		}
	}
	if(breeding){
		
		for (let i =0; i<particlesArray.length/2; i++){
			var mom=Math.floor(Math.random()*(particlesArray.length))
			var dad=Math.floor(Math.random()*(particlesArray.length))
			
			//color, s1a, s1b, s2a, s2b, s3a, s3b, s4a, s4b, z1a, z1b, z2a, z2b, z3a, z3b, z4a, z4b, a1a, a1b, 
			particlesArray.push(new Particle((particlesArray[mom].hue + particlesArray[dad].hue)/2, particlesArray[mom].speedgene1a, particlesArray[dad].speedgene1b, particlesArray[mom].speedgene2a, particlesArray[dad].speedgene2b, particlesArray[mom].speedgene3a, particlesArray[dad].speedgene3b, particlesArray[mom].speedgene4a, particlesArray[dad].speedgene4b,particlesArray[mom].sizegene1a,	particlesArray[dad].sizegene1b,	particlesArray[mom].sizegene2a,	particlesArray[dad].sizegene2b,	particlesArray[mom].sizegene3a,	particlesArray[dad].sizegene3b,	particlesArray[mom].sizegene4a,	particlesArray[dad].sizegene4b, particlesArray[mom].avoidplayergene1a,particlesArray[dad].avoidplayergene1b));
			
			

		}
		breeding = false;
	}
	var outputvalue = 0
	for (let i=0; i< particlesArray.length; i++){
		outputvalue = outputvalue + particlesArray[i].avoidplayergene1a+particlesArray[i].avoidplayergene1b;
		
	}
	averageavoid = outputvalue/particlesArray.length;
	outputvalue = 0
	for (let i=0; i< particlesArray.length; i++){
		outputvalue = outputvalue + particlesArray[i].sizegene1a+particlesArray[i].sizegene1b+particlesArray[i].sizegene2a+particlesArray[i].sizegene2b+particlesArray[i].sizegene3a+particlesArray[i].sizegene3b+particlesArray[i].sizegene4a+particlesArray[i].sizegene4b
		
	}	
	averagesize = outputvalue/particlesArray.length;
	
	outputvalue = 0
	for (let i=0; i< particlesArray.length; i++){
		outputvalue = outputvalue + particlesArray[i].speedgene1a+particlesArray[i].speedgene1b+particlesArray[i].speedgene2a+particlesArray[i].speedgene2b+particlesArray[i].speedgene3a+particlesArray[i].speedgene3b+particlesArray[i].speedgene4a+particlesArray[i].speedgene4b
		
	}	
	averagespeed = outputvalue/particlesArray.length;
}	

//FIX TO INCLUDE RADIUS OF OBJECT
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
	//ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = 'rgba(0,0,0,0.2)';
	ctx.fillRect(0,0,canvas.width, canvas.height);
	handleParticles();
	P1.update()
	P1.draw();
	//GRAPH THE THREE TRAITS
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	//console.log(Date.now()-starttime)
	ctx.fillText('Time Elapsed: '+((Date.now()-starttime)/1000).toFixed(0)+'Number of particles: '+particlesArray.length, 50, 70);
	ctx.fillText('Score: '+score, 50, 100);
	ctx.fillText('Player sketchy: '+(averageavoid*50).toFixed(2)+'%', 50, 130);
	ctx.fillText('Average Size: '+(averagesize/4*100).toFixed(2)+'%', 50, 160);
	ctx.fillText('Average Speed: '+(averagespeed/4*100).toFixed(2)+'%', 50, 190);
	avoiddata.push((averageavoid*50).toFixed(2))
	sizedata.push((averagesize/4*100).toFixed(2))
	speeddata.push((averagespeed/4*100).toFixed(2))
	timedata.push(((Date.now()-starttime)/1000).toFixed(0))
	
	if(graphit){
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.fillRect(0,0,canvas.width, canvas.height);

		ctx.fillStyle = "white";
		ctx.fillText('Gameover: '+((Date.now()-starttime)/1000).toFixed(0), 50, 70);
		
		for (let i=0; i< avoiddata.length; i++){ 
			ctx.fillRect(i/avoiddata.length*200+200,200-avoiddata[i],3,3);
			ctx.fillRect(i/sizedata.length*200+200,300-sizedata[i],3,3);
			ctx.fillRect(i/speeddata.length*200+200,400-speeddata[i],3,3);
			
		}
		
		return;
	}
		


	requestAnimationFrame(animate);
}


//Begin main
init();
animate();