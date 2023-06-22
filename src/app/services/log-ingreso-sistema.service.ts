import { Injectable } from '@angular/core';
import { addDoc, collection, collectionChanges, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Especialidad } from '../models/especialidad';
import { LogIngresoSistema } from '../models/log-ingreso-sistema';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class LogIngresoSistemaService {

  colectionName: string = 'logIngresoSistema';
  coleccionLogIngresoSistema: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionLogIngresoSistema = collection(this.firestore, this.colectionName);
   }

  listadoLogs!: Array<LogIngresoSistema>;


get allLog$(): Observable<LogIngresoSistema[]> {
  const ref = collection(this.firestore, this.colectionName);
  const queryAll = query(ref);
  return collectionData(queryAll) as Observable<LogIngresoSistema[]>;
}

  llenarlstLosg(){
    this.allLog$.subscribe((respuesta)=>{
      this.listadoLogs = respuesta as Array<LogIngresoSistema>;
    });
  }



  registrarIngreso(usr: Usuario) {

    const docuNuevo = doc(this.coleccionLogIngresoSistema);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      fecha: new Date().toISOString(),
      usuario: usr
    });
  }



}
