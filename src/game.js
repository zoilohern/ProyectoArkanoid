
export class Game extends Phaser.Scene{
    constructor(fil,col){
        super({key: 'game'})
        this.fil = fil;
        this.col = col;
    }

    init(){
        
    }

    preload(){
        this.load.image('platform', 'images/platform.png');
        this.load.image('ball', 'images/ball.png');
    }
    

    create(){
        this.graphics = this.add.graphics()
        this.ball = this.physics.add.image(400,200,'ball');
        this.ball.tint = 0x00FFF77;
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
        this.platform = this.physics.add.image(400,460,'platform').setImmovable();
        this.platform.body.allowGravity = false;
        //sprite.tint = 0xff00ff
        this.platform.setCollideWorldBounds(true);
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.dibujar();
        console.log([this.ball.x,this.ball.y]);
        console.log(this.coordenadasBola());
        this.posBola = this.coordenadasBola();
        this.posPlat = Math.floor(this.platform.x/this.incrw)
        // console.log(this.platform.x);
        //console.log(this.posPlat);
        //console.log(typeof(this.getSituacion()));
        console.log(this.getSituacion());
        this.epsilon = 0.9
        this.total_episodes = 10000
        this.max_steps = 100
        this.alpha = 0.85
        this.gamma = 0.95
        this.Q = Array(3);
        for(var i=0; i<3; i++) {
            this.Q[i] = new Array(this.col*this.fil*this.col);
        }
        this.llenarCeros(this.Q);
        console.log(this.Q);

    }

    update(){

    }


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
        var predic = this.Q[accion][estado];
        var target = recompensa + this.gamma * this.Q[accion2][estado2];
        this.Q[accion][estado] = this.Q[accion][estado] + this.alpha * (target - predic);

    }

    reiniciar(){
        this.ball.x = 400;
        this.ball.y = 200;
        this.platform.x = 400;
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


    llenarCeros(matriz){
        for (let i = 0; i<3;i++){
            for(let j = 0; j<this.col*this.fil*this.col;j++){
                matriz[i][j] = 0;
            }
        }
    }

    getSituacion(){
        var res = "";
        res = res + this.posBola[0] + this.posBola[1] + this.posPlat;
        return parseInt(res);
    }


    dibujar(){
        //this.graphics.lineStyle(1, 0x00ff00, 1);
        this.graphics.lineStyle(1, 0xff5000,1)
        //this.graphics.lineBetween(50, 0, 50, 500);
        //this.graphics.lineBetween(100, 0, 100, 500);
        //this.graphics.lineBetween(150, 0, 150, 500);
        this.incrw = this.width/this.col;
        this.incrh = this.height/this.fil;
        //console.log(incr);
        for(var i = this.incrw; i<this.width; i= i + this.incrw){
            console.log("Incr" + i);
            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i<this.height; i= i + this.incrh){
            console.log("Incr" + i);
            this.graphics.lineBetween(0, i, this.width, i);
        }



    }

    coordenadasBola(){
        var normal =  [this.ball.x,this.ball.y];
        var cuadr = [Math.floor(this.ball.y/this.incrh),Math.floor(this.ball.x/this.incrw)]
        return cuadr;
    }
    
}