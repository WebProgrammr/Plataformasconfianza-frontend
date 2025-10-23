// src/app/services/recarga.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Recarga } from '../core/models/recarga.model';
import { RecargaRequestPayload } from '../core/models/api.models';

@Injectable({
  providedIn: 'root'
})
export class RecargaService {

  private apiUrlCliente = `${environment.apiUrl}/api/cliente`;

  constructor(private http: HttpClient) { }

  solicitarRecarga(payload: RecargaRequestPayload): Observable<Recarga> {
    return this.http.post<Recarga>(`${this.apiUrlCliente}/recargas`, payload);
  }
}