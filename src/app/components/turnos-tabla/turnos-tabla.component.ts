import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EstadoTurno } from 'src/app/enums/estado-turno';
import { Turno } from 'src/app/models/turno';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-turnos-tabla',
  templateUrl: './turnos-tabla.component.html',
  styleUrls: ['./turnos-tabla.component.scss'],
})
export class TurnosTablaComponent implements OnInit {

  @Output() accion: EventEmitter<string> = new EventEmitter<string>();
  @Output() turno: EventEmitter<Turno> = new EventEmitter<Turno>();
  listadoDeTurnos: Array<Turno> = [];


  comentarioText: string = '';
  reseniaText: string = '';

  usuarioConectado: Usuario | undefined | null;pacienteOEspecialista: any;
 filtroNombre: any;


  constructor(private turnoSrv: TurnosService, private authService: AuthService) {
    this.turnoSrv.allTurnos$.subscribe((turnos) => {
      this.listadoDeTurnos = turnos;
    });
    this.usuarioConectado = this.authService.logInfo();
    this.pacienteOEspecialista = this.usuarioConectado?.perfil == 'paciente' ? 'Especialista' : 'Paciente';
  }

  ngOnInit(): void {}

  accionSeleccionada(accion: string, turno: Turno){
    this.accion.emit(accion);
    this.turno.emit(turno);
  }



  //botones
  //Paciente
  verCancelarTurnoPaciente(turno: Turno): boolean {
    return turno.estado != EstadoTurno.Realizado;
  }

  verCompletarEncuesta(turno: Turno) {
    return (
      turno.estado == EstadoTurno.Realizado &&
      turno.resenia != ('' && null && undefined)
    );
  }
  verCalificarAtencion(turno: Turno) {
    return turno.estado == EstadoTurno.Realizado;
  }
  //Especialista
  verCancelarTurnoEspecialista(turno: Turno): boolean {
    return (
      turno.estado !=
      ( EstadoTurno.Realizado &&
        EstadoTurno.Aceptado &&
        EstadoTurno.Rechazado)
    );
  }

  verAceptarTurnoEspecialista(turno: Turno): boolean {
    return (
      turno.estado !=
      ( EstadoTurno.Realizado &&
        EstadoTurno.Cancelado &&
        EstadoTurno.Rechazado)
    );
  }
  verRechazarTurnoEspecialista(turno: Turno): boolean {
    return (
      turno.estado !=
      ( EstadoTurno.Realizado &&
        EstadoTurno.Aceptado &&
        EstadoTurno.Cancelado)
    );
  }
  verFinalizarTurnoEspecialista(turno: Turno): boolean {
    return turno.estado == EstadoTurno.Aceptado;
  }
  //Especialista y paciente
  verResenia(turno: Turno): boolean {
    return (
      turno.resenia != ('' && null && undefined) ||
      turno.comentario != ('' && null && undefined)
    );
  }
}
