import { Turno } from "./turno";
import { UsuarioEspecialista, UsuarioPaciente } from "./usuario";

export interface HistoriaClinica {
  id: string,
  turno: Turno,
  altura: number;
  peso: number;
  temperatura: number;
  presion: number;
  datosDinamicos: Array<{clave: string, valor: string}>
}
