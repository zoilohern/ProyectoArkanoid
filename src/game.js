import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform.js";
import { Algoritmo } from "./components/algoritmo.js";

export class Game extends Phaser.Scene{
    constructor(fil,col){
        super({key: 'game'})
        this.fil = fil;
        this.col = col;
        this.base = Math.max(this.fil,this.col);        
        this.premio = 0;
        this.impacthapp = false;
        //this.pausado = false;

        //parseInt(num,this.base)
    }

    init(){
        this.ball = new Ball(this,400,200);
        this.platform = new Platform(this,400,460);
        this.algoritmo = new Algoritmo(this,this.fil,this.col,3);
        console.log("BASE " + this.base)
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
        
        console.log(this.getSituacion());

        this.algoritmo.create();

        console.log(this.algoritmo.Q);

        this.physics.add.collider(this.ball.get(), this.platform.get(), this.impacto, null, this);

        //this.physics.add.collider(this.ball.get(), this.platform.get(), this.algoritmo.impactea, null, this.algoritmo);


        this.ball.setVelocities();
        
        this.cursors = this.input.keyboard.createCursorKeys();        

    }

    update(){

        if(this.spaceKey.isDown && !this.pausado){
            this.scene.pause();
            this.pausado = true;
        }

        if(this.ball.get().body.y==0 && (Math.abs(this.ball.get().body.x-this.exito))<50){
            console.log("exito");
            this.algoritmo.exito();
        }

        if(this.ball.get().body.y>this.platform.get().body.y+20){
            this.reiniciar();
            this.premio = -100;
        }

        //this.platform.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.platform.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.platform.setVelocityX(350);
        }
        this.algoritmo.aprendizaje(this.getSituacion(),this.base);
       // console.log("Pasamos " + this.getSituacion);


    }

    realizarAccion(accion){
        if(accion == 0){
            this.platform.setVelocityX(-850)
        }else if (accion == 1){
           this.platform.setVelocityX(850);//350
        }else if (accion == 2){
            this.platform.setVelocityX(0)
        }
        if(!this.impacthapp){
            this.premio = -0.01;
        }
    }

    impacto(){
        this.premio = 0.02;
        this.impacthapp = true;
       // console.log("JJJEJEJ")
       this.algoritmo.impactea();
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }    

    reiniciar(){
        this.ball.reiniciar();
        this.algoritmo.reiniciar();
        
    }

    //dadas las posiciones de la bola y la plataforma, devuelve un numero que representa la situacion en la que estamos
    getSituacion(){
        var res = "";
       // res = res + this.posBola[0] + this.posBola[1] + this.posPlat;
       res = res + this.ball.coordenadas()[0] + this.ball.coordenadas()[1] + this.platform.coordenada();
        return parseInt(res);
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