import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, distinct, map } from 'rxjs';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-especialista-pacientes',
  templateUrl: './especialista-pacientes.component.html',
  styleUrls: ['./especialista-pacientes.component.scss']
})
export class EspecialistaPacientesComponent implements OnInit{

  lstPacientesAtendidos: Array<UsuarioPaciente> = [];
  pacienteSeleccionado: UsuarioPaciente | undefined;
  pacientes$: Observable<UsuarioPaciente[]> = this.turnosSrv.allTurnos$.pipe(
    map(turnos => turnos.filter(t => t.especialista.id == this.auth.logInfo()!.id).map(turno => turno.paciente!)),
    distinct(paciente => paciente)
  );
  verHistoriaClinica:boolean = false;
  verOcultar: string = "Ver";

  usuarioConectado: UsuarioEspecialista;

  constructor(
    private turnosSrv: TurnosService,
    private usuariosSrv: UsuarioService,
    private router: Router,
    private auth: AuthService)
    {
      this.pacientes$.subscribe(users =>
        users.forEach(user => {
          if(!this.lstPacientesAtendidos.find(u => u.id == user.id))
            this.lstPacientesAtendidos.push(user);
        })
        );
      this.usuarioConectado = this.auth.logInfo() as UsuarioEspecialista;
    }

  ngOnInit(): void {
  }

  seleccionarUsuario(i:number){
    this.pacienteSeleccionado = this.lstPacientesAtendidos[i];

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
}
