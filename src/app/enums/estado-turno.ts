export enum EstadoTurno {
  Libre = "Libre", //Turno sin asignar
  Pendiente = "Pendiente", //Turno asignado a un paciente
  Aceptado = "Aceptado", //Turno aceptado por el especialista
  Rechazado = "Rechazado", //Turno rechazado por el especialista
  Cancelado = "Cancelado", //Turno cancelado por el paciente o especialista
  Realizado = "Realizado", //Turno realizado por el especialista
}
