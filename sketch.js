var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pikachu, pikachu_running, pikachu_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var breakerGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var jumpSound, collidedSound;

var exit, exitimg;

localStorage["HighestScore"] = 0;

function preload(){
  pikachu_running =   loadAnimation("pikachu 1.png","pikachu 2.png","pikachu 3.png","pikachu 4.png","pikachu 5.png","pikachu 6.png","pikachu 7.png","pikachu 8.png");
  pikachu_collided = loadAnimation("sad pikachu.png");
  
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  exitimg = loadImage("exit.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  ground = createSprite(width - 700,height + 110 ,width,2);
  ground.addImage("ground",groundImage);
  ground.scale = 8;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.visible = false;
  
  pikachu = createSprite(windowWidth/2,height- 50,20,50);
  
  pikachu.addAnimation("running", pikachu_running);
  pikachu.addAnimation("collided", pikachu_collided);
  pikachu.scale = 0.8;
  
  cloudsGroup = new Group();
  breakerGroup = new Group();
  
  score = 0;
}

function draw() {

  background(255);
  drawSprites();
  stroke("Green");
  noFill();
  textSize(25);
  text("Score: "+ score, width/3,50);

  
  if (gameState===PLAY){

    call_the_clouds();
    call_the_breaker();

    score = score + Math.round(getFrameRate()/60);
  
    pikachu.scale = 0.8;
    
     if((touches.length > 0 || keyDown("SPACE")) && pikachu.y  >= height - 120) {
      jumpSound.play( )
      pikachu.velocityY = -15;
       touches = [];
    }
    
  
    pikachu.velocityY = pikachu.velocityY + 0.8
  
    pikachu.collide(invisibleGround);
   
    if(breakerGroup.isTouching(pikachu)){
        gameState = END;
    }
    
    stroke("Red");
    noFill();
    strokeWeight(2);
    textSize(35)
    text("HP | "+localStorage["HighestScore"], width/10,   55);
    
    if(localStorage["HighestScore"]<score){
    text("HP | "+localStorage["HighestScore"], width/10, 55);
  }
    
  }
  if (gameState === END) {

    pikachu.setCollider("rectangle",0,0,90, 100)
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    pikachu.velocityY = 0;
    breakerGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the pikachu animation
    pikachu.changeAnimation("collided",pikachu_collided);
    pikachu.scale = 0.2;
    
    //set lifetime of the game objects so that they are never destroyed
    breakerGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
    
    stroke("Red");
    noFill();
    strokeWeight(2);
    textSize(35)
    text("HP | "+localStorage["HighestScore"], width/10, 55);
    
  }
  
}

function call_the_clouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = pikachu.depth;
    pikachu.depth = pikachu.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function call_the_breaker() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-105,20,30);
    //obstacle.debug = true;
    obstacle.scale = 0.5;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
    obstacle.scale = 0.9;
    break;
      case 2: obstacle.addImage(obstacle2);
    obstacle.scale = 0.9;
      obstacle.setCollider("rectangle",0,0,100,70);
      break;
      case 3: obstacle.addImage(obstacle3);
    obstacle.scale = 0.9;
      obstacle.setCollider("rectangle",0,0,100,70);
      break;
      case 4: obstacle.addImage(obstacle4);
    obstacle.scale = 1;
      obstacle.setCollider("circle",0,0,30);
      break;
      case 5: obstacle.addImage(obstacle5);
    obstacle.scale = 0.8;
      obstacle.setCollider("rectangle",0,0,140,70);
      break;
      case 6: obstacle.addImage(obstacle6);
      obstacle.scale = 0.9;
      obstacle.setCollider("circle",0,0,30);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.lifetime = 300;
    //add each obstacle to the group
    breakerGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  pikachu.velocityY = 0;  
  breakerGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  pikachu.changeAnimation("running",pikachu_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  } 
  
  score = 0;
  
}
