import { Algoritmo } from "./components/algoritmo.js";
import { Player } from "./components/player.js";

export class Game extends Phaser.Scene{
    constructor(){
        super({key: 'game'});

    }  

    init(){
        this.player1 = new Player(this,0,0,0)
        this.player2 = new Player(this,0,0,0)
        this.algoritmo = new Algoritmo(this,this.fil,this.col,9);
        this.algoritmo2 = new Algoritmo(this,this.fil,this.col,9);
    }
    
    create(){
        this.turnPlayer1 = true;
        this.end = false;
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.incrw = this.width/3;
        this.incrh = this.height/3;
        this.graphics = this.add.graphics()
        this.drawBoard();
        this.board = [0,0,0,0,0,0,0,0,0];
        this.drawX(2,0)
        this.drawO(1,0)
        console.log(this.getSituation())
    }

    update(){
        if(this.end){
            //reiniciar
        }else if (this.turnPlayer1){
            this.algoritmo.aprendizaje(this.player1)
        }else{
            this.algoritmo2.aprendizaje(this.player2);
        }
    }

    doAction(el,action){
        if(this.turnPlayer1){
            
        }else{

        }
    }

    drawBoard(){
		this.graphics.lineStyle(3, 0xffffff, 1)
		for(var i = this.incrw; i<this.width; i= i + this.incrw){
            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i<this.height; i= i + this.incrh){
            this.graphics.lineBetween(0, i, this.width, i);
        }
	}
    
    drawX(i , j){
		this.graphics.lineStyle(5, 0xd50102, 1)
		this.graphics.beginPath()
		
		// Draw X
		this.graphics.moveTo((j*this.incrw)+5, (i * this.incrh)+5)
		this.graphics.lineTo(((j+1)*this.incrw)-5, ((i+1)*this.incrh)-5)
		this.graphics.moveTo(((j+1)*this.incrw)-5, (i*this.incrh)+5)
		this.graphics.lineTo((j*this.incrw)+5, ((i+1)*this.incrh)-5)
		this.graphics.closePath()
		this.graphics.strokePath()

	}

    drawO(i, j){
		this.graphics.lineStyle(5, 0xa6b401, 1)
		this.graphics.beginPath()

		const radius = Math.min(this.incrh,this.incrw)/2 -5;
		
		// Draw O
		let centerX = ((j+1)*this.incrw)-(this.incrw/2)
		let centerY = ((i+1)*this.incrh)-(this.incrh/2)
		this.graphics.closePath()
		this.graphics.strokeCircle(centerX, centerY, radius)
	}

    getSituation(){
        let res = "";
        this.board.forEach(myFunction)
        function myFunction(value, index, array) {
            res += "_" +value;
          }
        return res;
    }

}