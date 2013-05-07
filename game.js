var canvasBg= document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');

var canvasJet= document.getElementById('canvasJet');
var ctxJet = canvasJet.getContext('2d');

var canvasEnemy= document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');

var resumeBtn = document.getElementById('resumeBtn');
resumeBtn.addEventListener('click',pauseGame,false);

var newGame = document.getElementById('newGame');
newGame.addEventListener('click',reload,false);

var muteGame = document.getElementById('mute');
muteGame.addEventListener('click',mute,false);


document.addEventListener('keydown',checkKeyDown,false);
document.addEventListener('keyup',checkKeyUp,false);

var width=canvasBg.width;
var height=canvasBg.height;
var requestAnimFrame= window.requestAnimationFrame||
					  window.webkitRequestAnimationFrame||
					  window.mozRequestAnimationFrame||
					  window.msRequestAnimationFrame||
					  window.oRequestAnimationFrame;
						
var gamePlayed=false;
var first=true;
var done=true;
var sound=true;

//Jet vars
var jetX=400;
var jetY=379;
var jetSpeed=5;
var jetDest=false;

//bullet vars
var bullets=[];
var indBul=0;
var bulletSpeed=3;
var isShooting = false;

//enemies vars
var enemies=[];
var spawnInterval;
var numOfEnemy=0;
var enemySpeed=0.5;
var spawnRate = 3000;
var spawnAmount = 1;

//Game vars
var score=0;
var escapedJets=20;

//Images laod
var mainScreen= new Image();
mainScreen.src= 'bg/Welcome.png';
mainScreen.addEventListener('load',MainFun,false);

var im= new Image();
im.src= 'bg/l1bg.png';

var im2= new Image();
im2.src= 'bg/l2bg.png';

var jet= new Image();
jet.src= 'images/ship.png';

var enm= new Image();
enm.src = 'images/enemy.png';

var fire=new Image();
fire.src= 'images/fire.png';

var bang=new Image();
bang.src= 'images/bang.png';


//Main Screen
function MainFun() {
	drawBgMain();
	document.getElementById('st').play();
}

function mute(){
	if(sound){
		sound=false;
	}else{
		sound=true;
	}
	
}
//Intialize game
function init() {
	genBullets();
	drawBg();
  	//alert('lol');
  	gamePlayed=false;
	stoploop();
	gamePlayed=true;
	startloop();
}

function level2(){
	drawBg2();
	enemySpeed= 1.5;
	spawnRate = 2000;
}

//Generating Enemy
function spawnEnemy(n){
	for (var i=0;i<n;i++){
		enemies[numOfEnemy]=new EnemyEasy();
		numOfEnemy++;
	}
}

function startSpawn(){
	stopSpawn();
	spawnInterval= setInterval(function(){spawnEnemy(spawnAmount);},spawnRate);
}

function stopSpawn () {
   clearInterval(spawnInterval);
}

function drawEnemies(){
	clearEnemy();
	for (var i=0;i<numOfEnemy;i++){
		enemies[i].draw();
	}
}

//Generate Bullets
function genBullets(){
	for (var i=0;i<25;i++){
		bullets[i]=new Bullet();
	}
}

//Game loops
function pauseGame(){
	if(gamePlayed){
		stoploop();
		alert('Game Paused');
	}else{
		startloop();
	}
}

function mainloop(){
	if(gamePlayed){
		if(escapedJets===0 || jetDest){
			alert('Game Over!! You lost');
			stoploop();
		}
		if(score === 2000 && done){
			level2();
			alert('Youve finished mission 1 ... \n Get ready for mission 2' );
			done=false;
		}
		if(score === 5000){
			alert('You Won !! Nice Game .. ;)');
			stoploop();
		}
		drawJet();
		drawEnemies();
		document.getElementById('inner').innerHTML = "Score = "+score+"&nbsp &nbsp &nbsp Enemy escaped= "+(20-escapedJets)+"/20";
		requestAnimFrame(mainloop);
	}
}

function stoploop(){
	gamePlayed=false;
}

function startloop(){
	gamePlayed=true;
	mainloop();
	startSpawn();
}

//Background draw
function drawBg() {
   ctxBg.drawImage(im, 0, 0);
}

function drawBg2() {
   ctxBg.drawImage(im2, 0, 0);
}

function drawBgMain(){
   ctxBg.drawImage(mainScreen, 0, 0);
}


//Jet
function drawJet() {
   clearJet();
   checkHitJet();
   if(jetDest){
   		ctxJet.drawImage(bang, jetX, jetY);
   }else{
	   ctxJet.drawImage(jet, jetX, jetY);
	   for(var i=0;i< bullets.length;i++){
	   		if(bullets[i].Y > 0){
	   			bullets[i].draw();
	   		}
	   }
   }
}

