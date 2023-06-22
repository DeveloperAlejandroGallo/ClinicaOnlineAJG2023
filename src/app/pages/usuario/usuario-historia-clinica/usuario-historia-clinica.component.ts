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
        (h) => h.turno.paciente!.id == this.idPaciente
      );
    });
  }

  ngOnInit(): void {}

  async exportarHistoriaClinica() {
    const fechaEmision = new Date().toLocaleDateString('es-AR');
    // Obtener el paciente y sus historias clínicas (supongamos que están disponibles en variables)
    const paciente: UsuarioPaciente = this.paciente;





    // Definir el contenido del PDF
    const content: any[] = [
      // { image: await this.getBase64ImageFromURL('https://firebasestorage.googleapis.com/v0/b/clinica-online-ajg-2023.appspot.com/o/logo.png?alt=media&token=1c564431-fc63-486e-b9b4-0c0b1b7d8229'),
      // width: 100, alignment: 'center' },
      {
        text: 'Datos del Paciente',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      { text: `Fecha Emision: ${paciente.nombre} ${paciente.apellido} `},
      { text: `Nombre: ${paciente.nombre} ${paciente.apellido}` },
      { text: `Edad: ${paciente.edad}` },
      { text: `Obra Social: ${paciente.obraSocial}` },
      {
        text: 'Historias Clínicas',
        style: 'subheader',
      },
    ];

    // Agregar cada historia clínica al contenido del PDF

    const historiasTable = {
      style: 'tableExample',
      table: {
        widths: ['auto','auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          ['Fecha','Especialista', 'Altura', 'Peso', 'Temperatura', 'Presión'],
          // ...historiasClinicas.map((historiaClinica) => [historiaClinica.turno.especialista.nombre, historiaClinica.altura, historiaClinica.peso, historiaClinica.temperatura, historiaClinica.presion]),
        ]
      },
    }

    this.historiasClinicas.forEach((historiaClinica, index) => {

      historiasTable.table.body.push([
        `${this.fechaHoraTurno(historiaClinica.turno.fechaInicio)}`,
        `${historiaClinica.turno.especialista.nombre}, ${historiaClinica.turno.especialista.apellido}`,
        `${historiaClinica.altura} cm`,
        `${historiaClinica.peso} kg`,
        `${historiaClinica.temperatura} C°` ,
        `${historiaClinica.presion} hhmm` ]
      );

      content.push(historiasTable);
      content.push({text: '',
      style: 'subheader',margin: [0, 10, 0, 5]
    });

    const datosDinamicosTable = {
        style: 'tableExample',
        table: {
          widths: ['*', '*'],
          body: [
            ['Clave', 'Valor'],
            ...historiaClinica.datosDinamicos.map(dato => [dato.clave, dato.valor])
          ]
        },
        margin: [0, 5, 0, 15]
      };


      content.push({text: '',
        style: 'subheader',margin: [0, 10, 0, 5]
      });
    });


    const documentDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          // margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          aligment: 'left',
          // margin: [0, 10, 0, 5]
        },
        tableExample: {
          // margin: [0, 5, 0, 15]
        },
        tocItem: {},
      }
    };

    // Generar el archivo PDF
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.download(`${this.fechaArchivo()}_Historia_Clinica_${this.paciente.nombre}_${this.paciente.apellido}.pdf`);
    pdfDocGenerator.open();
  }

  fechaArchivo(): string {
    let date = new Date();
    let fecha = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}}`;
    return fecha;
  }

  fechaHoraTurno(fechaIn: string): string {
    let date = new Date(fechaIn);
    let fecha = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    return fecha;
  }

  async getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

} //FIN CLASE
