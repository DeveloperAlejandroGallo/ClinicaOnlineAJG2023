import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminUsuariosComponent } from './pages/admin/admin-usuarios/admin-usuarios.component';
import { RegisterMenuComponent } from './pages/register-menu/register-menu.component';
import { UsuarioTurnoComponent } from './pages/usuario/usuario-turno/usuario-turno.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { UsuarioPerfilComponent } from './pages/usuario/usuario-perfil/usuario-perfil.component';
import { EstaLogueadoGuard } from './guards/esta-logueado.guard';
import { ErrorComponent } from './pages/error/error.component';
import { UsuarioHistoriaClinicaComponent } from './pages/usuario/usuario-historia-clinica/usuario-historia-clinica.component';
import { EspecialistaPacientesComponent } from './pages/especialista/especialista-pacientes/especialista-pacientes.component';

const routes: Routes = [
  {path:'', pathMatch: 'full', redirectTo: 'login'},
  {path:'login', component: LoginComponent, data: { animation: 'login' } },
  {path:'home', component: HomeComponent, data: { animation: 'home' }},
  {path:'registro-menu', component: RegisterMenuComponent, data: { animation: 'registro' }},
  {path:'registro/:perfil', component: RegisterComponent, data: { animation: 'login' }},
  {path:'admin/usuarios', component: AdminUsuariosComponent, data: { animation: 'home' }},
  {path:'usuario/turnos', component: UsuarioTurnoComponent, data: { animation: 'login' }, canActivate:[EstaLogueadoGuard]},
  {path:'usuario/sacarTurno', component: TurnosComponent, data: { animation: 'registro' }, canActivate:[EstaLogueadoGuard]},
  {path:'usuario/perfil', component: UsuarioPerfilComponent, data: { animation: 'home' }, canActivate:[EstaLogueadoGuard]},
  {path:'usuario/historiaClinica/:id', component: UsuarioHistoriaClinicaComponent, canActivate:[EstaLogueadoGuard]},
  {path:'especialista/pacientes', component: EspecialistaPacientesComponent, data: { animation: 'home' }, canActivate:[EstaLogueadoGuard]},

  {path: 'error', component: ErrorComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'error'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
