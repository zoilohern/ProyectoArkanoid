export class StrategyLowerPlatform{
   
    constructor(scene){
        this.relatedScene = scene;
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
       
       let res = "_" + this.relatedScene.ball.coordinates()[0] + "_" + this.relatedScene.ball.coordinates()[1] + "_" + this.relatedScene.player1.coordinate()
        + "_"  + ball_vx + "_" + ball_vy;
       return res;
    }

}