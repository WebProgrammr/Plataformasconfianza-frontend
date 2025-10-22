import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../core/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  getUsuariosPendientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/pendientes`);
  }

  aprobarUsuario(id: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/aprobar/${id}`, {});
  }
}