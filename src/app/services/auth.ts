import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginPayload, RegistroPayload, LoginResponse } from '../core/models/api.models';
import { Usuario } from '../core/models/usuario.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) { }

  registrar(payload: RegistroPayload): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registrar`, payload);
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.saveRole(response.rol);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  saveRole(rol: string): void {
    localStorage.setItem('userRole', rol);
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }
}