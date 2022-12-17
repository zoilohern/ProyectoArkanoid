export class Ball{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.bounceInPlatform = false;
        this.platform = null;
        this.minvx = 200;
        this.maxvx = 300;
        this.minvy = 200;
        this.maxvy = 280;
        /*this.posx = posx;
        this.posy = posy;*/

    }

    create(){
        this.sprite = this.relatedScene.physics.add.image(this.relatedScene.width/2,this.relatedScene.height/2,'ball'); // height /5
        this.sprite.tint = 0x00FFF77;
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(1);
    }
        
    get(){
        return this.sprite;   
    }

    update(){
        if(this.bounceInPlatform){
            let relative = this.sprite.x-this.platform.sprite.x;
            let amount = ((this.platform.sprite.body.width/2) - Math.abs(relative)) / (this.platform.sprite.body.width/2); 
            let amountx = (this.maxvx-this.minvx) * (1-amount) + this.minvx;
            // antes max = 100 min = 50
            if(relative<0){
                amountx *= -1;
            }
            this.setVelocityX(amountx)
            //this.sprite.setVelocityX(amounty)
            let amounty = ((this.maxvy - this.minvy) * (amount) + this.minvy) * -1; 
            // antes max = 500 min = 200
            if (this.sprite.y > this.platform.sprite.y) { 
              amounty *= -1; 
            } 
            this.setVelocityY(amounty)
            this.bounceInPlatform = false;
            //console.log("Se ha ejecutado el impacto")
        }
    }

    setVelocityX(num){
        this.sprite.setVelocityX(num);
    }

    setVelocityY(num){
        this.sprite.setVelocityY(num);
    }

    setVelocities(){
        const initialXSpeed = (Math.floor(Math.random() * (this.maxvx - this.minvx + 1) + this.minvx)) * (this.randomTwo()); //450 / (Math.floor(Math.random() * 1000)) * this.randomTwo(); //* (this.randomTwo());
        const initialYSpeed = (Math.floor(Math.random() * (this.maxvy - this.minvy + 1) + this.minvy)) * (this.randomTwo()); //450;
        //con la formula que se usa se dan velocidades entre max y min.
        //Math.floor(Math.random() * (max - min + 1) + min)
        // Antes (Math.random() * 500 + 50) * this.randomtwo
        this.setVelocityX(initialXSpeed)
        this.setVelocityY(initialYSpeed)
    }

    impact(num){
        this.bounceInPlatform = true;
        if(num==0){
            this.platform = this.relatedScene.player1;
        }else{
            this.platform = this.relatedScene.player2;
        }
        
    }

    reiniciar(){
        this.sprite.x = this.relatedScene.width/2;
        this.sprite.y = this.relatedScene.height/2;
        this.setVelocities();
    }

    coordenadas(){
        let cuadr = [Math.floor(this.sprite.y/this.relatedScene.incrh), Math.floor(this.sprite.x/this.relatedScene.incrw)]
        return cuadr;
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    randomTwo(){
        let valor = this.getRndInteger(0,1);
        if(valor==0){
            //console.log(-1);
            return -1;
        }else{
            //console.log(1);
            return 1;
        }
    }

}
