import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminUsuariosComponent } from './pages/admin/admin-usuarios/admin-usuarios.component';
import { RegisterMenuComponent } from './pages/register-menu/register-menu.component';

const routes: Routes = [
  {path:'', pathMatch: 'full', redirectTo: 'login'},
  {path:'login', component: LoginComponent, data: { animation: 'login' } },
  {path:'home', component: HomeComponent, data: { animation: 'home' }},
  {path:'registro', component: RegisterMenuComponent, data: { animation: 'registro' }},
  {path:'admin/usuarios', component: AdminUsuariosComponent, data: { animation: 'adminusuarios' }},



  {path: '**', pathMatch: 'full', redirectTo: 'error'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
