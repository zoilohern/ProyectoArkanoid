import { Algoritmo } from "./components/algoritmo3.js";
import { Player } from "./components/player.js";

export class Game extends Phaser.Scene{
    constructor(){
        super({key: 'game'});

    }  

    init(){
        this.player1 = new Player(this,0,0,0)
        this.player2 = new Player(this,0,0,1)
        this.algoritmo = new Algoritmo(this,this.fil,this.col,9);
        this.algoritmo2 = new Algoritmo(this,this.fil,this.col,9);
    }
    
    create(){
        this.nEpisode = 0;
        this.move = 0;
        this.controlling = false;
        this.restarting = false;
        this.restartingAll = false;
        this.win = false;
        this.turnPlayer1 = true;
        this.end = false;
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        this.incrw = this.width / 3;
        this.incrh = this.height / 3;
        this.impacthapp = false;
        this.drawBoard();
        this.board = [0,0,0,0,0,0,0,0,0];
        console.log(this.getSituation())
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){         
        if(this.move>=5 && this.finish() != 0){
            this.end = true;
            this.nEpisode++;
            if(this.finish()==1){
                this.win = true;
                if(!this.controlling){
                    this.algoritmo.learning(this.player1)
                }  
                this.algoritmo2.learning(this.player2);
                this.player1.update()
                this.player2.update()
                this.win = false;
            }else{
                this.restarting = true;
                if(!this.controlling){
                    this.algoritmo.learning(this.player1)
                }  
                this.algoritmo2.learning(this.player2);
                this.player1.update()
                this.player2.update()  
                this.restarting = false;
            }
            this.algoritmo.restart(this.player1);
            this.algoritmo2.restart(this.player2);
            this.player1.restart()
            this.player2.restart()
            console.log("GANA" + this.finish())
            this.clear();
            this.drawBoard();
            this.board = [0,0,0,0,0,0,0,0,0]
            this.move = 0;           
            this.end = false;
           
        }else if (this.move>=9){
            this.nEpisode++
            this.end = true;
            this.impacthapp = true;
            if(!this.controlling){
                this.algoritmo.learning(this.player1)
            }            
            this.algoritmo2.learning(this.player2);
            this.player1.update()
            this.player2.update()
            this.algoritmo.restart(this.player1);
            this.algoritmo2.restart(this.player2);    
            this.player1.restart()
            this.player2.restart()
            this.impacthapp = false;
            this.end = false;
            this.clear();
            this.drawBoard();
            this.board = [0,0,0,0,0,0,0,0,0]
            this.move = 0;
            console.log("EMPATE")
        }else if (this.turnPlayer1){
            if(this.controlling){
                this.playerchoice();
            }else{
                this.algoritmo.learning(this.player1)
            }
            
        }else{
            this.algoritmo2.learning(this.player2);
        }
       
    }

    playerchoice(){
        let game = this;
        let correct = false;
        
            game.input.on('pointerdown',function(pointer){
                    let action = Math.floor(pointer.y / game.incrw) * 3 + Math.floor(pointer.x / game.incrh);
                    if(game.isFree(action)){
                        game.drawX(Math.floor(pointer.y / game.incrw),Math.floor(pointer.x / game.incrh));
                        console.log(action)
                        game.board[action] = 1;
                        game.move++;
                        game.turnPlayer1 = false;
                        correct = true;
                    }
                    
            })     
    }

    controll(){
        this.controlling = !this.controlling;
    }

    clear(){
        this.graphics.destroy();
    }

    finish(){
        if(this.checkRow() != 0){
            return this.checkRow();           
        }else if (this.checkCol() != 0){
            return this.checkCol();
        }else if(this.checkDiag() != 0){
            return this.checkDiag();
        }else{
            return 0;
        }
    }

    checkRow(){
       let res = 0;
        for(let i = 0; i<this.board.length; i += 3){
            if(this.board[i] == this.board[i+1] && this.board[i] == this.board[i+2]){
                res = this.board[i];
                break;
            }
        }
        return res;
    }

    checkCol(){
      let res = 0;
        for(let i = 0; i<3; i++){
            if(this.board[i] == this.board[i+3] && this.board[i] == this.board[i+6]){
                res = this.board[i];
                break;
            }
        }
        return res; 
    }

    checkDiag(){
        let res = 0;
        for(let i = 2; i<5; i += 2){
            if(this.board[4] == this.board[4-i] && this.board[4] == this.board[4+i]){
                res = this.board[i];
                break;
            }
        }
        return res;
    }

    translate(act){
        return[Math.floor(act/3),act%3];
    }

    doAction(el,action){
        if(this.turnPlayer1){
            if(this.isFree(action)){
                this.board[action] = 1;
                let pos = this.translate(action)
                this.drawX(pos[0],pos[1])
                this.move++;
                this.turnPlayer1 = false;
            }else{
                this.restarting = true;
            }
        }else{
            if(this.isFree(action)){
                this.board[action] = 2;
                let pos = this.translate(action)
                this.drawO(pos[0],pos[1])
                this.move++;
                this.turnPlayer1 = true;
            }else{
                this.win = true;
            }
        }
    }

    isFree(act){
        return this.board[act] == 0 
    }

    drawBoard(){
        this.graphics = this.add.graphics()
		this.graphics.lineStyle(3, 0xffffff, 1)
		for(var i = this.incrw; i<this.width; i = i + this.incrw){
            this.graphics.lineBetween(i, 0, i, this.height);
        }

        for(var i = this.incrh; i<this.height; i = i + this.incrh){
            this.graphics.lineBetween(0, i, this.width, i);
        }
	}
    
    drawX(i , j){
		this.graphics.lineStyle(5, 0xd50102, 1)
		this.graphics.beginPath()
		this.graphics.moveTo((j * this.incrw) + 5, (i * this.incrh) + 5)
		this.graphics.lineTo(((j + 1) * this.incrw) - 5, ((i + 1) * this.incrh) - 5)
		this.graphics.moveTo(((j + 1) * this.incrw) - 5, (i * this.incrh) + 5)
		this.graphics.lineTo((j * this.incrw) + 5, ((i + 1) * this.incrh) - 5)
		this.graphics.closePath()
		this.graphics.strokePath()

	}

    drawO(i, j){
		this.graphics.lineStyle(5, 0xa6b401, 1)
		this.graphics.beginPath()
		const radius = Math.min(this.incrh,this.incrw) / 2 -5;		
		let centerX = ((j + 1) * this.incrw) - (this.incrw / 2)
		let centerY = ((i + 1) * this.incrh) - (this.incrh / 2)
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