function average(p,c,i,a){
    return p + (c/a.length);
}

export class Platform{

    constructor (scene,posx,posy,angle,strat){
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
        this.posx = posx;
        this.posy = posy;
        this.angle = angle;
        this.strategy = strat;
    }

    create(){
        this.sprite = this.relatedScene.physics.add.image(this.posx,this.posy,'platform').setImmovable();
        this.sprite.body.allowGravity = false;
        this.sprite.setCollideWorldBounds(true);
        this.sprite.angle +=this.angle;
    }
    
    restart(positx,posity){
        this.state1 = null;
        this.action1 = null;
        this.stepReward = 0;
        this.episodeReward = 0;
        this.posx = positx;
        this.posy = posity;
        this.sprite.x = this.posx;
        this.sprite.y = this.posy;
        if(this.lastEpisodeRewards.length >= this.lastEpisodeRewardsMaxLength){
            let row = "" + this.relatedScene.nEpisode + "; " + this.relatedScene.sys.game.canvas.width + "; "  + this.relatedScene.sys.game.canvas.height + "; " 
             + this.lastEpisodeRewards.reduce(average, 0); 
            this.history += row + "\n";
            this.lastEpisodeRewards = [];  
                
        }
    }

    get(){
        return this.sprite;
    }

    getState(){
        return this.strategy.getState(this.relatedScene);
    }

    update(){
        if(this.action == 0){
            this.setVelocityX(0)
        }else if(this.action == 1 ){
            this.setVelocityX(this.vel)
        }else if(this.action == 2){
            this.setVelocityX(-this.vel);
        }

        if(this.relatedScene.restarting || this.relatedScene.win){
             this.lastEpisodeRewards.push(this.episodeReward);             
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