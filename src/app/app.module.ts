import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
// Peticiones Http
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { RegisterComponent } from './pages/register/register.component';

import { NgxCaptchaModule } from 'ngx-captcha';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminUsuariosComponent } from './pages/admin/admin-usuarios/admin-usuarios.component';
import { ErrorComponent } from './pages/error/error.component';
import { HighLigthDirective } from './directives/high-ligth.directive';
import { RegisterMenuComponent } from './pages/register-menu/register-menu.component';
import { TurnosTablaComponent } from './components/turnos-tabla/turnos-tabla.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { UsuarioTurnoComponent } from './pages/usuario/usuario-turno/usuario-turno.component';
import { FiltroTurnosPipe } from './pipes/filtro-turnos.pipe';
import { UsuarioPerfilComponent } from './pages/usuario/usuario-perfil/usuario-perfil.component';
import { FilterTurnosPendientesPipe } from './pipes/filter-turnos-pendientes.pipe';
import { UsuariosTablaComponent } from './components/usuarios-tabla/usuarios-tabla.component';
import { TimestampADatePipe } from './pipes/timestamp-adate.pipe';
import { HoverZoomDirective } from './directives/hover-zoom.directive';
import { DateisoToDatePipe } from './pipes/dateiso-to-date.pipe';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavBarComponent,
    HeaderComponent,
    AdminUsuariosComponent,
    ErrorComponent,
    HighLigthDirective,
    RegisterMenuComponent,
    TurnosTablaComponent,
    TurnosComponent,
    UsuarioTurnoComponent,
    FiltroTurnosPipe,
    UsuarioPerfilComponent,
    FilterTurnosPendientesPipe,
    UsuariosTablaComponent,
    TimestampADatePipe,
    HoverZoomDirective,
    DateisoToDatePipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxCaptchaModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
