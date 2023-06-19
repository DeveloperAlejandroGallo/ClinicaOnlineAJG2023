export class Fechas {
  public fecha: string = '';
  public hora: string = '';

  deISOaDate(fecha: string): Date {
    let fechaDate: Date = new Date(fecha);
    return fechaDate;
  }

  static getFechaGTMDesdeISO(fecha: string): string {
    let fechaDate: Date = new Date(fecha);
    return fechaDate.toLocaleString('es-AR', {timeZone: 'America/Argentina/Buenos_Aires'}).substring(0, 10);
  }

  static getHoraGTMDesdeISO(fecha: string): string {
    let fechaDate: Date = new Date(fecha);
    return fechaDate.toLocaleString('es-AR', {timeZone: 'America/Argentina/Buenos_Aires'}).substring(11, 16);
  }
}
