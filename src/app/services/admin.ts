import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importar HttpHeaders
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../core/models/usuario.model';
import { Recarga, RechazarRecargaPayload } from '../core/models/recarga.model';
import { Pedido } from '../core/models/pedido.model'; // <-- Importar Pedido

// Opcional: DTO para el cuerpo de la petición de actualizar estado
export interface UpdatePedidoEstadoPayload {
  nuevoEstado: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  // --- Métodos de Usuarios (sin cambios) ---
  getUsuariosPendientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/pendientes`);
  }
  aprobarUsuario(id: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/aprobar/${id}`, {});
  }

  // --- Métodos de Recargas (sin cambios) ---
  getRecargasPendientes(): Observable<Recarga[]> {
    return this.http.get<Recarga[]>(`${this.apiUrl}/recargas/pendientes`);
  }
  aprobarRecarga(id: number): Observable<Recarga> {
    return this.http.put<Recarga>(`${this.apiUrl}/recargas/aprobar/${id}`, {});
  }
  rechazarRecarga(id: number, motivo: string | null): Observable<Recarga> {
    const payload: RechazarRecargaPayload | {} = motivo ? { motivo: motivo } : {};
    return this.http.put<Recarga>(`${this.apiUrl}/recargas/rechazar/${id}`, payload);
  }

  // --- NUEVOS MÉTODOS PARA PEDIDOS ---

  /** Obtiene todos los pedidos (para el admin) */
  getAllPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedidos`);
  }

  /** Actualiza el estado de un pedido específico */
  updatePedidoEstado(pedidoId: number, nuevoEstado: string): Observable<Pedido> {
    const payload: UpdatePedidoEstadoPayload = { nuevoEstado };
    // Asegurarse de enviar el Content-Type correcto si el backend lo requiere explícitamente
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Pedido>(`${this.apiUrl}/pedidos/${pedidoId}/estado`, payload /*, { headers }*/);
  }
  // --- FIN NUEVOS MÉTODOS ---

}