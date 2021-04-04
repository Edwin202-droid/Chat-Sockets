import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../modelos/usuario';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario : Usuario = null;

  constructor(
    private socket: Socket
  ) {
    this.cargarStorage();
    this.checkStatus();
  }


    checkStatus() {

      this.socket.on('connect', () => {
        console.log('Conectado al servidor');
        this.socketStatus = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        this.socketStatus = false;
      });
    }

    /* mandar eventos al servidor */
    emit( evento: string, payload?: any, callback?: Function ) {

      console.log('Emitiendo', evento);
      // emit('EVENTO', payload, callback?)
      this.socket.emit( evento, payload, callback );

    }
    /* escuchar evento del servidor */
    listen( evento: string ) {
      return this.socket.fromEvent( evento );
    }

    loginWS(nombre:string){

      return new Promise<void> ((resolve, reject)=>{
        this.socket.emit('configurar-usuario',{nombre}, resp =>{
          console.log(resp);
          this.usuario = new Usuario(nombre);
          this.guardarStorage();
          resolve();

        });
        
      });
    }

    getUsuario(){
      return this.usuario;
    }


    guardarStorage(){
      localStorage.setItem('usuario', JSON.stringify(this.usuario));
    }

    cargarStorage(){
      if(localStorage.getItem('usuario')){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.loginWS(this.usuario.nombre);
      }
    }

}
