export class Ball{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.bounceInPlatform = false;
        this.platform = null;
        /*this.posx = posx;
        this.posy = posy;*/

    }

    create(){
        this.sprite = this.relatedScene.physics.add.image(this.relatedScene.width/2,this.relatedScene.height/5,'ball');
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
            let amountx = (100-50) * (1-amount)+50;
            if(relative<0){
                amountx *= -1;
            }
            this.sprite.setVelocityX(amountx);
            //this.sprite.setVelocityX(amounty)
            let amounty = ((500 - 200) * (amount) + 200) * -1; 
            if (this.sprite.y > this.platform.sprite.y) { 
              amounty *= -1; 
            } 
            this.sprite.body.setVelocityY(amounty); 
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
        const initialXSpeed = (Math.random() * 500 + 50) * (this.randomTwo()); //450 / (Math.floor(Math.random() * 1000)) * this.randomTwo(); //* (this.randomTwo());
        const initialYSpeed = Math.random() * 300 + 200; //450;
        this.sprite.setVelocityX(initialXSpeed);
        this.sprite.setVelocityY(initialYSpeed);
    }

    impact(num){
        this.bounceInPlatform = true;
        if(num==0){
            this.platform = this.relatedScene.platform;
        }else{
            this.platform = this.relatedScene.platform2;
        }
        
    }

    reiniciar(){
        this.sprite.x = this.relatedScene.width/2;
        this.sprite.y = this.relatedScene.height/5;
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
            console.log(-1);
            return -1;
        }else{
            console.log(1);
            return 1;
        }
    }

}
