import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, distinct, map } from 'rxjs';
import { Turno } from 'src/app/models/turno';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-especialista-pacientes',
  templateUrl: './especialista-pacientes.component.html',
  styleUrls: ['./especialista-pacientes.component.scss'],
  animations:[
    trigger('rotateDiagonal', [
      transition(':enter', [
        animate('0.4s', style({ opacity: 1, transform: 'rotate3d(-1, 1, 0, 360deg)' }))
      ])
    ])
  ]
})
export class EspecialistaPacientesComponent implements OnInit{

  pacienteSeleccionado: UsuarioPaciente | undefined;

  verHistoriaClinica:boolean = false;
  verOcultar: string = "Ver";

  usuarioConectado: UsuarioEspecialista;
  ultimosTurnosTomados: Array<Turno> = [];

  lstPacientesAtendidos: Array<UsuarioPaciente> = [];

  pacientes$: Observable<UsuarioPaciente[]> = this.turnosSrv.allTurnos$.pipe(
    map(turnos => turnos.filter(t => t.especialista.id == this.auth.logInfo()!.id).map(turno => turno.paciente!)),
    distinct(paciente => paciente)
  );

  constructor(
    private turnosSrv: TurnosService,
    private usuariosSrv: UsuarioService,
    private router: Router,
    private auth: AuthService)
    {

      this.usuarioConectado = this.auth.logInfo() as UsuarioEspecialista;

      this.pacientes$.subscribe(users =>
        users.forEach(user => {
          if(!this.lstPacientesAtendidos.some(u => u.id == user.id))
            this.lstPacientesAtendidos.push(user);
        })
        );
    }

  ngOnInit(): void {
  }

  seleccionarUsuario(i:number){
    console.log('En espe-pac',this.pacienteSeleccionado);
    this.ultimosTurnosTomados = this.turnosSrv.listadoTurnos
                                .filter(turno => turno.paciente!.id == this.pacienteSeleccionado!.id)
                                .sort((a, b) => { //de mayor a menor
                                  if (new Date(a.fechaInicio) > new Date(b.fechaInicio)) {
                                    return -1;
                                  } else if (new Date(a.fechaInicio) < new Date(b.fechaInicio)) {
                                    return 1;
                                  } else {
                                    return 0;
                                  }
                                });

  }

  mostrarHistoriaClinica(){
    // this.router.navigate(['/usuario/historiaClinica', this.usuarioSeleccionado!.id]);
    this.verHistoriaClinica = !this.verHistoriaClinica;
    this.verOcultar = this.verHistoriaClinica ? "Ocultar" : "Ver";
  }

  irAHistoriaClinica(){
    const id = this.pacienteSeleccionado?.id;
    const perfil = this.pacienteSeleccionado?.perfil;
    this.router.navigate(['/usuario/historiaClinica', id]);
  }

  recibirPaciente($event: any){
    this.pacienteSeleccionado = $event as UsuarioPaciente;
  }
}
