

export class Game extends Phaser.Scene{
    constructor(){
        super({key: 'game'});

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
        this.drawX(2,0)
        this.drawO(1,0)
    }

    update(){
        if(this.end){

        }else if (this.turnPlayer1){
            //actua jugador 1
        }else{
            //actua jugador 2   
        }
    }

    doAct(action){
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

}