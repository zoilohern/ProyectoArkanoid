export class Controller{

    constructor(scene,cur){
        this.relatedScene = scene;
        this.cursors = cur;
    }

    update(){
        if(this.cursors.left.isDown){
            this.relatedScene.platform.changeAct(2)
        }else if (this.cursors.right.isDown){
            this.relatedScene.platform.changeAct(1)
        }else{
            this.relatedScene.platform.changeAct(0)
        }
    }

    /*aprendizaje(estadoActual){

        if (this.relatedScene.impacthapp){
          this.addReward(50);
          this.relatedScene.impacthapp = false;
        }
        if(this.relatedScene.restarting){
          this.addReward(-10000);
        }
        if(this.relatedScene.win){
          this.addReward(100);
          this.relatedScene.win = false;
        }
        if (estadoActual == this.ultEstado) {
          this.accion2 = this.ultAccion;
          return
        }

        if(this.ultEstado == -1){
            this.ultEstado = estadoActual;
            this.ultAccion = this.elegir_Accion(this.ultEstado);
            
        }else{
            let estado2 = estadoActual;
            let accion2 = this.elegir_Accion(estado2);
            this.Q.updateQTable(this.ultEstado, estado2, this.rew, this.ultAccion, accion2);
            this.ultEstado = estado2;
            this.ultAccion = accion2;
        }
        this.relatedScene.realizarAccion(this.ultAccion);
        //Reset reward after applying it 
        this.rew = 0;

    }*/
}