import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
// **** Importar la nueva interfaz ****
import { PedidoPayload, DashboardSummary } from '../core/models/api.models';
import { Pedido } from '../core/models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/api/pedidos`;
  private apiUrlCliente = `${environment.apiUrl}/api/cliente`;


  constructor(private http: HttpClient) { }

  crearPedido(pedido: PedidoPayload): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  getMisPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrlCliente}/pedidos`);
  }

  // **** NUEVO MÉTODO PARA OBTENER RESUMEN DEL DASHBOARD ****
  getDashboardSummary(): Observable<DashboardSummary> {
    // Llama al endpoint /api/cliente/summary
    // El AuthInterceptor se encarga del token
    return this.http.get<DashboardSummary>(`${this.apiUrlCliente}/summary`);
  }
  // **** FIN NUEVO MÉTODO ****
}