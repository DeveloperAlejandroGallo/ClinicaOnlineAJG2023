import { Component, Input, OnInit } from '@angular/core';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import {
  Usuario,
  UsuarioEspecialista,
  UsuarioPaciente,
} from 'src/app/models/usuario';
import { Turno } from 'src/app/models/turno';
import { TurnosService } from 'src/app/services/turnos.service';
import { Router } from '@angular/router';
import { Perfil } from 'src/app/enums/perfiles';
import { Especialidad } from 'src/app/models/especialidad';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-usuario-card',
  templateUrl: './usuario-card.component.html',
  styleUrls: ['./usuario-card.component.scss'],
})
export class UsuarioCardComponent implements OnInit {
  @Input() usuarioSeleccionado!:
    | UsuarioPaciente
    | UsuarioEspecialista
    | Usuario;
  ultimos3TurnosTomados: Array<Turno> = [];
  especialidades: Array<Especialidad> = [];
  usuarioPaciente: UsuarioPaciente | undefined;
  usuarioEspecialista: UsuarioEspecialista | undefined;
  botonEspecialista: string = 'AprobarEspecialista';

  constructor(
    private turnosSrv: TurnosService,
    private router: Router,
    private usuariosSrv: UsuarioService,
    private mensajeSrv: MensajesService,
    private historiasClinicasSrv: HistoriaClinicaService
  ) {}

  ngOnInit(): void {
    console.log(this.usuarioSeleccionado);
    console.log(this.turnosSrv.listadoTurnos);
    this.ultimos3TurnosTomados = this.turnosSrv.listadoTurnos
      .filter(
        (turno) =>
          turno.paciente && turno.paciente!.id == this.usuarioSeleccionado!.id
      )
      .sort((a, b) => {
        //de mayor a menor
        if (new Date(a.fechaInicio) > new Date(b.fechaInicio)) {
          return -1;
        } else if (new Date(a.fechaInicio) < new Date(b.fechaInicio)) {
          return 1;
        } else {
          return 0;
        }
      })
      .slice(0, 3);

    if (this.usuarioSeleccionado.perfil == Perfil.especialista) {
      this.especialidades = (
        this.usuarioSeleccionado as UsuarioEspecialista
      ).especialidades;
      this.usuarioEspecialista = this
        .usuarioSeleccionado as UsuarioEspecialista;
      this.botonEspecialista = this.usuarioEspecialista.cuentaAprobada
        ? 'Cuenta aprobada'
        : 'Aprobar cuenta';
    } else {
      this.usuarioPaciente = this.usuarioSeleccionado as UsuarioPaciente;
    }
  }
  tieneCuentaAprobada() {
    return (
      this.usuarioSeleccionado?.perfil == Perfil.especialista &&
      (this.usuarioSeleccionado as UsuarioEspecialista).cuentaAprobada
    );
  }

  aprobarCuenta() {
    this.usuariosSrv.aprobarCuenta(
      this.usuarioSeleccionado as UsuarioEspecialista
    );
    this.mensajeSrv.Exito('Cuenta aprobada');
    this.usuarioEspecialista!.cuentaAprobada = true;
  }

  tieneHistoriaClinica() {
    return this.historiasClinicasSrv.lstHistoriasClinicas.some(
      (h) => h.turno.paciente?.id == this.usuarioSeleccionado?.id
    );
  }

  irAHistoriaClinica() {
    const id = this.usuarioSeleccionado?.id;
    const perfil = this.usuarioSeleccionado?.perfil;
    this.router.navigate(['/usuario/historiaClinica', id]);
  }

  exportarTurnos() {
    const workbook = new ExcelJS.Workbook();
    const turnos = this.turnosSrv.listadoTurnos.filter(
      (turno) =>
        (this.usuarioSeleccionado?.perfil == Perfil.especialista &&
          turno.especialista?.id == this.usuarioSeleccionado?.id) ||
        (this.usuarioSeleccionado?.perfil == Perfil.paciente &&
          turno.paciente?.id == this.usuarioSeleccionado?.id)
    );

    this.generarHojaTurnosPerfil(workbook, turnos);

    workbook.xlsx.writeBuffer().then((buffer) => {
      this.guardarArchivoExcel(
        buffer,
        `Turnos_${this.usuarioSeleccionado?.perfil}_${
          this.usuarioSeleccionado?.apellido
        }_${this.usuarioSeleccionado?.nombre}_${this.fechaArchivo()}.xlsx`
      );
    });
  }

  generarHojaTurnosPerfil(workbook: ExcelJS.Workbook, turnos: Turno[]): void {
    const perfil = this.usuarioSeleccionado?.perfil;
    const worksheet = workbook.addWorksheet(
      `Turnos ${perfil == Perfil.especialista ? 'Dados' : 'Tomados'}`
    );

    // Define los encabezados de columna para el perfil específico
    const headers = ['Fecha', 'Especialidad'];

    if (perfil === Perfil.paciente) {
      headers.push('Especialista');
    } else if (perfil === Perfil.especialista) {
      headers.push('Paciente');
    }

    // Agrega los encabezados de columna a la hoja de cálculo
    worksheet.addRow(headers);

    // Agrega los datos de cada usuario a las filas de la hoja de cálculo
    turnos.forEach((turno: any) => {
      const row = [turno.fechaInicio, turno.especialidad.nombre];

      if (perfil === Perfil.paciente) {
        row.push(
          turno.especialista.nombre + ', ' + turno.especialista.apellido
        );
      } else if (perfil === Perfil.especialista) {
        row.push(turno.paciente.nombre + ', ' + turno.paciente.apellido);
      }

      worksheet.addRow(row);
    });
  }

  guardarArchivoExcel(buffer: ArrayBuffer, nombreArchivo: string): void {
    const data = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(data);

    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  fechaArchivo(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    const formattedDate = `${year}-${month}-${day} ${hours}${minutes}`;

    return formattedDate;
  }
}
