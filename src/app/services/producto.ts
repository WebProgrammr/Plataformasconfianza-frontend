import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Producto, SaveProducto } from '../core/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrlPublic = `${environment.apiUrl}/api/productos`;
  private apiUrlAdmin = `${environment.apiUrl}/api/admin/productos`;

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrlPublic);
  }

  getProductosAdmin(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrlAdmin);
  }

  crearProducto(producto: SaveProducto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrlAdmin, producto);
  }

  actualizarProducto(id: number, producto: SaveProducto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrlAdmin}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlAdmin}/${id}`);
  }
}