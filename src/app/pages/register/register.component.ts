import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constantes } from 'src/app/models/constantes';
import { Especialidad } from 'src/app/models/especialidad';
import { Usuario, UsuarioEspecialista, UsuarioPaciente } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  @Input() perfilInput: string =  "";

  signUpForm!: FormGroup;
  usuarioConectado!: Usuario | UsuarioPaciente | UsuarioEspecialista | undefined;

  user!: Usuario | UsuarioPaciente | UsuarioEspecialista | undefined;
  listaEspecialidades!: Array<Especialidad>;
  especialidadesElegidas:  Array<Especialidad> = [];


  imgPaciente: string = "";
  imgPerfil: string = "";

  siteKey = environment.recaptcha.siteKey;

  public chkDisableCapcha: boolean = false;


  constructor(private router: Router,
    private auth: AuthService,
    private usrService: UsuarioService,
    private message: MensajesService,
    private imagenesService: ImagenesService,
    private especialidadesService: EspecialidadesService){

      this.siteKey = environment.recaptcha.siteKey;
      this.listaEspecialidades = this.especialidadesService.listadoEspecialidades;
    }

    //getters

    get nombre() {
      return this.signUpForm.get('nombre');
    }
    get apellido(){
      return this.signUpForm.get('apellido');
    }
    get edad(){
      return this.signUpForm.get('edad');
    }
    get dni(){
      return this.signUpForm.get('dni');
    }
    get email(){
      return this.signUpForm.get('email');
    }
    get imagenPerfil(){
      return this.signUpForm.get('imagenPerfil');
    }
    get password() {
      return this.signUpForm.get('password');
    }
    get passwordRep() {
      return this.signUpForm.get('passwordRep');
    }
    get tipo(){
      return this.signUpForm.get('tipo');
    }
    get obraSocial(){
      return this.signUpForm.get('obraSocial');
    }
    get fotoPaciente(){
      return this.signUpForm.get('fotoPaciente');
    }

    get nuevaEspecialidad(){
      return this.signUpForm.get('nuevaEspecialidad');
    }

    onRadioChange(event: any) {
      this.listaEspecialidades = this.especialidadesService.listadoEspecialidades;
    }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      nombre: new FormControl('',Validators.required),
      apellido: new FormControl('',Validators.required),
      edad: new FormControl('',Validators.required),
      dni: new FormControl('',[Validators.required, Validators.min(10000000), Validators.max(99999999)]),
      email: new FormControl('', Validators.email),
      imagenDePerfil: new FormControl('',Validators.required),
      password: new FormControl('',Validators.min(6)),
      passwordRep: new FormControl('',Validators.required),
      // tipo: new FormControl('',Validators.required),
      //paciente:
      obraSocial: new FormControl(''),
      fotoPaciente: new FormControl(''),
      recaptcha: new FormControl('',Validators.required),
      //Especialista
      nuevaEspecialidad: new FormControl(''),
    });

    this.usuarioConectado = this.auth.logInfo();
    this.listaEspecialidades = this.especialidadesService.listadoEspecialidades;
  }


  onSubmit() {
    let email = this.email?.value;
    let nombre = this.nombre?.value;
    let apellido = this.apellido?.value;
    let password = this.password?.value;
    let edad = this.edad?.value;
    let dni = this.dni?.value;
    let tipo = this.perfilInput;
    let obraSocial = this.obraSocial?.value;
    let fotoPaciente = "";
    let imagenDePerfil = "";


    let img = this.imagenesService.listaImagenes.filter(x=>x.nombre == this.imgPaciente)[0];
    if(img)
      fotoPaciente = img.url;

    img = this.imagenesService.listaImagenes.filter(x=>x.nombre == this.imgPerfil)[0];
    if(img)
      imagenDePerfil = img.url;

    if(this.existeUsuario(email))
    {
      this.message.Warning("El usuario ya se encuentra registrado");
      return;
    }

    if(password != this.passwordRep?.value)
    {
      this.message.Error("Las contraseñas son distintas ");
      return;
    }
    let usr: Usuario = {
      id: "",
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      email: email,
      clave: password,
      foto: imagenDePerfil,
      logueado: false,
      perfil: tipo
    };


    switch(tipo){
      case Constantes.perfilAdmin:
        usr.perfil = this.perfilInput;

        this.auth.registrarCuenta(usr);
        break;
      case Constantes.perfilPaciente:
        let usrPaciente: UsuarioPaciente = {
          ...usr,
          obraSocial: obraSocial,
          fotoPaciente: fotoPaciente,
        };
        this.auth.registrarCuenta(usrPaciente);
        break;
      case Constantes.perfilEspecialista:
        if(this.especialidadesElegidas.length == 0){
          this.message.Info("Debe elegir al menos una especialidad");
          return;
        }
        let usrDoctor: UsuarioEspecialista = {
          ...usr,
          especialidades: this.especialidadesElegidas,
          cuentaAprobada: false
        };
        this.auth.registrarCuenta(usrDoctor);
        this.signUpForm.reset();
        break;
    }



  }


  existeUsuario(email: string): boolean{

    let usrBuscado = this.usrService.listadoUsuarios?.find(x=>x.email == email);
    return usrBuscado != undefined ? true : false ;
  }

  subirImagen($event: any, tipo: string){
    const file = $event.target.files[0];
    if(tipo == 'perfil'){
      this.imgPerfil = file.name;
    }else{
      this.imgPaciente = file.name;
    }

    this.imagenesService.uploadImage($event);
  }

  agregarEspecialidad(e:any) {

    this.especialidadesElegidas.push(this.especialidadesService.listadoEspecialidades.filter(x=>x.nombre == e.target.value)[0]);

  }

  quitarEspecialidad(especialidad:Especialidad){
    this.especialidadesElegidas = this.especialidadesElegidas.filter(x => x.id != especialidad.id);
  }

  EspecialidadAgregada(){
    let espe: Especialidad = {
      id: "",
      nombre: this.nuevaEspecialidad?.value,
      duracionTurno: 30
    }
    espe.nombre = espe.nombre.toUpperCase();
    this.especialidadesService.nuevaEspecialidad(espe);

    setTimeout(() => {
      this.listaEspecialidades = this.especialidadesService.listadoEspecialidades;
      this.especialidadesElegidas.push(this.listaEspecialidades.filter(x=>x.nombre == espe.nombre)[0]);
      this.message.Exito(`Especialidad ${espe.nombre} agreagada correctamente`)
    }, 500);

  }

}
