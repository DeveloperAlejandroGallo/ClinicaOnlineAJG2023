import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { set } from '@angular/fire/database';
import { EstadoTurno } from 'src/app/enums/estado-turno';
import { Especialidad } from 'src/app/models/especialidad';
import { Fechas } from 'src/app/models/fechas';
import { Turno } from 'src/app/models/turno';
import { UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],
})
export class TurnosComponent implements OnInit {
  Titulo = 'Turnos';

  @ViewChild('selectEspecialidad') selectEspecialidadRef!: ElementRef;
  @ViewChild('selectEspecialista') selectEspecialistaRef!: ElementRef;

  resetSelect() {
    let selectElement: HTMLSelectElement =
      this.selectEspecialidadRef.nativeElement;
    selectElement.selectedIndex = -1;
    selectElement = this.selectEspecialistaRef.nativeElement;
    selectElement.selectedIndex = -1;
  }
  @Input() usuarioPaciente!: UsuarioPaciente;

  usuarioConectado = this.authSrv.logInfo();

  //Colecciones
  lstEspecialidades: Array<Especialidad> = [];
  lstEspecialistas: Array<UsuarioEspecialista> = [];
  lstTurnosTomados: Array<Turno> = [];
  lstTurnosDisponibles: Array<Turno> = []; // Calculo dinamicamente 15 dias de turnos disponibles
  lstDiasDeTurnos: Array<string> = [];

  //Secciones del turno
  especialidadElegida!: Especialidad | null;
  especialistaElegido!: UsuarioEspecialista | null;
  fechaElegida: string = '';
  horaElegida: string = '';

  proximoTurnoSegunHistoria: Turno | undefined;

  constructor(
    private usuariosSrv: UsuarioService,
    private especialidadesSrv: EspecialidadesService,
    private turnoSrv: TurnosService,
    private authSrv: AuthService,
    private mensajeSrv: MensajesService
  ) {
    this.lstTurnosTomados = this.turnoSrv.listadoTurnos;
    console.log('Tomados', this.lstTurnosTomados);
    // this.turnoSrv.allTurnos$.subscribe((turnos: Array<Turno>) => {
    //   this.lstTurnosTomados = turnos;
    //   console.log('Tomados',this.lstTurnosTomados);

    // });
  }

  ngOnInit(): void {
    this.usuarioConectado = this.authSrv.logInfo();
    this.lstEspecialidades = this.especialidadesSrv.listadoEspecialidades;
    this.lstEspecialistas = this.usuariosSrv.listadoUsuarios.filter(
      (x) => x.perfil == 'especialista'
    ) as UsuarioEspecialista[];
    let fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    this.lstTurnosDisponibles = this.turnoSrv.listadoTurnos.filter(
      (x) => new Date(x.fechaInicio) < new Date(fechaActual)
    );

    let ultimoTurnoPaciente = this.lstTurnosTomados
      .filter(
        (t) =>
          new Date(t.fechaInicio).setHours(0, 0, 0, 0) <
          new Date().setHours(0, 0, 0, 0)
      )
      .pop();
      if(ultimoTurnoPaciente){
        this.proximoTurnoSegunHistoria = this.calcularTurnoSegunHistoria(ultimoTurnoPaciente);
      }
  }

