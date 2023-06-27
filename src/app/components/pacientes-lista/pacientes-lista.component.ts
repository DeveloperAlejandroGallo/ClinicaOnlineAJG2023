import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, distinct, map } from 'rxjs';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-pacientes-lista',
  templateUrl: './pacientes-lista.component.html',
  styleUrls: ['./pacientes-lista.component.scss']
})
export class PacientesListaComponent implements OnInit{

  @Output() pacienteEmit: EventEmitter<UsuarioPaciente> = new EventEmitter<UsuarioPaciente>();
  @Input() lstUsuarios: Array<Usuario | UsuarioEspecialista | UsuarioPaciente > = [];

  usuarioLogueado!: Usuario | null | undefined;



  constructor(
    private auth: AuthService,
    private usuarioSrv: UsuarioService,
    private turnosSrv: TurnosService) {



     }

  ngOnInit(): void {

    this.usuarioLogueado = this.auth.logInfo();

  }


  seleccionarUsuario(i: number){
    this.pacienteEmit.emit(this.lstUsuarios[i] as UsuarioPaciente);
  }

}
