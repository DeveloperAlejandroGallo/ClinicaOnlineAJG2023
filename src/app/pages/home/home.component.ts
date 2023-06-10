import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
              public authSrv: AuthService,
              private userService: UsuarioService) {
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
}
