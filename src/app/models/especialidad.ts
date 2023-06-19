export interface Especialidad {
  id: string;
  nombre: string;
  duracionTurno: number;
  diasDeAtencion: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]; //[0..6] -> 0=domingo
  consultorio: string;
  imagen: string;
}
