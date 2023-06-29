import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HistoriaClinica } from 'src/app/models/historia-clinica';
import { UsuarioPaciente } from 'src/app/models/usuario';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { UsuarioService } from 'src/app/services/usuario.service';
//PDF
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { environment } from 'src/environments/environment';
import { Especialidad } from 'src/app/models/especialidad';
import { Observable, distinct, map } from 'rxjs';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-usuario-historia-clinica',
  templateUrl: './usuario-historia-clinica.component.html',
  styleUrls: ['./usuario-historia-clinica.component.scss'],
})
export class UsuarioHistoriaClinicaComponent implements OnInit {
  idPaciente: string = '';
  paciente!: UsuarioPaciente;
  perfil: string = '';
  formHistoriaClinica!: FormGroup;
  disableFormControl: boolean = false;

  historiasClinicas: HistoriaClinica[] = [];
  listaEspecialidadesDelPaciente: Array<Especialidad> = [];
  especialidadSeleccionadaId: string = '';

  especialidades$: Observable<Especialidad[]> =
    this.historiasSrv.allHistoriasClinicas$.pipe(
      map((hc) =>
        hc
          .filter((h) => h.turno.paciente!.id == this.idPaciente)
          .map((hc) => hc.turno.especialidad!)
      ),
      distinct((especialidad) => especialidad)
    );

  constructor(
    private activeRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private historiasSrv: HistoriaClinicaService
  ) {
    this.idPaciente = this.activeRoute.snapshot.params['id'];
    this.paciente = this.usuarioService.getPacienteById(this.idPaciente);
    console.log(this.paciente);

    this.historiasSrv.allHistoriasClinicas$.subscribe((historias) => {
      this.historiasClinicas = historias.filter(
        (h) =>
          (h.turno.paciente!.id == this.idPaciente &&
            !this.especialidadSeleccionadaId) ||
          (h.turno.paciente!.id == this.idPaciente &&
            this.especialidadSeleccionadaId &&
            h.turno.especialidad!.id == this.especialidadSeleccionadaId)
      );
    });

    this.especialidades$.subscribe((especialidades) => {
      this.listaEspecialidadesDelPaciente = especialidades;
    });
  }

  ngOnInit(): void {}

  cambiarEspecialidad() {
    this.historiasClinicas = this.historiasSrv.lstHistoriasClinicas.filter(h =>h.turno.paciente!.id == this.idPaciente);
    console.log(1,this.historiasClinicas);
    console.log(this.especialidadSeleccionadaId);
    if (this.especialidadSeleccionadaId != '') {
      console.log("entro igual")
      this.historiasClinicas = this.historiasSrv.lstHistoriasClinicas.filter(h =>h.turno.paciente!.id == this.idPaciente && h.turno.especialidad!.id == this.especialidadSeleccionadaId);
    }
    console.log(2,this.historiasClinicas);
  }

  exportarHistoriaClinica() {
    const fechaEmision = new Date().toLocaleDateString('es-AR');
    // Obtener el paciente y sus historias clínicas (supongamos que están disponibles en variables)
    const paciente: UsuarioPaciente = this.paciente;

    // Definir el contenido del PDF
    const content: any[] = [
      { text: `Fecha Emisión: ${fechaEmision} `, alignment: 'right' },
      { image: environment.imagenClinica, width: 100, alignment: 'center' },
      {
        text: 'Historia Clinica',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      {
        text: `${paciente.nombre} ${paciente.apellido}`,
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      { text: '', style: 'subheader', margin: [0, 10, 0, 5] },
      { text: `Edad: ${paciente.edad}` },
      { text: `Obra Social: ${paciente.obraSocial}` },
      { text: `D.N.I: ${paciente.dni}` },
      { text: '', style: 'subheader', margin: [0, 10, 0, 5] },
      {
        text: 'Atenciones realizadas:',
        style: 'subheader',
      },
    ];

    // Agregar cada historia clínica al contenido del PDF



    this.historiasClinicas.forEach((historiaClinica, index) => {

      content.push({ text: `Turno: ${this.fechaHoraTurno(historiaClinica.turno.fechaInicio)}`, style: 'title', margin: [0, 10, 0, 5] },);

      const historiasTable = {
        style: 'tableExample',
        table: {
          widths: ['auto', 'auto', 'auto','auto', 'auto', 'auto'],
          body: [
            ['Especialista', 'Especialidad','Altura', 'Peso', 'Temperatura', 'Presión'],
            // ...historiasClinicas.map((historiaClinica) => [historiaClinica.turno.especialista.nombre, historiaClinica.altura, historiaClinica.peso, historiaClinica.temperatura, historiaClinica.presion]),
          ],
          bold: true,
        },
      };

      console.log(historiasTable.table.body);
      historiasTable.table.body.push([
        `${historiaClinica.turno.especialista.nombre}, ${historiaClinica.turno.especialista.apellido}`,
        `${historiaClinica.turno.especialidad.nombre.toLocaleUpperCase()}`,
        `${historiaClinica.altura} cm`,
        `${historiaClinica.peso} kg`,
        `${historiaClinica.temperatura} C°`,
        `${historiaClinica.presion} hhmm`,
      ]);

      content.push(historiasTable);
      content.push({ text: 'Datos Dinámicos', style: 'title', margin: [0, 10, 0, 5] });
      const datosDinamicosTable = {
        style: 'tableExample',
        table: {
          widths: ['auto', 'auto'],
          body: [
            ['Clave', 'Valor'],
            ...historiaClinica.datosDinamicos.map((dato) => [
              dato.clave,
              dato.valor,
            ]),
          ],
          bold: true,
        },
        margin: [0, 5, 0, 15],
      };
      content.push(datosDinamicosTable);

      content.push({ canvas: [{ type: 'line', x1: 0, y1: 10, x2: 595, y2: 10, lineWidth: 1 }] },);
      content.push({ text: '', style: 'subheader', margin: [0, 10, 0, 5] });
    });

    const documentDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,

        },
        subheader: {
          fontSize: 14,
          bold: true,
          aligment: 'left',

        },
        tableExample: {
          fontSize: 10,
          bold: true,
          fillColor: '#c9f6ff',

        },
        tocItem: {},
        title: {
          fontSize: 12,
          color: 'blue',

        }
      },
    };

    // Generar el archivo PDF
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.download(
      `${this.fechaArchivo()}_Historia_Clinica_${this.paciente.nombre}_${
        this.paciente.apellido
      }.pdf`
    );
  }

  fechaArchivo(): string {
    let date = new Date();
    let fecha = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    return fecha;
  }

  fechaHoraTurno(fechaIn: string): string {
    let date = new Date(fechaIn);
    let fecha = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    return fecha;
  }

  async getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }
} //FIN CLASE
