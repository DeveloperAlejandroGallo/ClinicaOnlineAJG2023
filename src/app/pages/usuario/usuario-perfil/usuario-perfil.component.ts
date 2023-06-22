import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-perfil',
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.scss']
})
export class UsuarioPerfilComponent {

  usuarioConectado = this.authSrv.logInfo();
  usuario: UsuarioPaciente;
  usuarioEspecialista: UsuarioEspecialista;

  diasSemana: Array<string> = ['D','L', 'M', 'X', 'J', 'V', 'S'];



  constructor(private authSrv: AuthService,
              private turnosSrv: TurnosService,
              private usuarioSrv: UsuarioService,
              private router: Router
              ) {
    this.usuario = this.usuarioConectado as UsuarioPaciente;
    this.usuarioEspecialista = this.usuarioConectado as UsuarioEspecialista;

  }



  generarTurnos(especialidadId: string){

  }

  marcarDia($event: any, indiceDia: number, especialidadId: string, indiceEspecialidad: number){
    console.log('Marcando',$event.target.value);

    this.usuarioEspecialista.especialidades[indiceEspecialidad].diasDeAtencion[indiceDia] = $event.target.value;
    this.usuarioSrv.actualizarEspecialista(this.usuarioEspecialista);
  }

  irAHistoriaClinica(){
    const id = this.usuarioConectado?.id;
    const perfil = this.usuarioConectado?.perfil;
    this.router.navigate(['/usuario/historiaClinica', id]);
  }

}
