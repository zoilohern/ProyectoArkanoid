import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform2.js";
import { Algoritmo } from "./components/algoritmo2.js";
import { Controller } from "./components/controller.js";

export class Game extends Phaser.Scene{
    constructor(fil,col){
        super({key: 'game'})
        this.fil = fil;
        this.col = col;      
        this.impacthapp = false;
        this.simulating = false;
        this.restarting = false;
        this.controlling = false;
        this.win = false;
        this.nEpisode = 1;
        this.grow = false;
    }
    

    init(){
        this.ball = new Ball(this,400,200);
        this.player1 = new Platform(this,this.sys.canvas.width / 2,this.sys.canvas.height - 40,0);
        this.player2 = new Platform(this,this.sys.canvas.width / 2,40,180);
        this.algoritmo = new Algoritmo(this,this.fil,this.col,3);
        
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
        
        this.exito = this.getRndInteger(this.player1.sprite.width/2,this.width-(this.player1.sprite.width/2));
        this.player1.sprite.x = this.exito;
        //this.draw();
        this.posPlat = this.player1.coordinate();
        this.posBola = this.ball.coordinates();
        console.log(this.posPlat)
        console.log(this.posBola);
        
        console.log(this.getSituation());

        this.algoritmo.create();

        console.log(this.algoritmo.Q);

        this.physics.add.collider(this.ball.get(), this.player1.get(), this.impacto, null, this);
        this.physics.add.collider(this.ball.get(), this.player2.get(), this.impacto2, null, this);


        this.ball.setVelocities();
        
        this.cursors = this.input.keyboard.createCursorKeys();      
        this.controller = new Controller(this,this.cursors);  
    }

    update(){
        if (this.spaceKey.isDown && !this.pausado) {
            this.scene.pause();
            this.pausado = true;
        } 

        if (this.ball.get().body.y>this.player1.get().body.y-5) {
            this.restarting = true;
        }

        this.ball.update();
        if(this.controlling){
            this.controller.update()
        }else{
            this.algoritmo.aprendizaje(this.player1)
        }
        this.player1.update();

        if (this.restarting) {
          this.restart();
        }

    }

    doAction(el,act){
        this.player1.changeAct(act);
    }

    impacto(){
       this.impacthapp = true;
       this.ball.impact(0);
    }

    impacto2(){
        this.win = true;
        this.player2.sprite.x = this.getRndInteger(this.player2.sprite.width/2,this.width-(this.player2.sprite.width/2));
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }    

    restart(){
        this.ball.restart();
        this.player1.restart(this.sys.canvas.width/2,this.sys.canvas.height-40);
        this.algoritmo.restart(this.player1);          
        this.nEpisode += 1; 
        this.restarting = false;
    }

    controll(){
        this.controlling = !this.controlling;
        console.log("Se pulso")
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
