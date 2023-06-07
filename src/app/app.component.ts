import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { EspecialidadesService } from './services/especialidades.service';
import { ImagenesService } from './services/imagenes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private usuarioSrv: UsuarioService,
              private especialidadesSrv: EspecialidadesService,
              private imagenesSrv: ImagenesService) {

  }

  title = 'Clinica Online AJG 2023';

  ngOnInit(): void {
    this.usuarioSrv.traer();
    this.especialidadesSrv.traerEspecialidades();
    this.imagenesSrv.getImages();
  }
}