function checkHitJet() {
    for(var i=0;i< enemies.length;i++){
    	if(jetX>= enemies[i].X &&
    	   jetX<= enemies[i].X + enemies[i].width &&
    	   jetY>= enemies[i].Y &&
    	   jetY<= enemies[i].Y + enemies[i].height ){
    	   		enemies[i].isHit=true;
    	   		jetDest=true;
    	   		if(sound)
    	   			document.getElementById('bomb').play();
    	   }
    }
}


function clearJet(){
	ctxJet.clearRect(0,0,width,height);
}

//enemy
function EnemyEasy(){
	this.width=78;
	this.height=58;
	this.X=Math.floor(Math.random()*742);
	this.Y=-20;
	this.speed=enemySpeed;
	this.isHit=false;
	this.timeTolive=6;
}


EnemyEasy.prototype.draw = function(){
	if(this.isHit){
		if(this.timeTolive===0){
			this.destroy();
		}
		ctxEnemy.drawImage(bang, this.X, this.Y);
		this.timeTolive--;
	}else{
		this.Y+=this.speed;
		ctxEnemy.drawImage(enm, this.X, this.Y);
		this.escaped();
	}
}

EnemyEasy.prototype.escaped = function(){
	if(this.Y>height){
		this.destroy();
		escapedJets--;
	}
}

EnemyEasy.prototype.destroy = function(){
	enemies.splice(enemies.indexOf(this),1);
	numOfEnemy--;
}


function clearEnemy(){
	ctxEnemy.clearRect(0,0,width,height);
}

//bullet
function Bullet() {
    this.X = -20;
    this.Y = -20;
    this.width = 23;
    this.height = 36;
}

Bullet.prototype.draw = function() {
    this.Y -= bulletSpeed;
    ctxJet.drawImage(fire, this.X, this.Y);
    if (this.Y + this.height < 0) {
    	this.done();
    }
    this.checkHit();
}

Bullet.prototype.done = function() {
	this.X = -20;
    this.Y = -20;
}

Bullet.prototype.fire = function(startX, startY) {
    this.X = startX;
    this.Y = startY;
}

Bullet.prototype.checkHit = function() {
    for(var i=0;i< enemies.length;i++){
    	if(this.X>= enemies[i].X &&
    	   this.X<= enemies[i].X + enemies[i].width &&
    	   this.Y>= enemies[i].Y &&
    	   this.Y<= enemies[i].Y + enemies[i].height ){
    	   		this.done();
    	   		if(sound)
    	   			document.getElementById('bomb').play();
    	   		enemies[i].isHit=true;
    	   		score+=100;
    	   }
    }
}


//events
function checkKeyDown(e){
	var keyID = (e.keyCode) ? e.keyCode : e.which;
	if (keyID === 38 || keyID === 87){//UP
		e.preventDefault();
		if(jetY>0){
			jetY-=jetSpeed;
		}
	}
	if (keyID === 39 || keyID === 68){//Right
		if(jetX<750){
			jetX+=jetSpeed;
		}
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83){//down
		e.preventDefault();
		if(jetY<379){
			jetY+=jetSpeed;
		}
	}
	
	if (keyID === 37 || keyID === 65){//Left
		e.preventDefault();
		if(jetX>5){
			jetX-=jetSpeed;
		}
	}
	
	if (keyID === 37 || keyID === 65){//Left
		e.preventDefault();
		if(jetX>5){
			jetX-=jetSpeed;
		}
	}
	if (keyID === 32){//Spacebar
		e.preventDefault();
		if(!isShooting){
			isShooting=true;
			bullets[indBul].fire(jetX,jetY);
			
			indBul++;
			if (indBul >= bullets.length) {
				indBul = 0;
				}
		}
		if(sound)
			document.getElementById('rock').play();
		isShooting=false;	
	}else{
		isShooting=false;	
	}
	if (keyID === 13){
		e.preventDefault();
		if(gamePlayed===false && first){
			gamePlayed=true;
			init();
			first=false;
		}
	}
}

function checkKeyUp(e){
	var keyID = (e.keyCode) ? e.keyCode : e.which;
	if (keyID === 38 || keyID === 87){//UP
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68){//Right
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83){//down
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65){//down
		e.preventDefault();
	}
	if (keyID === 32){
		e.preventDefault();
	}
	if (keyID === 13){
		e.preventDefault();
	}
}

function reload(){
	location.reload(); 
}
