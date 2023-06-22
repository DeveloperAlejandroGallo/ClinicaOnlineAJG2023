import { Injectable } from '@angular/core';
import { addDoc, collection, collectionChanges, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Especialidad } from '../models/especialidad';
import { LogIngresoSistema } from '../models/log-ingreso-sistema';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { HistoriaClinica } from '../models/historia-clinica';


@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  colectionName: string = 'historiaClinica';
  coleccionRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionRef = collection(this.firestore, this.colectionName);
   }

  lstHistoriasClinicas!: Array<HistoriaClinica>;


get allHistoriasClinicas$(): Observable<HistoriaClinica[]> {
  const ref = collection(this.firestore, this.colectionName);
  const queryAll = query(ref);
  return collectionData(queryAll) as Observable<HistoriaClinica[]>;
}

  llenarLstHistoriasClinicas(){
    this.allHistoriasClinicas$.subscribe((respuesta)=>{
      this.lstHistoriasClinicas = respuesta as Array<HistoriaClinica>;
    });
  }



  nuevaHistoriaClinica(historia: HistoriaClinica) {

    const docuNuevo = doc(this.coleccionRef);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      turno: historia.turno,
      altura: historia.altura,
      peso: historia.peso,
      temperatura: historia.temperatura,
      presion: historia.presion,
      datosDinamicos: historia.datosDinamicos,
    });
  }



}
