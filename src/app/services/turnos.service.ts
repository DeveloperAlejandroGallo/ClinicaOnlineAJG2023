import { Injectable } from '@angular/core';
import {
  addDoc,
  and,
  collection,
  collectionChanges,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  Usuario,
  UsuarioEspecialista,
  UsuarioPaciente,
} from '../models/usuario';
import { Observable } from 'rxjs';
import { Turno } from '../models/turno';
import { EstadoTurno } from '../enums/estado-turno';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  colectionFirestore: string = 'turnos';
  coleccionUsuarios: CollectionReference<DocumentData>;
  listadoTurnos!: Array<Turno>;

  constructor(private firestore: Firestore) {
    this.coleccionUsuarios = collection(
      this.firestore,
      this.colectionFirestore
    );
  }

  actualizarFechaFin(id: string) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, id);

    let fecha = new Date();
    fecha.setHours(fecha.getHours() - 3);

    let estadoFechaUTC = fecha;
    fecha.setSeconds(0, 0);

    updateDoc(documento, {
      fechaFin: fecha.toISOString(),
      fechaEstado: estadoFechaUTC.toISOString(),
    });
  }

  cambiarEstado(id: string | undefined, estado: string) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, id);
    let fecha = new Date();
    fecha.setHours(fecha.getHours() - 3);
    updateDoc(documento, {
      estado: estado,
      fechaEstado: fecha.toISOString(),
    });
  }

  tomarTurno(turno: Turno) {
    throw new Error('Method not implemented.');
  }

  cambiarEstadoConComentario(
    id: string | undefined,
    estado: string,
    comentario: string,
    resenia: string
  ) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, id);

    let fecha = new Date();
    fecha.setHours(fecha.getHours() - 3);

    updateDoc(documento, {
      estado: estado,
      comentario: comentario,
      fechaEstado:fecha.toISOString(),
      resenia: resenia,
    });
  }

  cambiarEstadoConResenia(
    id: string | undefined,
    estado: string,
    resenia: string
  ) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, id);

    let fecha = new Date();
    fecha.setHours(fecha.getHours() - 3);

    updateDoc(documento, {
      estado: estado,
      resenia: resenia,
      fechaEstado: fecha.toISOString(),
    });
  }

  guardarEncuesta(id: string | undefined, encuesta: any) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, id);

    updateDoc(documento, {
      encuesta: encuesta,
    });
  }

  guardarCalificacion(id: string, calificacion: number) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, id);

    updateDoc(documento, {
      calificacion: calificacion,
    });
  }

  get allTurnos$(): Observable<Turno[]> {
    const ref = collection(this.firestore, this.colectionFirestore);

    const queryAll = query(
      ref,
      orderBy('fechaInicio', 'asc'),
      orderBy('especialidad', 'asc')
    );
    return collectionData(queryAll) as Observable<Turno[]>;
  }

  //Genericos
  llenarLista() {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const observable = collectionData(coleccion);

    this.allTurnos$.subscribe((respuesta) => {
      this.listadoTurnos = respuesta;
    });
  }

  delete(id: string) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, id);
    deleteDoc(documento);
  }

  //Usuario
  nuevo(turno: Turno) {
    const docuNuevo = doc(this.coleccionUsuarios);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      paciente: turno.paciente, //paciente que solicita el turno
      especialista: turno.especialista, //especialista que atiende el turno
      especialidad: turno.especialidad, //especialidad del turno
      fechaInicio: turno.fechaInicio, //fecha y hora de inicio del turno
      fechaFin: turno.fechaFin, //fecha y hora de fin del turno
      consultorio: turno.consultorio, //consultorio del turno
      estado: turno.estado, //estado del turno
      comentario: turno.comentario, //comentario del paciente
      resenia: turno.resenia, //resenia del especialista
      fechaEstado: turno.fechaEstado, //fecha y hora del cambio de estado del turno
      encuesta: turno.encuesta, //encuesta del turno
      valorizacion: turno.valorizacion, //valorizacion del turno
    });
  }

  actualizar(turno: Turno) {
    const coleccion = collection(this.firestore, this.colectionFirestore);
    const documento = doc(coleccion, turno.id);
    updateDoc(documento, {
      paciente: turno.paciente, //paciente que solicita el turno
      especialista: turno.especialista, //especialista que atiende el turno
      especialidad: turno.especialidad, //especialidad del turno
      fechaInicio: turno.fechaInicio, //fecha y hora de inicio del turno
      fechaFin: turno.fechaFin, //fecha y hora de fin del turno
      consultorio: turno.consultorio, //consultorio del turno
      estado: turno.estado, //estado del turno
      comentario: turno.comentario, //comentario del paciente
      resenia: turno.resenia, //resenia del especialista
      fechaEstado: turno.fechaEstado, //fecha y hora del cambio de estado del turno
      encuesta: turno.encuesta, //encuesta del turno
      valorizacion: turno.valorizacion, //valorizacion del turno
    });
  }

  altaTurnosTest() {}
}
