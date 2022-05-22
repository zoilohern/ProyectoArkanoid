import { Game } from './src/game.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    scene: [new Game(8,8)],
    physics:{
        default: 'arcade',
        arcade:{
            debug:false 
        }
    }
}

var game = new Phaser.Game(config);