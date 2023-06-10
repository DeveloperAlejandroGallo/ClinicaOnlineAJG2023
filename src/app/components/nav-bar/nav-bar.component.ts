import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {

  @Input() usuarioConectado: Usuario | undefined | null;
  logueado: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logueado = this.authService.sesionActiva;
    if (this.logueado) {
      this.usuarioConectado = this.authService.usuarioActual;
      this.logueado = this.authService.logueado();
    }



  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuarioConectado = this.authService.logInfo();
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 1000);
  }
}
