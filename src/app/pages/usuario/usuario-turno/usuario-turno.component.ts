import { Component, Input, OnInit } from '@angular/core';
import { AccionesTurnos } from 'src/app/enums/acciones-turnos';
import { EstadoTurno } from 'src/app/enums/estado-turno';
import { Turno } from 'src/app/models/turno';
import { AuthService } from 'src/app/services/auth.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-turno',
  templateUrl: './usuario-turno.component.html',
  styleUrls: ['./usuario-turno.component.scss']
})
export class UsuarioTurnoComponent implements OnInit{


    @Input() accion: string = '';
    @Input() turno!: Turno;

    usuarioConectado = this.authSrv.logInfo();

    Titulo = 'Mis turnos';

    //Controles

    tituloUsuario: any;

    constructor(private srvTurnos: TurnosService,
                private srvMensajes: MensajesService,
                private authSrv: AuthService) { }

    //Paciente
    verCancelarTurno: boolean = false;

    verCompletarEncuesta: boolean = false;
    verCalificarAtencion: boolean = false;
    //Especialista

    verAceptarTurnoEspecialista: boolean = false;
    verRechazarTurnoEspecialista: boolean = false;
    verFinalizarTurnoEspecialista: boolean = false;
    //Especialista y paciente
    verResenia: boolean = false;


    ngOnInit(): void {
      this.usuarioConectado = this.authSrv.logInfo();

      this.Titulo = this.usuarioConectado!.perfil == 'admin' ? 'Turnos' : 'Mis turnos';
    }

    cambiarCalificacion(calificacion: number) {
        this.turno.valorizacion = calificacion;
      }


    recibirAccion($event: string) {
      this.limpiarControles();
      this.accion = $event;
      console.log('accion',this.accion);
      switch (this.accion) {
        case AccionesTurnos.Cancelar:
          this.verCancelarTurno = true;
          break;
        case AccionesTurnos.Aceptar:
          this.verAceptarTurnoEspecialista = true;
          break;
        case AccionesTurnos.Rechazar:
          this.verRechazarTurnoEspecialista = true;
          break;
        case AccionesTurnos.Finalizar:
          this.verFinalizarTurnoEspecialista = true;
          break;
        case AccionesTurnos.Completar:
          this.verCompletarEncuesta = true;
          break;
        case AccionesTurnos.Calificar:
          this.verCalificarAtencion = true;
          break;
        case AccionesTurnos.Reseniar:
          this.verResenia = true;
          break;
        default:
          break;
      }
    }

    recibirTurno($event: Turno){
      this.turno = $event;
      console.log('turno',this.turno);
    }

    limpiarControles(): void {
          //Paciente
          this.verCancelarTurno = false;

          this.verCompletarEncuesta = false;
          this.verCalificarAtencion = false;
          //Especialista

          this.verAceptarTurnoEspecialista   = false;
          this.verRechazarTurnoEspecialista  = false;
          this.verFinalizarTurnoEspecialista = false;
          //Especialista y paciente
          this.verResenia = false;

    }

    onSubmit() {
      switch (this.accion) {
        case AccionesTurnos.Cancelar:
          this.cancelarTurno();
          break;
        case AccionesTurnos.Aceptar:
          this.aceptarTurno();
          break;
        case AccionesTurnos.Rechazar:
          this.rechazarTurno();
          break;
        case AccionesTurnos.Finalizar:
          this.finalizarTurno();
          break;
        case AccionesTurnos.Completar:
          this.completarEncuenta();
          break;
        case AccionesTurnos.Calificar:
          this.calificarAtencion();
          break;
        // case 'resenia':
        //   this.leerResenia();
        //   break;
        default:
          break;
      }
    }

    //todos
    cancelarTurno() {
      console.log('Cancelar turno');
      if(this.turno!.comentario != ""){
        this.srvTurnos.cambiarEstadoConComentario(this.turno?.id, EstadoTurno.Cancelado,this.turno!.comentario);
        this.srvMensajes.Info('Turno cancelado');
        }
      else
        this.srvMensajes.Warning('Debe ingresar un comentario');
    }
    //Especialista
    aceptarTurno() {
      console.log('Aceptar turno');
      this.srvTurnos.cambiarEstado(this.turno?.id, EstadoTurno.Aceptado);
      this.srvMensajes.Info('Turno aceptado');
    }
    rechazarTurno() {
      console.log('Rechazar turno');
      if(this.turno!.comentario != ""){
        this.srvTurnos.cambiarEstadoConComentario(this.turno?.id, EstadoTurno.Rechazado,this.turno!.comentario);
        this.srvMensajes.Info('Turno rechazado');
      }
      else
        this.srvMensajes.Warning('Debe ingresar un comentario');
    }
    finalizarTurno() {
      console.log('Finalizar turno');
      if(this.turno!.comentario != "" || this.turno!.resenia != ""){
        this.srvTurnos.cambiarEstadoConComentario(this.turno?.id, EstadoTurno.Realizado,this.turno!.comentario);
        this.srvTurnos.actualizarFechaFin(this.turno?.id);
        this.srvMensajes.Info('Turno finalizado');
        }
      else
        this.srvMensajes.Warning('Debe ingresar un comentario');
    }
    //Paciente
    completarEncuenta() {
      console.log('Completar encuesta');
      if(this.turno!.encuesta != ""){
        this.srvTurnos.guardarEncuesta(this.turno?.id, this.turno!.encuesta);
        this.srvMensajes.Exito('Gracias por completar la encuesta');
      }else{
        this.srvMensajes.Warning('Debe completar la encuesta');
      }
    }
    calificarAtencion() {
      console.log('Calificar atencion');

      if(this.turno!.valorizacion != 0){
        this.srvTurnos.guardarCalificacion(this.turno?.id, this.turno!.valorizacion);
        this.srvMensajes.Exito('Gracias por calificar la atención');
      }else{
        this.srvMensajes.Warning('Debe completar la calificación');
      }

    }


}
