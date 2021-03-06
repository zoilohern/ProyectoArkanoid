import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform.js";
import { Algoritmo } from "./components/algoritmo1.js";
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
        this.platform = new Platform(this,this.sys.canvas.width/2,this.sys.canvas.height-40,0);
        this.platform2 = new Platform(this,this.sys.canvas.width/2,40,180);
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
        this.platform.create();
        this.platform2.create();
        
        this.exito = this.getRndInteger(50,this.width-50);
        this.dibujar();
        this.posPlat = this.platform.coordenada();
        this.posBola = this.ball.coordenadas();
        console.log(this.posPlat)
        console.log(this.posBola);
        
        console.log(this.getSituation());

        this.algoritmo.create();
        this.algoritmo2.create();

        console.log(this.algoritmo.Q);

        this.physics.add.collider(this.ball.get(), this.platform.get(), this.impacto, null, this);
        this.physics.add.collider(this.ball.get(), this.platform2.get(), this.impacto2, null, this);

        this.ball.setVelocities();
        
        this.cursors = this.input.keyboard.createCursorKeys();      
        this.controller = new Controller(this,this.cursors);  
        var timer = this.time.delayedCall(5000,this.tiempo,null,this)

    }

    tiempo(){        
            this.sys.game.scale.resize(this.sys.game.canvas.width + 100, this.sys.game.canvas.height + 100); 
            this.physics.world.setBounds(0, 0, this.sys.game.canvas.width, this.sys.game.canvas.height, true, true, true, true); 
            this.graphics.destroy();
            this.width = this.sys.game.canvas.width;
            this.height = this.sys.game.canvas.height;
            this.incrw = this.width/this.col;
            this.incrh = this.height/this.fil;
            this.dibujar();
            this.ball.reiniciar();
            this.platform.restart();
            this.platform.lastEpisodeRewards = [];                 
    }

    update(){
        if (this.spaceKey.isDown && !this.pausado) {
            this.scene.pause();
            this.pausado = true;
        } 


        // Touch objective
        if (this.ball.get().body.y<this.platform2.get().body.y) {
           // this.algoritmo.addReward(100);
           this.win = true;
        }
        
        // Loose
        if (this.ball.get().body.y>this.platform.get().body.y+5) {
            //this.algoritmo.addReward(-10000);
            this.restarting = true;
        }

        this.ball.update();
        if(this.controlling){
            this.controller.update()
        }else{
            this.algoritmo.aprendizaje(this.platform)
        }
        this.algoritmo2.aprendizaje(this.platform2)
        this.platform.update();
        this.platform2.update();
        //this.algoritmo.aprendizaje(this.getSituacion());


        if (this.restarting || this.win) {
          this.restarting = false;
          this.win = false;
          this.reiniciar();
        }

    }

    doAction(el,act){
        el.changeAct(act);
    }

    impacto(){
       this.impacthapp = true;
       this.ball.impact(0);
    }

    impacto2(){
        this.impacthapp = true;
        this.ball.impact(1);
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }    

    reiniciar(){
        this.ball.reiniciar();
        this.algoritmo.reiniciar(this.platform);  
        this.algoritmo2.reiniciar(this.platform2);
        this.nEpisode += 1; 
    }

    controll(){
        this.controlling = !this.controlling;
        console.log("Se pulso")
    }

    //dadas las posiciones de la bola y la plataforma, devuelve un numero que representa la situacion en la que estamos
    getSituation(){  //TODO -> Deber??a ser getEstado
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
       
       let res = "_" + this.ball.coordenadas()[0] + "_" + this.ball.coordenadas()[1] + "_" + this.platform.coordenada() + "_" + ball_vx + "_" + ball_vy;
       return res;
    }

    //Dibuja las lineas para poder representar 
    dibujar(){
        this.graphics = this.add.graphics()
        this.graphics.lineStyle(1, 0xff5000,1)


        for(var i = this.incrw; i<this.width; i= i + this.incrw){

            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i<this.height; i= i + this.incrh){

            this.graphics.lineBetween(0, i, this.width, i);
        }

        this.graphics.lineStyle(25, 0x1EFA08,2)
        this.graphics.lineBetween(this.exito-50, 0, this.exito+50, 0);
        
    }
    
}
