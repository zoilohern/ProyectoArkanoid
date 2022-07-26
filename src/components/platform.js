export class Platform{

    constructor (scene,posx,posy){
        this.relatedScene = scene;
        this.action = -1;
        this.vel = 850;
        this.state1 = null;
        this.action1 = null;
        this.stepReward = 0;
        this.episodeReward = 0;
        this.history = "";
        this.lastEpisodeRewards = [];
        this.lastEpisodeRewardsMaxLength = 100;
        /*this.posx = posx;
        this.posy = posy;*/
    }

    create(){
        this.sprite = this.relatedScene.physics.add.image(this.relatedScene.width/2,this.relatedScene.height -40,'platform').setImmovable();
        this.sprite.body.allowGravity = false;
        this.sprite.setCollideWorldBounds(true);
    }

    get(){
        return this.sprite;
    }

    getState(){
        return this.relatedScene.getSituation();
    }

    update(){
        if(this.action == 0){
            this.setVelocityX(0)
        }else if(this.action == 1 ){
            this.setVelocityX(this.vel)
        }else if(this.action == 2){
            this.setVelocityX(-this.vel);
        }
        if(this.lastEpisodeRewards.length >= this.lastEpisodeRewardsMaxLength){
            
        }
    }

    changeAct(act){
        this.action = act;
    }


    setVelocityX(num){
        this.sprite.body.setVelocityX(num);
    }

    coordenada(){
        return Math.floor(this.sprite.x/this.relatedScene.incrw)
    }
    

}