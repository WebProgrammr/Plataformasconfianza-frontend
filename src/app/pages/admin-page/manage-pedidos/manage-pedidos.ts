import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../services/admin'; // Importar AdminService
import { Pedido } from '../../../core/models/pedido.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductoService } from '../../../services/producto'; // Para obtener nombres de productos
import { Producto } from '../../../core/models/producto.model';
import { forkJoin, map } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';   // Para confirmaciones
import { MatButtonModule } from '@angular/material/button';          // Para botones
import { MatIconModule } from '@angular/material/icon';              // Para iconos
import { MatMenuModule } from '@angular/material/menu';              // Para menú desplegable de acciones
import { ConfirmDialog } from '../../../shared/dialogs/confirm-dialog/confirm-dialog'; // Diálogo confirmación

@Component({
  selector: 'app-manage-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    MatDialogModule, // Añadir módulos Material
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './manage-pedidos.html',
  styleUrls: ['./manage-pedidos.scss']
})
export class ManagePedidos implements OnInit {

  todosPedidos: Pedido[] = [];
  productosMap: Map<number, Producto> = new Map();
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Estados posibles para el menú de cambio
  estadosPosibles: string[] = ['PENDIENTE', 'COMPLETADO', 'CANCELADO'];

  constructor(
    private adminService: AdminService,
    private productoService: ProductoService,
    private dialog: MatDialog // Inyectar MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarPedidosYProductos();
  }

  cargarPedidosYProductos(): void {
    this.isLoading = true;
    this.errorMessage = null;
    // this.successMessage = null; // No limpiar éxito al recargar

    forkJoin({
      pedidos: this.adminService.getAllPedidos(), // Usar método de AdminService
      productos: this.productoService.getProductos()
    }).pipe(
      map(results => {
        this.productosMap.clear();
        results.productos.forEach(p => this.productosMap.set(p.id, p));
        return results.pedidos;
      })
    ).subscribe({
      next: (data: Pedido[]) => {
        this.todosPedidos = data;
        this.isLoading = false;
        console.log('Todos los pedidos cargados:', this.todosPedidos);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar todos los pedidos o productos:', err);
        this.errorMessage = 'No se pudieron cargar los pedidos.';
        this.isLoading = false;
        this.successMessage = null;
      }
    });
  }

  getNombreProducto(idProducto: number): string {
    return this.productosMap.get(idProducto)?.nombre || 'Desconocido';
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

   getEstadoIconClass(estado: string | null | undefined): string {
    switch (estado?.toUpperCase()) {
      case 'COMPLETADO': return 'fas fa-check-circle';
      case 'PENDIENTE': return 'fas fa-hourglass-half';
      case 'CANCELADO': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  }

  // Función para confirmar y cambiar el estado
  confirmarCambioEstado(pedido: Pedido, nuevoEstado: string): void {
     // Evitar cambiar al mismo estado
     if (pedido.estado?.toUpperCase() === nuevoEstado.toUpperCase()) {
        console.log(`Pedido ${pedido.id} ya está en estado ${nuevoEstado}`);
        return;
     }

     this.errorMessage = null;
     this.successMessage = null;

     const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '400px',
        disableClose: true,
        data: {
          title: `Confirmar Cambio a ${nuevoEstado}`,
          message: `¿Estás seguro de cambiar el estado del pedido #${pedido.id} (${this.getNombreProducto(pedido.idProducto)}) a "${nuevoEstado}"?`
        }
     });

     dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.cambiarEstadoPedido(pedido.id, nuevoEstado);
        }
     });
  }

  // Función que llama al servicio para cambiar el estado
  cambiarEstadoPedido(pedidoId: number, nuevoEstado: string): void {
    console.log(`Intentando cambiar estado del pedido ID ${pedidoId} a ${nuevoEstado}`);
    this.adminService.updatePedidoEstado(pedidoId, nuevoEstado).subscribe({
      next: (pedidoActualizado) => {
        this.successMessage = `Estado del pedido #${pedidoId} actualizado a "${nuevoEstado}" exitosamente.`;
        this.errorMessage = null;
        // Actualizar la lista localmente para reflejar el cambio sin recargar todo
        const index = this.todosPedidos.findIndex(p => p.id === pedidoId);
        if (index > -1) {
           this.todosPedidos[index] = pedidoActualizado;
           // Forzar detección de cambios si es necesario (raro en standalone)
           // this.changeDetectorRef.detectChanges();
        } else {
           this.cargarPedidosYProductos(); // Recargar si no lo encontramos (inesperado)
        }
        console.log('Pedido actualizado:', pedidoActualizado);
        setTimeout(() => this.successMessage = null, 4000); // Ocultar mensaje
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Error al actualizar estado del pedido ${pedidoId}:`, err);
        this.errorMessage = `Error al actualizar estado: ${err.error?.message || err.message || 'Error desconocido'}`;
        this.successMessage = null;
      }
    });
  }
}
