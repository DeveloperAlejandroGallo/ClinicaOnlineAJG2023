import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-register-menu',
  templateUrl: './register-menu.component.html',
  styleUrls: ['./register-menu.component.scss']
})
export class RegisterMenuComponent implements OnInit{

  perfilSeleccionado: string = "";
  verMenu: boolean = true;


  ngOnInit(): void {

  }


  seleccion(perfil: string){
    this.perfilSeleccionado = perfil;
    this.verMenu = false;
  }

  volver(){
    this.perfilSeleccionado = "";
    this.verMenu = true;
  }

}
