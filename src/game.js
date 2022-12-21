import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform.js";
import { Algoritmo } from "./components/algoritmo1.js";
import { Controller } from "./components/controller.js";

function average(p,c,i,a){
    return p + (c/a.length);
}

export class Game extends Phaser.Scene{
    constructor(fil,col){
        super({key: 'game'})
        this.fil = fil;
        this.col = col;      
        this.impacthapp1 = false;
        this.impacthapp2 = false;
        this.simulating = false;
        this.restarting = false;
        this.controlling = false;
        this.win = false;
        this.nEpisode = 1;
        this.grow = true;
    }
    

    init(){
        this.ball = new Ball(this,this.sys.canvas.width / 2,this.sys.canvas.height / 2);
        this.player1 = new Platform(this,this.sys.canvas.width / 2,this.sys.canvas.height - 40,0);
        this.player2 = new Platform(this,this.sys.canvas.width / 2,40,180);
        this.algoritmo = new Algoritmo(this,this.fil,this.col,3);
        this.algoritmo2 = new Algoritmo(this,this.fil,this.col,3);
        
    }

    preload(){
        this.load.image('platform', 'images/platform.png');
        this.load.image('ball', 'images/ball.png');
    }
    

    create(){
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.incrw = this.width/this.col;
        this.incrh = this.height/this.fil;        

        this.reward = 0;

        this.ball.create();
        this.player1.create();
        this.player2.create();
        
        this.exito = this.getRndInteger(50,this.width-50);
        this.draw();
        this.posPlat = this.player1.coordinate();
        this.posBola = this.ball.coordinates();
        console.log(this.posPlat)
        console.log(this.posBola);        
        console.log(this.getSituation());

        this.algoritmo.create();
        this.algoritmo2.create();

        console.log(this.algoritmo.Q);

        this.physics.add.collider(this.ball.get(), this.player1.get(), this.impact, null, this);
        this.physics.add.collider(this.ball.get(), this.player2.get(), this.impact2, null, this);

        this.ball.setVelocities();
        
        this.cursors = this.input.keyboard.createCursorKeys();      
    }

    update(){
        if (this.spaceKey.isDown && !this.pausado) {
            this.scene.pause();
            this.pausado = true;
        } 


        if (this.ball.get().body.y<this.player2.get().body.y) {
           this.win = true;
        }
        
        if (this.ball.get().body.y>this.player1.get().body.y+5) {
            this.restarting = true;
        }


        this.ball.update();
        if(this.controlling){
            this.controller.update()
        }else{
            this.algoritmo.learning(this.player1)
        }
        this.algoritmo2.learning(this.player2)
        this.player1.update();
        this.player2.update();

        if (this.restarting || this.win) {
          this.restart();
        }

    }

    doAction(el,act){
        el.changeAct(act);
    }

    impact(){
       this.impacthapp1 = true;
       this.ball.impact(0);
    }

    impact2(){
        this.impacthapp2 = true;
        this.ball.impact(1);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }    

    restart(){
        this.ball.restart();
        this.player1.restart(this.sys.canvas.width / 2,this.sys.canvas.height - 40);
        this.player2.restart(this.sys.canvas.width / 2,40);
        this.algoritmo.restart(this.player1);  
        this.algoritmo2.restart(this.player2);
        this.nEpisode += 1;
        this.restarting = false;
        this.win = false; 
        if(this.grow && this.sys.game.canvas.width < 600 && this.player1.lastEpisodeRewards.length >= 100 && this.player1.lastEpisodeRewards.reduce(average,0) >= 100 ){
            console.log("CRECEMOS")           
                
            this.sys.game.scale.resize(this.sys.game.canvas.width + 10, this.sys.game.canvas.height + 10); 
            this.physics.world.setBounds(0, 0, this.sys.game.canvas.width, this.sys.game.canvas.height, true, true, true, true); 
            this.graphics.destroy();
            this.width = this.sys.game.canvas.width;
            this.height = this.sys.game.canvas.height;
            this.incrw = this.width/this.col;
            this.incrh = this.height/this.fil;
            this.draw();
            this.ball.restart();  
            this.player1.restart(this.sys.canvas.width / 2,this.sys.canvas.height  - 40);
            this.player2.restart(this.sys.canvas.width / 2,40);
            
        }
        if(this.player1.lastEpisodeRewards.length >= 100){
            console.log(" LA MEDIA DE LOS ULTIMOS 100 EPISODIOS " + this.player1.lastEpisodeRewards.reduce(average,0)) 
            console.log(" LA MEDIA DE LOS ULTIMOS 100 EPISODIOS " + this.player2.lastEpisodeRewards.reduce(average,0))
            this.player1.lastEpisodeRewards = [];  
            this.player2.lastEpisodeRewards = []; 
        }
        
    }

    controll(){
        this.controlling = !this.controlling;
    }

    getSituation(){
       let ball_vx = this.ball.sprite.body.velocity.x;
       if (ball_vx < 0) {
          ball_vx = -1;
       } else {
          ball_vx = 1
       }
       
       let ball_vy = this.ball.sprite.body.velocity.y;
       if (ball_vy < 0) {
          ball_vy = -1;
       } else {
          ball_vy = 1
       }       
       
       let res = "_" + this.ball.coordinates()[0] + "_" + this.ball.coordinates()[1] + "_" + this.player1.coordinate() + "_" + ball_vx + "_" + ball_vy;
       return res;
    }

    draw(){
        this.graphics = this.add.graphics()
        this.graphics.lineStyle(1, 0xff5000,1)

        for(var i = this.incrw; i < this.width; i = i + this.incrw){

            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i < this.height; i = i + this.incrh){

            this.graphics.lineBetween(0, i, this.width, i);
        }        
    }
    
}