  calcularTurnoSegunHistoria(ultimoTurnoPaciente: Turno): Turno | undefined {

    let result: Turno | undefined = undefined;

    let fecha: Date = new Date();
    fecha.setHours(0, 0, 0, 0);
    fecha.setDate(fecha.getDate() + 1);
    fecha.setHours(8, 0, 0, 0);
    for (let i = 0; i < 15; i++) {
      //15 dias
      fecha.setDate(fecha.getDate() + 1);
      fecha.setHours(8, 0, 0, 0);

      let horaFin = fecha.getDay() != 6 ? 20 : 14; // si es sabado es hasta las 14
      while (fecha.getHours() < horaFin) {

      let turnoLibre = !this.lstTurnosTomados.find((turnoTomado) => {
        return (
          turnoTomado.especialista.id == ultimoTurnoPaciente.especialista.id &&
          turnoTomado.especialidad.id == ultimoTurnoPaciente.especialidad.id &&
          turnoTomado.fechaInicio.split('T')[0] ==
          ultimoTurnoPaciente.fechaInicio.split('T')[0] &&
          turnoTomado.fechaInicio.split('T')[1].slice(0, 5) ==
          ultimoTurnoPaciente.fechaInicio.split('T')[1].slice(0, 5)
        );
      });

        if (ultimoTurnoPaciente.especialista.especialidades.find(
            (x) => x.diasDeAtencion[fecha.getDay()]
          ) && turnoLibre
        ) {
          // si el especialista atiende ese dia y el turno esta libre.

          result = {
            id: '',
            especialista: ultimoTurnoPaciente.especialista,
            especialidad: ultimoTurnoPaciente.especialidad,
            fechaInicio: new Date(fecha).toISOString(),
            paciente: null,
            estado: EstadoTurno.Libre,
            fechaFin: undefined,
            consultorio: ultimoTurnoPaciente.especialidad.consultorio,
            comentario: '',
            resenia: '',
            fechaEstado: new Date().toISOString(),
            encuesta: '',
            valorizacion: 0,
          };
          return result;
        }
        fecha.setMinutes(fecha.getMinutes() + ultimoTurnoPaciente.especialidad.duracionTurno);
      }
    }
    return result;
  }

  genero15DiasDeTurnosDisponibles() {
    this.lstTurnosDisponibles = [];
    //necesito una lista de fechas sin hora, de los turnos que voy generando
    this.lstDiasDeTurnos = [];

    this.lstEspecialistas.forEach((especialista) => {
      especialista.especialidades.forEach((especialidad) => {
        let fecha = new Date();

        for (let i = 0; i < 15; i++) {
          //15 dias
          fecha.setDate(fecha.getDate() + 1);
          fecha.setHours(8, 0, 0, 0);

          let horaFin = fecha.getDay() != 6 ? 20 : 14; // si es sabado es hasta las 14
          while (fecha.getHours() < horaFin) {
            if (
              especialista.especialidades.find(
                (x) => x.diasDeAtencion[fecha.getDay()]
              )
            ) {
              // si el especialista atiende ese dia

              let turno: Turno = {
                id: '',
                especialista: especialista,
                especialidad: especialidad,
                fechaInicio: new Date(fecha).toISOString(),
                paciente: null,
                estado: EstadoTurno.Libre,
                fechaFin: undefined,
                consultorio: especialidad.consultorio,
                comentario: '',
                resenia: '',
                fechaEstado: new Date().toISOString(),
                encuesta: '',
                valorizacion: 0,
              };
              let fechaSinHora = turno.fechaInicio.split('T')[0];

              if (!this.lstDiasDeTurnos.includes(fechaSinHora)) {
                this.lstDiasDeTurnos.push(fechaSinHora);
              }

              this.lstTurnosDisponibles.push(turno);
            }

            fecha.setMinutes(fecha.getMinutes() + especialidad.duracionTurno);
          }
        }
      });
    });

    setTimeout(() => {
      this.filtrarTurnosTomados();
    }, 1000);
  }

