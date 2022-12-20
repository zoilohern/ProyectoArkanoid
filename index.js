import { Game } from './src/game.js';
//import { Game } from './src/game2.js'
//import { Game } from './src/game3.js'
//import { Game } from './src/gameshared.js'
import { QTable } from './src/components/algoritmo1.js'

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    scene: [new Game(8,8)],
    physics:{
        default: 'arcade',
        arcade:{
            debug:false       
        },

    }
}

var game = new Phaser.Game(config);
console.log("game.loop._target = " + game.loop._target)
//game.loop._target = 1
console.log("game.loop._target = " + game.loop._target)





function mysimulation() {
  for (let i = 0; i < 100; i++) {
    window.requestAnimationFrame(function () { 
      game.simulate(delta);
    });   
  }

  if (game.simulating) {
    setTimeout(mysimulation, 0);
  }
}

function download(content,mimeType,filename){
  const a = document.createElement('a')  
  const blob = new Blob([content], {type: mimeType}) 
  const url = URL.createObjectURL(blob) 
  a.setAttribute('href', url) 
  a.setAttribute('download', filename) 
  a.click() 
}


let delta = 16.6;
document.getElementById("start_simulation").onclick = function() {
  game.simulating = true;
  console.log("STARTING SIMULATION");
  setTimeout(mysimulation, 0);

};

document.getElementById("stop_simulation").onclick = function() {
    game.simulating = false;
    console.log("STOPPING SIMULATION"); 
    game.stopSimulation()
};

document.getElementById("change_player").onclick = function(){
  game.scene.getScene("game").controll();
};

document.getElementById("download_history").onclick = function() { 
  download(game.scene.getScene("game").player1.history, 'text/plain', "history.txt"); 
}; 

document.getElementById("download_algorithm").onclick = function() { 
  download(JSON.stringify(game.scene.getScene("game").algoritmo.Q.Q), 'text/plain', "algorithm.txt"); 
}; 

document.getElementById("load_algorithm").onclick = function() { 
  try { 
    console.log(game.scene.getScene("game").algoritmo.Q)
    const reader = new FileReader();
    if( document.getElementById("algorithm_json").files.length == 0 ){
      alert("Must select algorithm to load");
    }else{
      let file = document.getElementById("algorithm_json").files[0]; 
      reader.readAsText(file); 
      reader.onload = function() { 
        let loaded = reader.result; 
        //console.log(game.scene.getScene("game").algoritmo.Q)
        game.scene.getScene("game").algoritmo.Q.Q = JSON.parse(loaded)
        //console.log(game.scene.getScene("game").algoritmo.Q)
        console.log("LOAD Q = " + loaded); 
        game.scene.getScene("game").reiniciar();
    }
    
    }        
  } catch(err) { 
       console.error("ERROR: " + err);
  } 

}
//**/




