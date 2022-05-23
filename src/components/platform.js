export class Platform{

    constructor (scene){
        this.relatedScene = scene;

    }

    create(){
        this.platform = this.relatedScene.physics.add.image(this.relatedScene.width/2,this.relatedScene.height -40,'platform').setImmovable();
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