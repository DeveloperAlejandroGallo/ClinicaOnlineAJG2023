import { Pipe, PipeTransform } from '@angular/core';
import { Turno } from '../models/turno';
import { Especialidad } from '../models/especialidad';
import { UsuarioEspecialista } from '../models/usuario';

@Pipe({
  name: 'filterTurnosPendientes'
})
export class FilterTurnosPendientesPipe implements PipeTransform {

  transform(turnos: Array<Turno>, especialidad: Especialidad | null, especialista: UsuarioEspecialista | null): Array<Turno> {

    let result: Array<Turno> = [];

    if(especialidad != null && especialista != null){
      result.push(...turnos.filter(turno => turno.especialidad.id == especialidad.id && turno.especialista.id == especialista.id));
    }

    if(especialista != null  && especialidad == null){
      result.push(...turnos.filter(turno => turno.especialista.id == especialista!.id));
    }

    if(especialidad != null  && especialista == null){
      result.push(...turnos.filter(turno => turno.especialidad.id == especialidad!.id));
    }
    return result;

  }

}
