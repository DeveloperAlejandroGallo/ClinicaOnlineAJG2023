import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { Especialidad } from 'src/app/models/especialidad';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/mensajes.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit{

  listaUsuariosEspecialistas: Array<UsuarioEspecialista> = [];
  listaUsuarios: Array<Usuario | UsuarioEspecialista | UsuarioPaciente> = [];

  //
  nombre!         : string;
  apellido!       : string;
  edad!           : number;
  dni!            : number;
  email!          : string;
  imagenDePerfil! : string;
  logueado!       : boolean;
  perfil!         : string;
  obraSocial!     : string;
  fotoPaciente!   : string;
  especialidades! : Array<Especialidad>;
  cuentaAprobada! : boolean;

  usuarioSeleccionado: Usuario | UsuarioEspecialista | UsuarioPaciente | undefined;
  usuarioConectado: UsuarioEspecialista | Usuario | UsuarioPaciente | undefined;

  constructor(private usuariosSrv: UsuarioService,
              private router: Router,
              private mensajeSrv: MensajesService,
              private auth: AuthService) { }



  ngOnInit(): void {
    this.listaUsuariosEspecialistas = this.usuariosSrv.listadoUsuarios as Array<UsuarioEspecialista>;
    this.listaUsuarios = this.usuariosSrv.listadoUsuarios;
    this.usuarioConectado = this.auth.logInfo();

  }

  altaAdmin(){
    // this.router.navigate(['/registro'], { queryParams: { perfil: 'admin' } });
    this.router.navigate(['/registro', 'admin']);
  }

  seleccionarUsuario(i: number){

    this.usuarioSeleccionado = this.listaUsuarios[i];
    let usuario = this.usuarioSeleccionado;

    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.edad = usuario.edad;
    this.dni = usuario.dni;
    this.email = usuario.email;
    this.imagenDePerfil = usuario.foto
    this.logueado = usuario.logueado;
    this.perfil = usuario.perfil;

    switch(usuario.perfil){
      case 'paciente':
        this.obraSocial = (usuario as UsuarioPaciente).obraSocial;
        this.fotoPaciente = (usuario as UsuarioPaciente).fotoPaciente;
        break;
      case 'especialista':
         this.especialidades = (usuario as UsuarioEspecialista).especialidades;
         this.cuentaAprobada = (usuario as UsuarioEspecialista).cuentaAprobada;
        break;
    }

  }

  aprobarCuenta(){
    this.usuariosSrv.aprobarCuenta(this.usuarioSeleccionado as UsuarioEspecialista);
    this.mensajeSrv.Exito('Cuenta aprobada');
    this.cuentaAprobada = true;
  }

  irAHistoriaClinica(){
    const id = this.usuarioSeleccionado?.id;
    const perfil = this.usuarioSeleccionado?.perfil;
    this.router.navigate(['/usuario/historiaClinica', id]);

  }

  exportarExcel(){

  };

}
