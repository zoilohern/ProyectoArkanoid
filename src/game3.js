

export class Game extends Phaser.Scene{
    constructor(){
        super({key: 'game'});

    }  
    
    create(){
        this.turnPlayer1 = true;
        this.end = false;
    }

    update(){
        if(this.end){

        }else if (this.turnPlayer1){
            //actua jugador 1
        }else{
            //actua jugador 2
        }
    }

}