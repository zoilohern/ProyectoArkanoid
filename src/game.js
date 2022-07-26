import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform.js";
import { Algoritmo } from "./components/algoritmo.js";
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
    }
    

    init(){
        this.ball = new Ball(this,400,200);
        this.platform = new Platform(this,400,460);
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
        this.graphics = this.add.graphics()

        this.reward = 0;

        this.ball.create();
        this.platform.create();
        
        this.exito = this.getRndInteger(50,this.width-50);
        this.dibujar();
        this.posPlat = this.platform.coordenada();
        this.posBola = this.ball.coordenadas();
        console.log(this.posPlat)
        console.log(this.posBola);
        
        console.log(this.getSituation());

        this.algoritmo.create();

        console.log(this.algoritmo.Q);

        this.physics.add.collider(this.ball.get(), this.platform.get(), this.impacto, null, this);


        this.ball.setVelocities();
        
        this.cursors = this.input.keyboard.createCursorKeys();      
        this.controller = new Controller(this,this.cursors);  

    }

    update(){
        if (this.spaceKey.isDown && !this.pausado) {
            this.scene.pause();
            this.pausado = true;
        } 


        // Touch objective
        if (this.ball.get().body.y==0 && (Math.abs(this.ball.get().body.x-this.exito))<50) {
           // this.algoritmo.addReward(100);
           this.win = true;
        }
        
        // Touch ball
       /* if (this.impacthapp) {
          this.algoritmo.addReward(50);
          this.impacthapp = false;
        }*/

        // Loose
        if (this.ball.get().body.y>this.platform.get().body.y-5) {
            //this.algoritmo.addReward(-10000);
            this.restarting = true;
        }

        this.ball.update();
        if(this.controlling){
            this.controller.update()
        }else{
            this.algoritmo.aprendizaje(this.platform)
        }
        this.platform.update();
        //this.algoritmo.aprendizaje(this.getSituacion());


        if (this.restarting) {
          this.restarting = false;
          this.reiniciar();
        }

    }

    realizarAccion(accion){
        /*if (accion == 0) {
            this.platform.setVelocityX(-850);
        } else if (accion == 1) {
           this.platform.setVelocityX(850);//350
        } else if (accion == 2) {
            this.platform.setVelocityX(0);
        }*/
        this.platform.changeAct(accion);
    }

    impacto(){
       this.impacthapp = true;
       this.ball.impact();
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }    

    reiniciar(){
        this.ball.reiniciar();
        this.algoritmo.reiniciar(this.platform);  
    }

    controll(){
        this.controlling = !this.controlling;
        console.log("Se pulso")
    }

    //dadas las posiciones de la bola y la plataforma, devuelve un numero que representa la situacion en la que estamos
    getSituation(){  //TODO -> Debería ser getEstado
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
