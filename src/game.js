import { Ball } from "./components/ball.js";
import { Platform } from "./components/platform.js";

export class Game extends Phaser.Scene{
    constructor(fil,col){
        super({key: 'game'})
        this.fil = fil;
        this.col = col;
    }

    init(){
        this.ball = new Ball(this,400,200);
        this.platform = new Platform(this,400,460);

    }

    preload(){
        this.load.image('platform', 'images/platform.png');
        this.load.image('ball', 'images/ball.png');
    }
    

    create(){
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.incrw = this.width/this.col;
        this.incrh = this.height/this.fil;
        this.graphics = this.add.graphics()

        this.ball.create();
        this.platform.create();
        
        this.exito = this.getRndInteger(50,this.width-50);
        this.dibujar();
        this.posPlat = this.platform.coordenada();
        this.posBola = this.ball.coordenadas();
        console.log(this.posPlat)
        console.log(this.posBola);
        
        console.log(this.getSituacion());


        this.epsilon = 0.9
        this.total_episodes = 10000
        this.max_steps = 100
        this.alpha = 0.85
        this.gamma = 0.95
        this.Q = Array(this.col*this.fil*this.col);
        for(var i=0; i<this.Q.length; i++) {
            this.Q[i] = new Array(3);
        }

        this.llenarCeros(this.Q);
        console.log(this.Q);

        this.physics.add.collider(this.ball.get(), this.platform.get(), null, null, this);

        this.ball.setVelocities();
        
        this.cursors = this.input.keyboard.createCursorKeys();        

    }

    update(){
        if(this.ball.get().body.y==0 && (Math.abs(this.ball.get().body.x-this.exito))<50){
            console.log("exito");
        }

        if(this.ball.get().body.y>this.platform.get().body.y+20){
            this.reiniciar();
        }

        this.platform.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.platform.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.platform.setVelocityX(350);
        }


    }

    //Metodos algoritmo
    elegir_Accion(estado){
        var accion = 0;
        if(Math.random()<this.epsilon){
            accion = this.getRndInteger(0,2);
        }else{
            accion = Math.max(...this.Q[estado]);
            //accion = Math.max.apply(null,this.q[estado]);
        }
        return accion;
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    actualizarTabla(estado,estado2,recompensa,accion,accion2){
        var predic = this.Q[estado][accion];
        var target = recompensa + this.gamma * this.Q[estado2][accion2];
        this.Q[estado][accion] = this.Q[estado][accion] + this.alpha * (target - predic);

    }

    reiniciar(){
        this.ball.reiniciar();
        
    }

    aprendizaje(){
        var res = 0;
        for(let i = 0; i<this.total_episodes; i++){
            var t = 0;
            this.reiniciar();
            var estadoInicial = this.getSituacion();
            accion1 = this.elegir_Accion(estadoInicial)

            while(t<this.max_steps){

            }
        }
    }

    realizarAccion(accion){
        if(accion == 0){
            //mover izquierda
        }else if (accion == 1){
            //mover derecha
        }else if (accion == 3){
            // quieto
        }
    }

    //crear la matriz con ceros
    llenarCeros(matriz){
        for (let i = 0; i<this.col*this.fil*this.col;i++){
            for(let j = 0; j<3;j++){
                matriz[i][j] = 0;
            }
        }
    }

    //dadas las posiciones de la bola y la plataforma, devuelve un numero que representa la situacion en la que estamos
    getSituacion(){
        var res = "";
        res = res + this.posBola[0] + this.posBola[1] + this.posPlat;
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