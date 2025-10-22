import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Resena, SaveResena } from '../core/models/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private apiUrl = `${environment.apiUrl}/api/resenas`;

  constructor(private http: HttpClient) { }

  getResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.apiUrl);
  }

  crearResena(resena: SaveResena): Observable<Resena> {
    return this.http.post<Resena>(this.apiUrl, resena);
  }
}