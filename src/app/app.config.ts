import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// --- CAMBIOS AQUÍ ---
// 1. Importa 'provideHttpClient' (el proveedor principal)
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
// --- FIN CAMBIOS ---

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // --- CONFIGURACIÓN CORRECTA ---

    // 2. Provee HttpClient y el soporte para interceptors de Clase
    provideHttpClient(withInterceptorsFromDi()),

    // 3. Provee tu interceptor (esto ya estaba bien)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};