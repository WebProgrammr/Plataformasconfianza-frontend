import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { PedidoService } from '../../../services/pedido';
import { Pedido } from '../../../core/models/pedido.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductoService } from '../../../services/producto';
import { Producto } from '../../../core/models/producto.model';
import { forkJoin, map } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './mis-pedidos.html',
  styleUrls: ['./mis-pedidos.scss'] // Usaremos este archivo SCSS dedicado
})
export class MisPedidos implements OnInit {

  misPedidos: Pedido[] = [];
  productosMap: Map<number, Producto> = new Map();
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private pedidoService: PedidoService,
    private productoService: ProductoService
    ) {}

  ngOnInit(): void {
    this.cargarPedidosYProductos();
  }

  cargarPedidosYProductos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      pedidos: this.pedidoService.getMisPedidos(),
      productos: this.productoService.getProductos()
    }).pipe(
      map(results => {
        this.productosMap.clear();
        results.productos.forEach(p => this.productosMap.set(p.id, p));
        return results.pedidos;
      })
    ).subscribe({
      next: (data: Pedido[]) => {
        this.misPedidos = data;
        this.isLoading = false;
        console.log('Pedidos cargados:', this.misPedidos);
        console.log('Mapa de productos:', this.productosMap);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar mis pedidos o productos:', err);
        if (err.status === 401) {
             this.errorMessage = 'No estás autorizado para ver esta sección. Por favor, inicia sesión de nuevo.';
        } else {
             this.errorMessage = 'No se pudieron cargar tus pedidos. Intenta más tarde.';
        }
        this.isLoading = false;
      }
    });
  }

  getNombreProducto(idProducto: number): string {
    return this.productosMap.get(idProducto)?.nombre || 'Producto Desconocido';
  }

  getPrecioProducto(idProducto: number): number | undefined {
    const producto = this.productosMap.get(idProducto);
    return producto?.precio ? +producto.precio : undefined;
  }

  getEstadoClass(estado: string | null | undefined): string {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADO': return 'status-completed';
      case 'PENDIENTE': return 'status-pending';
      case 'CANCELADO': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  // **** NUEVA FUNCIÓN PARA ICONO DE ESTADO ****
  getEstadoIconClass(estado: string | null | undefined): string {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADO': return 'fas fa-check-circle'; // Icono de check
      case 'PENDIENTE': return 'fas fa-hourglass-half'; // Icono de reloj de arena
      case 'CANCELADO': return 'fas fa-times-circle'; // Icono de X
      default: return 'fas fa-question-circle'; // Icono de pregunta
    }
  }
  // **** FIN NUEVA FUNCIÓN ****
}
