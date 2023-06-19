import { EstadoTurno } from "../enums/estado-turno";
import { Especialidad } from "./especialidad";
import { UsuarioEspecialista, UsuarioPaciente } from "./usuario";

export interface Turno {
  id: string; //id del turno
  paciente: UsuarioPaciente | null; //paciente que solicita el turno
  especialista: UsuarioEspecialista; //especialista que atiende el turno
  especialidad: Especialidad; //especialidad del turno
  fechaInicio: string; //fecha y hora de inicio del turno
  fechaFin: string | undefined | null; //fecha y hora de fin del turno
  consultorio: string; //consultorio del turno
  estado: EstadoTurno; //estado del turno
  comentario: string; //comentario del paciente
  resenia: string; //resenia del especialista
  fechaEstado: string; //fecha y hora del cambio de estado del turno
  encuesta: string,//Encuesta; //encuesta del turno
  valorizacion: number; //valorizacion del turno
}


export interface Encuesta {
  id: string; //id de la encuesta
  preguntasYPuntajes:Array<{pregunta: string, puntaje: number}>; //preguntas y puntajes de la encuesta
  comentarios: string; //comentarios de la encuesta
}
