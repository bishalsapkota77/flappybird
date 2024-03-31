

import BaseScene from "./BaseScene";

const PIPES_TO_RENDER=4;

class PlayScene extends BaseScene{

    constructor(config){
        super('PlayScene',config);

        this.bird=null;
        this.pipes=null;

        this.pipeVerticalDistanceRange=[150,250];
        this.pipeHorizontalDistanceRange=[500,550];
        this.pipeHorizontalDistance=0;
        this.flapVelocity=300;

        this.score=0;
        this.scoreText='';
        this.scorePosition={x:this.config.width*0.02,y:this.config.height*0.0267 }
        this.pauseButtonPosition={x:this.config.width-10,y:this.config.height-10}
        
    }

create(){
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
    }
update(){
        this.checkGameStatus();
    
        this.recyclePipes();
    }

createBG(){
    this.add.image(this.config.width/2,this.config.height/2,'land')
}

createBird(){
    this.bird=this.physics.add.sprite(this.config.startPosition.x,this.config.startPosition.y,'bird').setOrigin(0)
    this.bird.body.gravity.y=600;
    this.bird.setCollideWorldBounds(true);
}

createPipes(){
    this.pipes= this.physics.add.group();

    for(let i=0; i < PIPES_TO_RENDER; i++){
      const upperPipe= this.pipes.create(0,0,'pipe')
        .setImmovable(true)
        .setOrigin(0,1);
      const lowerPipe= this.pipes.create(0,0,'pipe')
        .setImmovable(true)
        .setOrigin(0,0);
  
      this.placePipes(upperPipe,lowerPipe)
    }
  
    this.pipes.setVelocityX(-200);
}

createColliders(){
    this.physics.add.collider(this.bird,this.pipes, this.gameOver, null,this);
}

createScore(){
  this.score=0;
  const bestScore=localStorage.getItem('bestScore');
  this.scoreText=this.add.text(this.scorePosition.x,this.scorePosition.y, `Score: ${0}`, { fontSize: '32px', fill: '#000'});
  this.add.text(16,45, `Best Score: ${bestScore || 0}`, {fontSize:'20px',fill:'#000'});

}

createPause(){
  const pauseButton=this.add.image(this.pauseButtonPosition.x,this.pauseButtonPosition.y,'pause')
    .setInteractive()
    .setScale(3)
    .setOrigin(1);

    pauseButton.on('pointerdown', ()=> {
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    })
}

handleInputs(){
    this.input.on('pointerdown', this.flap,this);
    this.input.keyboard.on('keydown-J', this.flap,this);
}

checkGameStatus(){
    if(this.bird.getBounds().bottom>=this.config.height || this.bird.y <=0){
        this.gameOver();
    }
}
    
recyclePipes(){
    const tempPipes=[];
    this.pipes.getChildren().forEach(pipe=>{
      if (pipe.getBounds().right < 0){
        tempPipes.push(pipe);
        if(tempPipes.length === 2){
          this.placePipes(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
        }
      }
    })
  }
  
placePipes(uPipe,lPipe){
    
    const rightMostX= this.getRightMostPipe();
    let pipeVerticalDistance= Phaser.Math.Between(...this.pipeVerticalDistanceRange);
    let pipeVerticalPosition=Phaser.Math.Between(0+20, this.config.height-20-pipeVerticalDistance);
    let pipeHorizontalDistance= Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
  
    uPipe.x= rightMostX+pipeHorizontalDistance;
    uPipe.y=pipeVerticalDistance;
  
    lPipe.x=uPipe.x;
    lPipe.y=uPipe.y+pipeVerticalDistance;
  }
  

getRightMostPipe(){
    let rightMostX=0;
  
    this.pipes.getChildren().forEach(function(pipe){
        rightMostX=Math.max(pipe.x, rightMostX);
    })
    return rightMostX ;
  }

saveBestScore(){
  
    const bestScoreText= localStorage.getItem('bestScore');
    const bestScore= bestScoreText && parseInt(bestScoreText, 10);

    if(!bestScore || this.score>bestScore){
      localStorage.setItem('bestScore', this.score);
    }
  }
  
gameOver(){

    this.physics.pause();
    this.bird.setTint(0xEE4824);

    this.saveBestScore();

    this.time.addEvent({
        delay:1000,
        callback:()=>{
            this.scene.restart();
        },
        loop: false
    })
  }
  
flap(){
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore(){
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
  }
}

export default PlayScene;