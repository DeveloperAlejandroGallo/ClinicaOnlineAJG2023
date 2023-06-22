import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { EspecialidadesService } from './services/especialidades.service';
import { ImagenesService } from './services/imagenes.service';
import { AuthService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { animate, style, transition, trigger } from '@angular/animations';
import { Turno } from './models/turno';
import { TurnosService } from './services/turnos.service';
import { LogIngresoSistemaService } from './services/log-ingreso-sistema.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations:[
     slideInAnimation
    // trigger('transicion1', [
    //   transition(':enter', [
    //     style({ opacity: 0, transform: 'translateX(-100%)' }),
    //     animate('300ms', style({ opacity: 1, transform: 'translateX(0)' }))
    //   ]),
    //   transition(':leave', [
    //     animate('300ms', style({ opacity: 0, transform: 'translateX(100%)' }))
    //   ])
    // ]),
    // trigger('transicion2', [
    //   transition(':enter', [
    //     style({ opacity: 0, transform: 'scale(0.8)' }),
    //     animate('300ms', style({ opacity: 1, transform: 'scale(1)' }))
    //   ]),
    //   transition(':leave', [
    //     animate('300ms', style({ opacity: 0, transform: 'scale(0.8)' }))
    //   ])
    // ])
  ]
})
export class AppComponent implements OnInit{

  constructor(private usuarioSrv: UsuarioService,
              private especialidadesSrv: EspecialidadesService,
              private imagenesSrv: ImagenesService,
              private authSrv: AuthService,
              private turnoSrv: TurnosService,
              private logSrv: LogIngresoSistemaService) {

  }

  title = 'Clinica Online AJG 2023';

  ngOnInit(): void {
    this.usuarioSrv.traer();
    this.especialidadesSrv.traerEspecialidades();
    this.imagenesSrv.getImages();
    this.authSrv.traeUsuarioLogueado();
    this.turnoSrv.llenarLista();
    this.logSrv.llenarlstLosg();

  }


  prepareRoute(outlet: RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
