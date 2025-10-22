import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { PedidoPayload } from '../core/models/api.models';
import { Pedido } from '../core/models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/api/pedidos`;

  constructor(private http: HttpClient) { }

  crearPedido(pedido: PedidoPayload): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }
}