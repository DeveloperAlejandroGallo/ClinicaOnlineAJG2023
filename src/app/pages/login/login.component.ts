import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Usuario,
  UsuarioEspecialista,
  UsuarioPaciente,
} from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private usrService: UsuarioService
  ) {}
  // Usuario = new Usuario();
  adminIco: string = '';
  especialista1Ico: string = '';
  especialista2Ico: string = '';
  paciente1Ico: string = '';
  paciente2Ico: string = '';
  paciente3Ico: string = '';

  msg!: string;

  loginForm!: FormGroup;

  get emailLogin() {
    return this.loginForm.get('emailLogin');
  }
  get passwordLogin() {
    return this.loginForm.get('passwordLogin');
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup(
      {
        emailLogin: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        passwordLogin: new FormControl('', Validators.required),
      },
      Validators.required
    );

    this.auth.cerrarSesion(); // cierro cualquier sesion abierta

    this.usrService.allUsers$.subscribe((users) => {
      users.forEach((usr) => {
        switch (usr.email) {
          case 'adminclinica1@yopmail.com':
            this.adminIco = usr.foto;
            break;
          case 'especialistaclinica1@yopmail.com':
            this.especialista1Ico = usr.foto;
            break;
          case 'especialistaclinica2@yopmail.com':
            this.especialista2Ico = usr.foto;
            break;
          case 'pacienteclinica1@yopmail.com':
            this.paciente1Ico = usr.foto;
            break;
          case 'pacienteclinica2@yopmail.com':
            this.paciente2Ico = usr.foto;
            break;
          case 'pacienteclinica3@yopmail.com':
            this.paciente3Ico = usr.foto;
            break;
        }
      });

      console.log(users);

    });





    console.log(this.adminIco);
    console.log(this.especialista1Ico);
    console.log(this.especialista2Ico);
    console.log(this.paciente1Ico);
    console.log(this.paciente2Ico);
    console.log(this.paciente3Ico);
  }

  public register() {
    this.router.navigate(['/registro']);
  }

  ingresoAutomatico(perfil: string) {
    switch (perfil) {
      case 'admin':
        this.loginForm.setValue({
          emailLogin: 'adminclinica1@yopmail.com',
          passwordLogin: '123456',
        });
        break;
      case 'especialista1':
        this.loginForm.setValue({
          emailLogin: 'especialistaclinica1@yopmail.com',
          passwordLogin: '123456',
        });
        break;
      case 'especialista2':
        this.loginForm.setValue({
          emailLogin: 'especialistaclinica2@yopmail.com',
          passwordLogin: '123456',
        });
        break;
      case 'paciente1':
        this.loginForm.setValue({
          emailLogin: 'pacienteclinica1@yopmail.com',
          passwordLogin: '123456',
        });
        break;
      case 'paciente2':
        this.loginForm.setValue({
          emailLogin: 'pacienteclinica2@yopmail.com',
          passwordLogin: '123456',
        });
        break;
      case 'paciente3':
        this.loginForm.setValue({
          emailLogin: 'pacienteclinica3@yopmail.com',
          passwordLogin: '123456',
        });
        break;
    }

    this.onSubmitLogin();
  }

  onSubmitLogin() {
    let email = this.emailLogin?.value;
    let password = this.passwordLogin?.value;

    this.auth.iniciarSesion(email, password);
  }
}
