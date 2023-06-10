import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { EspecialidadesService } from './services/especialidades.service';
import { ImagenesService } from './services/imagenes.service';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations:[slideInAnimation]
})
export class AppComponent implements OnInit{

  constructor(private usuarioSrv: UsuarioService,
              private especialidadesSrv: EspecialidadesService,
              private imagenesSrv: ImagenesService,
              private authSrv: AuthService) {

  }

  title = 'Clinica Online AJG 2023';

  ngOnInit(): void {
    this.usuarioSrv.traer();
    this.especialidadesSrv.traerEspecialidades();
    this.imagenesSrv.getImages();
    this.authSrv.traeUsuarioLogueado();
  }


  prepareRoute(outlet: RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