  filtrarTurnosTomados() {
    //filtrar los turnos disponibles con los turnos ya tomados en la coleccion de turnos en la misma fecha, especialidad y especialista

    this.lstTurnosDisponibles = this.lstTurnosDisponibles.filter(
      (turnoDisponible) => {
        return !this.lstTurnosTomados.find((turnoTomado) => {
          return (
            turnoTomado.especialista.id == turnoDisponible.especialista.id &&
            turnoTomado.especialidad.id == turnoDisponible.especialidad.id &&
            turnoTomado.fechaInicio.split('T')[0] ==
              turnoDisponible.fechaInicio.split('T')[0] &&
            turnoTomado.fechaInicio.split('T')[1].slice(0, 5) ==
              turnoDisponible.fechaInicio.split('T')[1].slice(0, 5)
          );
        });
      }
    );

    //ordenar listado por fechaInicio
    this.lstTurnosDisponibles = this.lstTurnosDisponibles.sort((a, b) => {
      if (new Date(a.fechaInicio) > new Date(b.fechaInicio)) {
        return 1;
      } else if (new Date(a.fechaInicio) < new Date(b.fechaInicio)) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  tomarTurno(turno: Turno) {
    turno.paciente = this.usuarioConectado as UsuarioPaciente;
    turno.estado = EstadoTurno.Pendiente;
    turno.fechaFin = null;
    this.turnoSrv.nuevo(turno);
    setTimeout(() => {
      this.filtrarTurnosTomados();
    }, 1000);
    this.mensajeSrv.Exito(
      `Turno Tomado para la fecha ${new Date(turno.fechaInicio).toLocaleString(
        'es-AR',
        { timeZone: 'America/Argentina/Buenos_Aires' }
      )}`
    );
    this.resetSelect();
  }

  seleccionarEspecialista($event: any) {
    let i = $event.target.value;
    this.especialistaElegido = this.lstEspecialistas[i];
    this.lstEspecialidades = this.especialistaElegido.especialidades;
    this.lstDiasDeTurnos = [];

  }

  seleccionarEspecialidad($event: any) {
    let i = $event.target.value;
    this.especialidadElegida = this.lstEspecialidades[i];
    this.genero15DiasDeTurnosParaEspecialistaYEspecialidad();
  }

  seleccionarFecha($event: any) {
    let i = $event.target.value;
    this.fechaElegida = this.lstDiasDeTurnos[i];
    let fecha = new Date(this.fechaElegida);
    let especialidad = this.especialidadElegida!;
    let especialista = this.especialistaElegido!;
    let horaFinDelDia = fecha.getDay() != 6 ? 20 : 14; // si es sabado es hasta las 14

    this.lstTurnosDisponibles = [];

    while (fecha.getHours() < horaFinDelDia) {
      if (
        especialista.especialidades.find(
          (x) => x.diasDeAtencion[fecha.getDay()]
        )
      ) {
        // si el especialista atiende ese dia

        let turno: Turno = {
          id: '',
          especialista: especialista,
          especialidad: especialidad,
          fechaInicio: new Date(fecha).toISOString(),
          paciente: null,
          estado: EstadoTurno.Libre,
          fechaFin: undefined,
          consultorio: especialidad.consultorio,
          comentario: '',
          resenia: '',
          fechaEstado: new Date().toISOString(),
          encuesta: '',
          valorizacion: 0,
        };
        let turnoLibre = !this.lstTurnosTomados.find((turnoTomado) => {
          return (
            turnoTomado.especialista.id == turno.especialista.id &&
            turnoTomado.especialidad.id == turno.especialidad.id &&
            turnoTomado.fechaInicio.split('T')[0] ==
              turno.fechaInicio.split('T')[0] &&
            turnoTomado.fechaInicio.split('T')[1].slice(0, 5) ==
              turno.fechaInicio.split('T')[1].slice(0, 5)
          );
        });

        if (turnoLibre) {
          this.lstTurnosDisponibles.push(turno);
        }

        fecha.setMinutes(fecha.getMinutes() + especialidad.duracionTurno);
      }
    }
    this.lstTurnosDisponibles = this.lstTurnosDisponibles.sort((a, b) => {
      if (new Date(a.fechaInicio) > new Date(b.fechaInicio)) {
        return 1;
      } else if (new Date(a.fechaInicio) < new Date(b.fechaInicio)) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  seleccionarHora($event: any) {
    let i = $event.target.value;

    let turnoElegido = this.lstTurnosDisponibles[i];

    Swal.fire({
      title: `Desea tomar el turno para la fecha
      ${new Date(turnoElegido.fechaInicio).toLocaleString(
        'es-AR',
        { timeZone: 'America/Argentina/Buenos_Aires' }
      )}?`,
      showCancelButton: true,
      confirmButtonText: 'Tomar Turno',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tomarTurno(this.lstTurnosDisponibles[i]);
      }
    })

  }
  genero15DiasDeTurnosParaEspecialistaYEspecialidad() {
    let fecha = new Date();
    for (let i = 0; i < 15; i++) {
      //15 dias
      fecha.setDate(fecha.getDate() + 1);
      fecha.setHours(0, 0, 0, 0);
      if (fecha.getDay() != 0)
        // si no es domingo
        this.lstDiasDeTurnos.push(new Date(fecha).toISOString().split('T')[0]);
    }
  }
}
