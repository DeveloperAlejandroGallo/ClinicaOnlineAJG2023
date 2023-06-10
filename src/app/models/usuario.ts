import { Especialidad } from "./especialidad";

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  email: string;
  clave: string;
  foto: string;
  logueado: boolean;
  perfil: string;
}


export interface UsuarioPaciente extends Usuario {
  obraSocial: string;
  fotoPaciente: string;
}

export interface UsuarioEspecialista extends Usuario{
  especialidades: Array<Especialidad>;
  cuentaAprobada: boolean;
}
