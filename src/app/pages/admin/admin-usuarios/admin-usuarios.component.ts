import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { Especialidad } from 'src/app/models/especialidad';

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


  constructor(private usuariosSrv: UsuarioService){

  }

  ngOnInit(): void {
    this.listaUsuariosEspecialistas = this.usuariosSrv.listadoUsuarios as Array<UsuarioEspecialista>;
    this.listaUsuarios = this.usuariosSrv.listadoUsuarios;
    console.log('listaUsuarios', this.listaUsuarios)
  }



  seleccionarUsuario(i: number){

    console.log(this.listaUsuarios[i])
    console.log(this.listaUsuariosEspecialistas[i])


    let usuario = this.listaUsuarios[i];


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
    console.log(this.fotoPaciente);
    console.log(this.especialidades);
  }
}
