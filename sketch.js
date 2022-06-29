var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,height-50,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(windowWidth,windowHeight-40,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2;

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(windowWidth/2,windowHeight-40,4000,10);
  invisibleGround.visible = false;
  

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  score = 0;
  
}

function draw() {
  
  background(180);
  text("Pontuação: "+ score, width-100, 50)
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if(touches.length>0 || keyDown("space") && trex.y >= height-75) {
        trex.velocityY = -12;
        jumpSound.play();
      }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  if( touches.legth>0||mousePressedOver(restart)) {
      reset();
      touches = []
    }


  drawSprites();
}

function reset(){
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
gameState = PLAY;
restart.visible = false;
gameOver.visible = false;
score = 0;
trex.changeAnimation("running", trex_running);

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width+10,height-50,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width-20,height-(height-100),40,10);
    cloud.y = Math.round(random(80,height-100));
    cloud.addImage(cloudImage);
    cloud.scale = 1.8;
    cloud.velocityX = -3;
    
    cloud.lifetime = 2000;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

