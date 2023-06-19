import { UsuarioPaciente } from "./usuario";

export interface HistoriaClinica {
  paciente: UsuarioPaciente;
  altura: number;
  peso: number;
  temperatura: number;
  presion: number;
  datosDinamicos: Array<{clave: string, valor: string}>
}
