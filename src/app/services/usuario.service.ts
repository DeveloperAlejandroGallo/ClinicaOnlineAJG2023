import { Injectable } from '@angular/core';
import { addDoc, collection, collectionChanges, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from '../models/usuario';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  colectionName: string = 'usuarios';
  coleccionUsuarios: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionUsuarios = collection(this.firestore, this.colectionName);
   }

  listadoUsuarios!: Array<UsuarioEspecialista | UsuarioPaciente | Usuario>;

//Genericos
  traer(){
    const coleccion = collection(this.firestore, this.colectionName);
    const observable = collectionData(coleccion);

    observable.subscribe((respuesta)=>{
      this.listadoUsuarios = respuesta as Array<Usuario>;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevoAdmin(usuario: Usuario) {

    console.log('usuario admin',usuario);
    const docuNuevo = doc(this.coleccionUsuarios);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
      foto: usuario.imagenDePerfil,
      esAdmin: true
    });
  }
  nuevoPaciente(usuario: UsuarioPaciente) {

    const docuNuevo = doc(this.coleccionUsuarios);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
      foto: usuario.imagenDePerfil,
      esAdmin: false,
      obraSocial: usuario.obraSocial,
      fotoPaciente: usuario.fotoPaciente,
    });
  }

  nuevoEspecialista(usuario: UsuarioEspecialista) {

    const docuNuevo = doc(this.coleccionUsuarios);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
      foto: usuario.imagenDePerfil,
      esAdmin: false,
      especialidades: usuario.especialidades,
      cuentaAprobada: usuario.cuentaAprobada
    });
  }

  actualizarAdmin(usuario: Usuario) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);
    updateDoc(documento, {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
      foto: usuario.imagenDePerfil,
      esAdmin: true
    });
  }
  actualizarPaciente(usuario: UsuarioPaciente) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);
    updateDoc(documento, {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
      foto: usuario.imagenDePerfil,
      esAdmin: false,
      obraSocial: usuario.obraSocial,
      fotoPaciente: usuario.fotoPaciente,
    });
  }

  actualizarEspecialista(usuario: UsuarioEspecialista) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);
    updateDoc(documento, {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
      foto: usuario.imagenDePerfil,
      esAdmin: false,
      especialidades: usuario.especialidades,
      cuentaAprobada: usuario.cuentaAprobada
    });
  }


  aprobarCuenta(usuario: Usuario){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);
    updateDoc(documento,{
      cuentaAprobada: true
    })
  }

  existeUsuario(email: string): boolean{
    let usrBuscado = this.listadoUsuarios?.find(x=>x.email == email);
    return usrBuscado != undefined ? true : false ;
  }
}
