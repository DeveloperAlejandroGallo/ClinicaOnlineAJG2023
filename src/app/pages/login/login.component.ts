import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
    private auth: AuthService,
    private usrService: UsuarioService) { }
  // Usuario = new Usuario();
  msg!: string;


  loginForm!: FormGroup;


  get emailLogin(){
    return this.loginForm.get('emailLogin');
  }
  get passwordLogin() {
    return this.loginForm.get('passwordLogin');
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailLogin: new FormControl('', [Validators.required, Validators.email]),
      passwordLogin: new FormControl('', Validators.required)
    },Validators.required);

    this.auth.cerrarSesion(); // cierro cualquier sesion abierta
  }

  public register() {
    this.router.navigate(['/registro']);
  }

  ingresoAutomatico(perfil: string){
    switch(perfil){
      case "admin":
        this.loginForm.setValue({emailLogin: "adminclinica1@yopmail.com", passwordLogin: "123456"});
        break;
      case "especialista":
        this.loginForm.setValue({emailLogin: "especialistaclinica1@yopmail.com", passwordLogin: "123456"});
        break;
      case "paciente":
        this.loginForm.setValue({emailLogin: "pacienteclinica1@yopmail.com", passwordLogin: "123456"});
        break;
    }

    this.onSubmitLogin();
  }


  onSubmitLogin() {
    let email = this.emailLogin?.value;
    let password = this.passwordLogin?.value;

    console.log(email,password)

    this.auth.iniciarSesion(email, password);

  }
}
