import { inject } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MensajesService } from '../services/mensajes.service';

export const EstaLogueadoGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const mensajes = inject(MensajesService);

  if (authService.logueado()) {
    return true;
  }

  // Redirect to the login page
  mensajes.Error('Debe estar logueado para acceder a esta página');
  return router.parseUrl('/error');
};

