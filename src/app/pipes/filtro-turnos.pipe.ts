import { Pipe, PipeTransform } from '@angular/core';
import { Turno } from '../models/turno';
import { Usuario } from '../models/usuario';

@Pipe({
  name: 'filtroTurnos'
})
export class FiltroTurnosPipe implements PipeTransform {

  transform(turnos: Array<Turno>, usuario: Usuario | null | undefined, filtro: string = ''): Array<Turno> {


    if (usuario!.perfil != 'especialista') { //paciente o admin
      if(filtro == '')
        return turnos;

      return turnos.filter(turno => turno.especialista.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                    turno.especialista.apellido.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                    turno.especialidad.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase())
                                    );
    }
    //especialista
    if(filtro == '')
      return turnos.filter(turno => turno.especialista.id == usuario!.id);

    return turnos.filter(turno => turno.especialista.id == usuario!.id &&
                                  (turno.paciente!.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                  turno.paciente!.apellido.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
                                  turno.especialidad.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()))
                                  );


  }

}
