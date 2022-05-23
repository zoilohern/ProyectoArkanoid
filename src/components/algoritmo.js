export class Algoritmo {

    constructor(scene,fil,col,acc){
        this.relatedScene = scene;
        this.epsilon = 0.2
        this.total_episodes = 10000
        this.max_steps = 100
        this.alpha = 0.1
        this.gamma = 0.9
        this.fil = fil;
        this.col = col;
        this.fol = Math.max(this.fil,this.col)
        this.acc = acc;
        this.Q = Array(this.fol*this.fol*this.fol);
        this.rew = -0.01;
        //var timer = scene.time.delayedCall(10000, this.tiempo,null, this);
        var timer = scene.time.addEvent({
            delay: 5000,                // ms
            callback: this.tiempo,
            //args: [],
            callbackScope: this,
            loop: true
        });
    }

    create(){
        this.ultEstado = -1;
        this.ultAccion = -1;
        for(let i=0; i<this.Q.length; i++) {
            this.Q[i] = new Array(this.acc);
        }
        this.llenarCeros(this.Q);
    }

    tiempo(){
        console.log(this.Q);
    }

    llenarCeros(matriz){
        for (let i = 0; i<matriz.length;i++){
            for(let j = 0; j<this.acc;j++){
                matriz[i][j] = 0;
            }
        }
    }

    reiniciar(){
        //this.ultEstado = -1;
        //this.ultAccion = -1;
        this.rew = -100

    }

    //Metodos algoritmo
    elegir_Accion(estado){
        var accion = 0;
        if(Math.random()<this.epsilon){
            accion = this.getRndInteger(0,2);
        }else{
            accion = this.Q[estado].indexOf(Math.max(...this.Q[estado]));
            //accion = Math.max.apply(null,this.q[estado]);
        }
        return accion;
    }

    actualizarTabla(estado,estado2,recompensa,accion,accion2){
        var predic = this.Q[estado][accion];
        var target = recompensa + this.gamma * this.Q[estado2][accion2];
        this.Q[estado][accion] = this.Q[estado][accion] + this.alpha * (target - predic);

    }

    /*aprendizaje(estado){
        var res = 0;
        for(let i = 0; i<this.total_episodes; i++){
            var t = 0;
            this.relatedScene.reiniciar();
            var estadoInicial = this.getSituacion();
            accion1 = this.elegir_Accion(estadoInicial)

            while(t<this.max_steps){

            }
        }
    }*/

    aprendizaje(estadoNoBase,base){
        let estadoBase = parseInt("" + estadoNoBase, base)
        //console.log(estadoBase + " BASESE")
        /*if(this.ultEstado==estadoBase){
            this.relatedScene.realizarAccion(this.ultAccion);
           // console.log("jajajajaj")
        }else*/ if(this.ultEstado == -1){
            this.ultEstado = estadoBase;
            this.ultAccion = this.elegir_Accion(this.ultEstado);
            //console.log(this.ultAccion);
            this.relatedScene.realizarAccion(this.ultAccion);
        }else{
            let estado2 = estadoBase;
            let accion2 = this.elegir_Accion(estado2);
            let rew = this.relatedScene.premio;
            this.actualizarTabla(this.ultEstado,estado2,this.rew,this.ultAccion,accion2);
            //console.log("Se llega aqui con  " + this.rew + "  con la accion " +  this.ultAccion);
            this.ultEstado = estado2;
            this.ultAccion = accion2;
            this.relatedScene.impacthapp = false;
            this.relatedScene.realizarAccion(this.ultAccion);
            this.rew = -0.01
           // 
        }

    }

    impactea(){
        //console.log("SE invoca al collider de algoritmo")
        this.rew = 1;
    }

    exito(){
        this.rew = 100;
    }
    

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}