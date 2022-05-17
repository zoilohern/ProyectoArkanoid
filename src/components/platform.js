export class Platform{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.posx = posx;
        this.posy = posy;
    }

    create(){
        this.platform = this.relatedScene.physics.add.image(this.posx,this.posy,'platform').setImmovable();
        this.platform.body.allowGravity = false;
        this.platform.setCollideWorldBounds(true);
    }

    get(){
        return this.platform;
    }


    setVelocityX(num){
        this.platform.body.setVelocityX(num);
    }

    coordenada(){
        return Math.floor(this.platform.x/this.relatedScene.incrw)
    }

}