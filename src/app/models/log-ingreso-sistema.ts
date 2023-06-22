import { Usuario, UsuarioEspecialista } from "./usuario";

export interface LogIngresoSistema {
  id: string,
  fecha: string,
  usuario: Usuario
}
