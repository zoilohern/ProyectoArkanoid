
export class QTable {
  constructor(nActions,json) {  
    this.Q = json;
    this.alpha = 0.1
    this.gamma = 0.9
    this.nActions = nActions;
  }
  
  _checkState(state) {
    let exists = state in this.Q;
    if (!exists) {
      this.Q[state] = new Array(this.nActions).fill(0); // quizás solo habría que modificar esta y alguna linea parecida para tres en raya
    }     
  }
  
  getMaxAction(state) {
    this._checkState(state);
    
    let actions = this.Q[state];
    let argmax = -1;
    let max = -99999999;
    for (let i = 0; i < actions.length; i++) {
      if (actions[i] > max) {
        max = actions[i];
        argmax = i;
      }
    }
    return argmax;    
  }
  
  getRandomAction(state) {
    this._checkState(state);  
    let index = Math.floor(Math.random() * this.nActions);
    return index;
  }  

  updateQTable(state, state2, recompensa, accion, accion2){
      this._checkState(state);
      this._checkState(state2);
      var predic = this.Q[state][accion];
      //console.log("...state = " + state)      
      //console.log("...state2 = " + state2)      
      //console.log("...recompensa = " + recompensa)      
      //console.log("...accion = " + accion)      
      //console.log("...accion2 = " + accion2)
      //console.log("...this.gamma = " + this.gamma)      
      var target = recompensa + this.gamma * this.Q[state2][accion2];
      //console.log("target = " + target)
      this.Q[state][accion] = this.Q[state][accion] + this.alpha * (target - predic);

  }
}



export class Algoritmo {

    constructor(scene,fil,col,nActions){
        this.nEpisode = 0;
        this.relatedScene = scene;
        this.epsilon = 0.1
        this.total_episodes = 10000
        this.max_steps = 100

        this.fil = fil;
        this.col = col;
        this.fol = Math.max(this.fil,this.col)
        this.Q = new QTable(nActions,{})
        this.rew = 0;
        var timer = scene.time.addEvent({
            delay: 5000,                // ms
            callback: this.tiempo,
            //args: [],
            callbackScope: this,
            loop: true
        });
        
        this.total_reward = 0;
    }

    create(){
        console.log("creando tabla con nActions " + this.Q.nActions)
        this.Q = new QTable(this.Q.nActions,{})
    }

    tiempo(){
        //console.log("tabla Q = " + JSON.stringify(this.Q));
    }



    reiniciar(element){
        console.log("END episode = " + this.nEpisode + " reward = " + element.episodeReward); //total reward in episode
        this.total_reward = 0;
        this.nEpisode += 1;
        element.episodeReward = 0; //SE HACE EN PLATFORM (ELEMENTO)
    }

    //Metodos algoritmo
    elegir_Accion(state){
        var accion = 0;
        if(Math.random()<this.epsilon){
            accion = this.Q.getRandomAction(state);
        }else{
            accion = this.Q.getMaxAction(state);
        }
        return accion;
    }

    aprendizaje(element){

        if (this.relatedScene.impacthapp){
          this.addReward(50,element);
          this.relatedScene.impacthapp = false;
        }
        if(this.relatedScene.restarting){
          this.addReward(-100,element);
        }
        if(this.relatedScene.win){
          this.addReward(100,element);
          this.relatedScene.win = false;
        }
        if(element.state1 == null){
          element.state1 = element.getState();
          element.action1 = this.elegir_Accion(element.state1);
        }else{
          let state2 = element.getState();
          if(state2!=element.state1){ // comprobar si se ejecuta en caso de reiniciar??
              let action2 = this.elegir_Accion(state2);
              //console.log(element.stepReward);
              this.Q.updateQTable(element.state1, state2, element.stepReward,element.action1,action2);
              element.stepReward = 0;
              element.state1 = state2;
              element.action1 = action2;
          }
          
      }
        this.relatedScene.doAction(element,element.action1);
        //Reset reward after applying it 
        this.rew = 0;

    }

    addReward(reward,el) {
      /*this.rew += reward;
      this.total_reward += this.rew;*/
      el.stepReward+=reward;
      el.episodeReward+=reward;
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}
