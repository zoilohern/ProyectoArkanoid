export class StrategyUpperPlatform{

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
       ball_vy = -ball_vy;
       //let posy = (this.relatedScene.sys.game.canvas.height - 1) - this.relatedScene.ball.coordenadas()[1]  
       let posy = (this.relatedScene.fil  - 1) - this.relatedScene.ball.coordenadas()[0]  
       let res = "_" + posy + "_" + this.relatedScene.ball.coordenadas()[1] +  "_" + this.relatedScene.player2.coordenada()
        + "_"  + ball_vx + "_" + ball_vy;
       return res;
    }
}  