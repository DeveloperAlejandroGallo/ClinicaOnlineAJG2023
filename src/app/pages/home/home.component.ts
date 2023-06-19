import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
              public authSrv: AuthService,
              private userService: UsuarioService,
              private turnosService: TurnosService) {
              this.usuarioConectado = this.authSrv.usuarioActual;

              }

  msg!: string;
  usuarioConectado!: Usuario | undefined;
  email!:string;
  profile!: string;
  name!: string;
  adminActive!: boolean;

  ngOnInit(): void {
    this.usuarioConectado = this.authSrv.usuarioActual;

  }

  public volver() {
    this.router.navigate(['/login']);
  }

  public irAPerfil()
  {
    switch(this.profile)
    {
      case 'paciente':
        this.router.navigate(['/paciente']);
        break;
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'especialista':
        this.router.navigate(['/especialista']);
        break;

    }
  }

  public navegarSacarTurno() {
    this.router.navigate(['/paciente']);
  }

  public navegarVerTurnos() {
    this.router.navigate(['/paciente']);
  }

  public navegarDiasDeAtencionEsp() {
    this.router.navigate(['/profesional/calendario']);
  }

  public navegarAdministrarTurnos() {
    this.router.navigate(['/profesional/citas']);
  }

  public navegaraAprobarProfesional() {
    this.router.navigate(['/admin/aprobar']);
  }

  public navegarAtender() {
    this.router.navigate(['/profesional/atender']);
  }

  navegar(ruta:string){
    this.router.navigate([ruta]);
  }

  altaTurnosTest(){
    let usuarios = this.userService.listadoUsuarios;
    let especialistas = usuarios.filter(usuario => usuario.perfil == 'especialista');
    let pacientes = usuarios.filter(usuario => usuario.perfil == 'paciente');
    //array con 10 fechas y horas diferentes
    let fechas = ['2021-10-01T09:00:00','2021-10-01T10:00:00','2021-10-01T11:00:00','2021-10-01T12:00:00','2021-10-01T13:00:00','2021-10-01T14:00:00','2021-10-01T15:00:00','2021-10-01T16:00:00','2021-10-01T17:00:00','2021-10-01T18:00:00'];



  }
}
