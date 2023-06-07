import { Injectable } from '@angular/core';
import { addDoc, collection, collectionChanges, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Especialidad } from '../models/especialidad';


@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  colectionName: string = 'especialidades';
  coleccionUsuarios: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionUsuarios = collection(this.firestore, this.colectionName);
   }

  listadoEspecialidades!: Array<Especialidad>;

//Genericos
  traerEspecialidades(){
    const coleccion = collection(this.firestore, this.colectionName);
    const observable = collectionData(coleccion);

    observable.subscribe((respuesta)=>{
      this.listadoEspecialidades = respuesta as Array<Especialidad>;
    });
  }



  eliminarEspecialidad(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevaEspecialidad(especialidad: Especialidad) {

    const docuNuevo = doc(this.coleccionUsuarios);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      nombre: especialidad.nombre,
      duracionTurno: especialidad.duracionTurno
    });
  }



  updateEspecialidad(especialidad: Especialidad){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,especialidad.id);
    updateDoc(documento,{
      nombre: especialidad.nombre,
      duracionTurno: especialidad.duracionTurno
    })
  }

}
