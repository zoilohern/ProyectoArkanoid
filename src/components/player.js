function average(p,c,i,a){
    return p + (c/a.length);
}

export class Player{

    constructor (scene,posx,posy,angle){
        this.relatedScene = scene;
        this.action = -1;
        this.state1 = null;
        this.action1 = null;
        this.state0 = null;
        this.action0 = null
        this.stepReward = 0;
        this.episodeReward = 0;
        this.history = "";
        this.lastEpisodeRewards = [];
        this.lastEpisodeRewardsMaxLength = 100;
        this.posx = posx;
        this.posy = posy;
        this.angle = angle;
    }

    create(){
    }
    
    restart(){
        this.state1 = null;
        this.action1 = null;
        this.state0 = null;
        this.action0 = null
        this.stepReward = 0;
        this.episodeReward = 0;
    }

    get(){
        return this.sprite;
    }

    getState(){
        return this.relatedScene.getSituation();
    }

    update(){
        if(this.relatedScene.end){
             this.lastEpisodeRewards.push(this.episodeReward);             
        }
         
        if(this.lastEpisodeRewards.length >= this.lastEpisodeRewardsMaxLength){
            let row = "" + this.relatedScene.nEpisode + "; " + this.relatedScene.sys.game.canvas.width + "; "  + this.relatedScene.sys.game.canvas.height + "; " 
             + this.lastEpisodeRewards.reduce(average, 0); 
            this.history += row + "\n";
            this.lastEpisodeRewards = [];       
        }
    }

    changeAct(act){
        this.action = act;
    }
   

}