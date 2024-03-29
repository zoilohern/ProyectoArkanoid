function average(p,c,i,a){
    return p + (c/a.length);
}

export class Platform{

    constructor (scene,posx,posy,angle){
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
    }

    create(){
        this.sprite = this.relatedScene.physics.add.image(this.posx,this.posy,'platform').setImmovable();
        this.sprite.body.allowGravity = false;
        this.sprite.setCollideWorldBounds(true);
        this.sprite.angle +=this.angle;
        //this.sprite.setScale(.75);
    }
    
    restart(positx,posity){
        
        if(this.relatedScene.restarting || this.relatedScene.win){ // EP:, W:, H:, R:
            /*this.history += "" + this.relatedScene.nEpisode
             + ", " + this.relatedScene.sys.game.canvas.width + ", "  + this.relatedScene.sys.game.canvas.height + ", "  + this.episodeReward + "\n";*/
             this.lastEpisodeRewards.push(this.episodeReward);
             
             //this.episodeReward = 0;  se hace en el algoritmo

             if(this.lastEpisodeRewards.length >= this.lastEpisodeRewardsMaxLength){
                let row = "" + this.relatedScene.nEpisode + "; " + this.relatedScene.sys.game.canvas.width + "; "  + this.relatedScene.sys.game.canvas.height + "; " 
                 + this.lastEpisodeRewards.reduce(average, 0); 
                 
                this.history += row + "\n";
                //this.lastEpisodeRewards = [];       
            }      
        }       

        this.state1 = null;
        this.action1 = null;
        this.stepReward = 0;
        //this.episodeReward = 0;
        this.posx = positx;
        this.posy = posity
        this.sprite.x = this.posx;
        this.sprite.y = this.posy;
    }

    get(){
        return this.sprite;
    }

    getState(){
        let ball_vx = this.relatedScene.ball.sprite.body.velocity.x;
       if (ball_vx < 0) {
          ball_vx = -1;
       } else {
          ball_vx = 1
       }
       
       let ball_vy = this.relatedScene.ball.sprite.body.velocity.y;
       if (ball_vy < 0) {
          ball_vy = -1;
       } else {
          ball_vy = 1
       }       
       
       let res = "_" + this.relatedScene.ball.coordenadas()[0] + "_" + this.relatedScene.ball.coordenadas()[1] + "_" + this.coordenada() + "_"  + ball_vx + "_" + ball_vy;
       return res;
    }

    update(){
        if(this.action == 0){
            this.setVelocityX(0)
        }else if(this.action == 1 ){
            this.setVelocityX(this.vel)
        }else if(this.action == 2){
            this.setVelocityX(-this.vel);
        }
        //console.log(this.episodeReward)
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