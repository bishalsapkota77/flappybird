

import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH=800;
const HEIGHT=600;
const BIRD_POSITION={
  x:WIDTH*0.1,y:HEIGHT/2
}

const SHARED_CONFIG={
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes=[PreloadScene,MenuScene,PlayScene,ScoreScene,PauseScene];
const creatScene= Scene=> new Scene(SHARED_CONFIG)
const initScenes=()=> Scenes.map(creatScene)

const config={
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics:{
    default:'arcade',
    arcade:{
      debug:true,
      
    }
  },
  scene:initScenes()
}

new Phaser.Game(config);

