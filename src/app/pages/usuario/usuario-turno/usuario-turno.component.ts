import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccionesTurnos } from 'src/app/enums/acciones-turnos';
import { EstadoTurno } from 'src/app/enums/estado-turno';
import { HistoriaClinica } from 'src/app/models/historia-clinica';
import { Turno } from 'src/app/models/turno';
import { AuthService } from 'src/app/services/auth.service';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
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

    @ViewChild('modalHistoria') modalHistoria!: ElementRef;

    @ViewChildren('claveInput') claveInputs!: QueryList<ElementRef>;
    @ViewChildren('valorInput') valorInputs!: QueryList<ElementRef>;

    formHistoriaClinica!: FormGroup;

    txtBotonAceptar: string = 'Guardar Cambios';
    claseColorBoton: string = 'btn-outline-primary';

    datosDinamicos: Array<{clave: string, valor: string}> = [{clave:'',valor:''}];


    usuarioConectado = this.authSrv.logInfo();

    Titulo = 'Mis turnos';

    //Controles

    tituloUsuario: any;

    constructor(private srvTurnos: TurnosService,
                private srvMensajes: MensajesService,
                private authSrv: AuthService,
                private historiasSrv: HistoriaClinicaService) {

    this.formHistoriaClinica = new FormGroup(
      {
        altura: new FormControl('', [Validators.required]),
        peso: new FormControl('', [Validators.required]),
        temperatura: new FormControl('', [
          Validators.required,
        ]),
        presion: new FormControl('', [Validators.required]),
        // datosDinamicos: new FormArray([this.crearFormGroupDatosDinamicos('', '')]), // FormArray para los datos dinámicos
      },
      Validators.required
    );

  }

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
          this.txtBotonAceptar = 'Cancelar Turno';
          this.claseColorBoton = 'btn-outline-warning';
          break;
        case AccionesTurnos.Aceptar:
          this.verAceptarTurnoEspecialista = true;
          this.txtBotonAceptar = 'Aceptar Turno';
          this.claseColorBoton = 'btn-outline-primary';
          break;
        case AccionesTurnos.Rechazar:
          this.verRechazarTurnoEspecialista = true;
          this.txtBotonAceptar = 'Rechazar Turno';
          this.claseColorBoton = 'btn-outline-danger';
          break;
        case AccionesTurnos.Finalizar:
          this.verFinalizarTurnoEspecialista = true;
          this.txtBotonAceptar = 'Finalizar Turno';
          this.claseColorBoton = 'btn-outline-success';
          break;
        case AccionesTurnos.Completar:
          this.verCompletarEncuesta = true;
          this.txtBotonAceptar = 'Finalizar Encuesta';
          this.claseColorBoton = 'btn-outline-primary';
          break;
        case AccionesTurnos.Calificar:
          this.verCalificarAtencion = true;
          this.txtBotonAceptar = 'Calificar Atencion';
          this.claseColorBoton = 'btn-outline-info';
          break;
        case AccionesTurnos.Reseniar:
          this.verResenia = true;
          this.txtBotonAceptar = 'Guardar Resenia';
          this.claseColorBoton = 'btn-outline-dark';
          break;
        default:
          break;
      }
    }

  tieneHistoriaClinica() {
    let result = false;
    console.log('this.historiasSrv.lstHistoriasClinicas',this.historiasSrv.lstHistoriasClinicas)
    result =  this.historiasSrv.lstHistoriasClinicas.some(hc => hc.turno && hc.turno.id == this.turno.id);

    return result;
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
        case 'Reseniar':
          this.guardarResenia();
          break;
        default:
          break;
      }
    }
  guardarResenia() {
    console.log('Reseñar turno');
    if(this.turno!.resenia != ""){
      this.srvTurnos.cambiarEstadoConComentario(this.turno?.id, EstadoTurno.Cancelado,this.turno!.comentario, this.turno.resenia);
      this.srvMensajes.Info('Reseña actualizada');
      }
    else
      this.srvMensajes.Warning('Debe ingresar una reseña');
  }

    //todos
    cancelarTurno() {
      console.log('Cancelar turno');
      if(this.turno!.comentario != ""){
        this.srvTurnos.cambiarEstadoConComentario(this.turno?.id, EstadoTurno.Cancelado,this.turno!.comentario, this.turno.resenia);
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
        this.srvTurnos.cambiarEstadoConComentario(this.turno?.id, EstadoTurno.Rechazado,this.turno!.comentario, this.turno.resenia);
        this.srvMensajes.Info('Turno rechazado');
      }
      else
        this.srvMensajes.Warning('Debe ingresar un comentario');
    }
    finalizarTurno() {
      console.log('Finalizar turno');
      if(!this.tieneHistoriaClinica())
      {
        this.srvMensajes.Warning('Debe crear una historia clinica para el paciente antes de finalizar el turno');
        return;
      }
      if(this.turno!.comentario != "" || this.turno!.resenia != ""){
        this.srvTurnos.cambiarEstadoConComentario(this.turno?.id, EstadoTurno.Realizado,this.turno!.comentario, this.turno!.resenia);
        this.srvTurnos.actualizarFechaFin(this.turno?.id);
        this.srvMensajes.Info('Turno finalizado');
        }
      else
        this.srvMensajes.Warning('Debe ingresar un comentario o resenia');
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


    //Modal
    openModal() {
      const modalElement = this.modalHistoria.nativeElement;
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }

    closeModal() {
    const modalElement = this.modalHistoria.nativeElement;
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  // crearFormGroupDatosDinamicos(clave: string, valor: string): FormGroup {
  //   return new FormGroup({
  //     clave: new FormControl(clave, Validators.required),
  //     valor: new FormControl(valor, Validators.required),
  //   });
  // }

  agregarDatoDinamico(clave: string, valor: string, i: number): void {

    if (this.datosDinamicos.length < 3) {
      const claveInputValue = this.claveInputs.toArray()[i].nativeElement.value;
      const valorInputValue = this.valorInputs.toArray()[i].nativeElement.value;

      // Verificar si las casillas anteriores están cargadas
      if (claveInputValue && valorInputValue) {

        this.datosDinamicos[i].clave = claveInputValue;
        this.datosDinamicos[i].valor = valorInputValue;

        this.datosDinamicos.push({ clave: "", valor: "" });
      } else {
        this.srvMensajes.Warning('Por favor, complete las casillas anteriores antes de agregar un nuevo dato dinámico');
      }
    } else {
      this.srvMensajes.Warning('No se pueden agregar más de 3 datos dinámicos');
    }
  }

  // Método para eliminar un dato dinámico del formulario
  eliminarDatoDinamico(index: number) {
    if(index === 0)
    {
      this.srvMensajes.Warning("Debe ingresar al menos un dato dinámico");
      return;
    }
    this.datosDinamicos.splice(index,1);
  }

  guardarHistoriaClinica() {

    for(let i=0; i<this.claveInputs.toArray().length; i++)
    {
      const claveInputValue = this.claveInputs.toArray()[i].nativeElement.value;
      const valorInputValue = this.valorInputs.toArray()[i].nativeElement.value;
      if (!claveInputValue || !valorInputValue) {
        this.srvMensajes.Warning('Por favor, complete todos los datos dinámicos correctamente o elimínelos');
        return;
      }else {
        this.datosDinamicos[i].clave = claveInputValue;
        this.datosDinamicos[i].valor = valorInputValue;
      }
    }

    let historiaClinica: HistoriaClinica = {
      id: '',
      turno: this.turno,
      altura: this.altura?.value,
      peso: this.peso?.value,
      temperatura: this.temperatura?.value,
      presion: this.presion?.value,
      datosDinamicos: this.datosDinamicos,
    };

    this.historiasSrv.nuevaHistoriaClinica(historiaClinica);
    setTimeout(() => {

      this.srvMensajes.Exito('Historia clínica guardada');
      this.formHistoriaClinica.reset();
      this.closeModal();

    }, 500);

  }

  // Getter y Setter para altura
  get altura() {
    return this.formHistoriaClinica.get('altura') ;
  }

  // Getter y Setter para peso
  get peso() {
    return this.formHistoriaClinica.get('peso');
  }

  // Getter y Setter para temperatura
  get temperatura() {
    return this.formHistoriaClinica.get('temperatura');
  }

  // Getter y Setter para presion
  get presion() {
    return this.formHistoriaClinica.get('presion');
  }

  // Getter para datosDinamicos
  // get datosDinamicos(): FormArray {
  //   return this.formHistoriaClinica.get('datosDinamicos') as FormArray;
  // }


}
