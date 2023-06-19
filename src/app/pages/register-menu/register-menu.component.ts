import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-menu',
  templateUrl: './register-menu.component.html',
  styleUrls: ['./register-menu.component.scss']
})
export class RegisterMenuComponent implements OnInit{

  perfilSeleccionado: string = "";
  verMenu: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {

  }


  seleccion(perfil: string){
    this.perfilSeleccionado = perfil;
    // this.router.navigate(['/registro'], { queryParams: { perfil: this.perfilSeleccionado } });
    this.router.navigate(['/registro', perfil]);
  }

  volver(){
    this.perfilSeleccionado = "";
    this.verMenu = true;
  }


}
