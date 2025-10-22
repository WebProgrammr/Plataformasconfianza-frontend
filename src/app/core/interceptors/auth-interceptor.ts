import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private apiUrl = environment.apiUrl;

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const token = this.authService.getToken();

    // Solo añadimos el token si la petición va a nuestra API y el token existe
    if (token && request.url.startsWith(this.apiUrl)) {
      
      // Clonamos la petición para añadir el nuevo encabezado
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Enviamos la petición clonada con el encabezado
      return next.handle(clonedRequest);
    }

    // Si no hay token o la petición no es a nuestra API, la dejamos pasar sin modificar
    return next.handle(request);
  }
}