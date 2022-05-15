
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
        this.posBola = this.coordenadasBola();
        //sprite.tint = 0xff00ff

        this.platform = this.physics.add.image(400,460,'platform').setImmovable();
        this.platform.body.allowGravity = false;
        this.platform.setCollideWorldBounds(true);
        this.posPlat = Math.floor(this.platform.x/this.incrw)

        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.exito = this.getRndInteger(50,this.width-50);
        this.dibujar();
        console.log([this.ball.x,this.ball.y]);
        console.log(this.coordenadasBola());
        
        
        // console.log(this.platform.x);
        //console.log(this.posPlat);
        //console.log(typeof(this.getSituacion()));
        console.log(this.getSituacion());


        this.epsilon = 0.9
        this.total_episodes = 10000
        this.max_steps = 100
        this.alpha = 0.85
        this.gamma = 0.95
        this.Q = Array(this.col*this.fil*this.col);
        for(var i=0; i<this.col*this.fil*this.col; i++) {
            this.Q[i] = new Array(3);
        }

        this.llenarCeros(this.Q);
        console.log(this.Q);

        this.physics.add.collider(this.ball, this.platform, null, null, this);

        const initialXSpeed = Math.random() * 200 + 50;
        const initialYSpeed = Math.random() * 200 + 50;
        this.ball.setVelocityX(initialXSpeed);
        this.ball.setVelocityY(initialYSpeed);


        this.cursors = this.input.keyboard.createCursorKeys();

        

    }

    update(){
        if(this.ball.body.y==0 && (Math.abs(this.ball.body.x-this.exito))<50){
            console.log("exito");
        }

        if(this.ball.body.y>this.platform.body.y+20){
            this.reiniciar();
        }

        this.platform.body.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.platform.body.setVelocityX(-350);
        } else if (this.cursors.right.isDown) {
            this.platform.body.setVelocityX(350);
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
        this.ball.x = 400;
        this.ball.y = 200;
        const initialXSpeed = Math.random() * 200 + 50;
        const initialYSpeed = Math.random() * 200 + 50;
        this.ball.setVelocityX(initialXSpeed);
        this.ball.setVelocityY(initialYSpeed);
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
        //this.graphics.lineStyle(1, 0x00ff00, 1);
        this.graphics.lineStyle(1, 0xff5000,1)
        //this.graphics.lineBetween(50, 0, 50, 500);
        //this.graphics.lineBetween(100, 0, 100, 500);
        //this.graphics.lineBetween(150, 0, 150, 500);
        this.incrw = this.width/this.col;
        this.incrh = this.height/this.fil;
        //console.log(incr);
        for(var i = this.incrw; i<this.width; i= i + this.incrw){
            //console.log("Incr" + i);
            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i<this.height; i= i + this.incrh){
            //console.log("Incr" + i);
            this.graphics.lineBetween(0, i, this.width, i);
        }

        this.graphics.lineStyle(25, 0x1EFA08,2)

        
        /*if (this.exito<this.width/2){
            
        }else{
            this.graphics.lineBetween(this.exito-100, 0, this.exito, 0);
        }*/
        this.graphics.lineBetween(this.exito-50, 0, this.exito+50, 0);
        


    }

    coordenadasBola(){
        var normal =  [this.ball.x,this.ball.y];
        var cuadr = [Math.floor(this.ball.y/this.incrh),Math.floor(this.ball.x/this.incrw)]
        return cuadr;
    }
    
}