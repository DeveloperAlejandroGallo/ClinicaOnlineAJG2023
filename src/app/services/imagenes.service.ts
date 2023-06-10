import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { MensajesService } from './mensajes.service';
import { Imagen } from '../models/imagen';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  listaImagenes: Array<Imagen>;

  constructor(private storage: Storage, private messages: MensajesService) {
    this.listaImagenes = [];
  }

  uploadImage($event: any) {
    const file = $event.target.files[0];


    const imgRef = ref(this.storage, `${file.name}`);

    uploadBytes(imgRef, file)
      .then(response => {

        this.getImages();
        this.messages.Info('Imagen subida correctamente');
      })
      .catch(error => console.log(error));

  }

  getImages() {
    const imagesRef = ref(this.storage);

    listAll(imagesRef)
      .then(async response => {
        console.log(response);
        this.listaImagenes = [];
        for (let item of response.items) {
          const url = await getDownloadURL(item);
          this.listaImagenes.push({nombre: item.name,url:url});
        }
      })
      .catch(error => console.log(error));
  }

}
