import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HistoriaClinica } from 'src/app/models/historia-clinica';
import { UsuarioPaciente } from 'src/app/models/usuario';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
      this.historiasClinicas = historias.filter((h)=> h.turno.paciente!.id == this.idPaciente);
    });
  }

  ngOnInit(): void {

  }


  exportarHistoriaClinica(){

  }

}
