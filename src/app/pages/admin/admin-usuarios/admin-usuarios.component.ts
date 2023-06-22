import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { Especialidad } from 'src/app/models/especialidad';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/mensajes.service';
import { AuthService } from 'src/app/services/auth.service';
import * as ExcelJS from 'exceljs';

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
    const workbook = new ExcelJS.Workbook();
    const usuarios = this.listaUsuarios;

    const usuariosAdmin = usuarios.filter(usuario => usuario.perfil === 'admin');
    this.generarHojaUsuariosPerfil(workbook, usuariosAdmin, 'Admins');

    const usuariosEspecialista = usuarios.filter(usuario => usuario.perfil === 'especialista');
    this.generarHojaUsuariosPerfil(workbook, usuariosEspecialista, 'Especialistas');

    const usuariosPaciente = usuarios.filter(usuario => usuario.perfil === 'paciente');
    this.generarHojaUsuariosPerfil(workbook, usuariosPaciente, 'Pacientes');

    workbook.xlsx.writeBuffer().then(buffer => {
      this.guardarArchivoExcel(buffer, `Usuarios_${this.fechaArchivo()}.xlsx`);
    });

  };

  generarHojaUsuariosPerfil(workbook: ExcelJS.Workbook, usuarios: any[], perfil: string): void {
    const worksheet = workbook.addWorksheet(perfil);

    // Define los encabezados de columna para el perfil específico
    const headers = ['Nombre', 'Apellido', 'Edad', 'DNI', 'Email'];

    if (perfil === 'paciente') {
      headers.push('Obra Social', 'Foto Paciente');
    } else if (perfil === 'especialista') {
      headers.push('Especialidades', 'Cuenta Aprobada');
    }

    // Agrega los encabezados de columna a la hoja de cálculo
    worksheet.addRow(headers);

    // Agrega los datos de cada usuario a las filas de la hoja de cálculo
    usuarios.forEach((usuario: any) => {
      const row = [
        usuario.nombre,
        usuario.apellido,
        usuario.edad,
        usuario.dni,
        usuario.email,
      ];

      if (perfil === 'paciente') {
        const usuarioPaciente = usuario as UsuarioPaciente;
        row.push(usuarioPaciente.obraSocial, usuarioPaciente.fotoPaciente);
      } else if (perfil === 'especialista') {
        const usuarioEspecialista = usuario as UsuarioEspecialista;
        const especialidades = usuarioEspecialista.especialidades.map((especialidad: Especialidad) => especialidad.nombre).join(', ');
        row.push(especialidades, usuarioEspecialista.cuentaAprobada);
      }

      worksheet.addRow(row);
    });
  }

  guardarArchivoExcel(buffer: ArrayBuffer, nombreArchivo: string): void {
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);

    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  fechaArchivo(): string {
    let date = new Date();
    let fecha = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;
    return fecha;
  }
}
