import { Pipe, PipeTransform } from '@angular/core';
import { Turno } from '../models/turno';
import { Usuario } from '../models/usuario';
import { HistoriaClinicaService } from '../services/historia-clinica.service';

@Pipe({
  name: 'filtroTurnos'
})
export class FiltroTurnosPipe implements PipeTransform {

  constructor(private historiasCliSrv: HistoriaClinicaService) { }

  transform(turnos: Array<Turno>, usuario: Usuario | null | undefined, filtro: string = ''): Array<Turno> {


    if (usuario!.perfil != 'especialista') { //paciente o admin
      if(filtro == '')
        return turnos;

      return turnos.filter(turno => turno.especialista.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                    turno.especialista.apellido.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                    turno.especialidad.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                    this.tieneHistoriaConDato(turno.id, filtro)
                                    );
    }
    //especialista
    if(filtro == '')
      return turnos.filter(turno => turno.especialista.id == usuario!.id);

    return turnos.filter(turno => turno.especialista.id == usuario!.id &&
                                  (turno.paciente!.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                  turno.paciente!.apellido.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                  turno.especialidad.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase())) ||
                                  this.tieneHistoriaConDato(turno.id, filtro)
                                  );


  }

  tieneHistoriaConDato(id: string, filtro: string): boolean {
    let result = false;

    result = this.historiasCliSrv.lstHistoriasClinicas.some(historia => historia.turno.id == id &&
      (historia.altura.toString().toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
      historia.peso.toString().toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
      historia.temperatura.toString().toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
      historia.presion.toString().toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
      this.datosDinamicosContieneFiltro(historia.datosDinamicos, filtro)
      ));

    return result;
  }
  datosDinamicosContieneFiltro(datosDinamicos: { clave: string; valor: string; }[], filtro: string): boolean {
    let result = false;

    result = datosDinamicos.some(dato => {dato.clave.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
      dato.valor.toLocaleLowerCase().includes(filtro.toLocaleLowerCase())});

    return result;
  }



}
