import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoService } from '../../../services/producto';
import { Producto, SaveProducto } from '../../../core/models/producto.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialog } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';
import { ProductoDialog } from '../../../shared/dialogs/producto-dialog/producto-dialog';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './manage-products.html',
  styleUrls: ['./manage-products.scss']
})
export class ManageProducts implements OnInit {

  productos: Producto[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.errorMessage = null; // Sigue limpiando el error al cargar
    // NO LIMPIAR successMessage aquí para que persista después de una acción exitosa
    // this.successMessage = null; // <-- LÍNEA COMENTADA/ELIMINADA
    this.productoService.getProductosAdmin().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'No se pudieron cargar los productos.';
        this.isLoading = false;
        this.successMessage = null; // Si falla la carga, sí limpiamos el mensaje de éxito
      }
    });
  }

  abrirModalProducto(producto?: Producto): void {
    // Limpiar mensajes antes de abrir el modal
    this.successMessage = null;
    this.errorMessage = null;
    const dialogRef = this.dialog.open(ProductoDialog, {
      width: '500px',
      disableClose: true,
      data: producto ? { ...producto } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarProducto(result, producto?.id);
      }
    });
  }


  guardarProducto(payload: SaveProducto, id?: number): void {
    this.errorMessage = null;
    this.successMessage = null;

    const action = id
      ? this.productoService.actualizarProducto(id, payload)
      : this.productoService.crearProducto(payload);

    const successMsg = id ? 'Producto actualizado' : 'Producto creado';
    const errorMsg = id ? 'Error al actualizar' : 'Error al crear';

    action.subscribe({
        next: () => {
          this.successMessage = `${successMsg} exitosamente.`;
          this.errorMessage = null; // Asegurar que no hay mensaje de error
          this.cargarProductos();
          // Opcional: Ocultar mensaje después de 3 segundos
          // setTimeout(() => { this.successMessage = null; }, 3000);
        },
        error: (err: HttpErrorResponse) => { // Mejorar manejo de error
          this.errorMessage = `${errorMsg} el producto. ${err.error?.message || ''}`; // Intentar mostrar mensaje del backend
          this.successMessage = null;
          console.error('Error en guardarProducto:', err);
        }
      });
  }

  confirmarEliminar(id: number, nombre: string): void {
    // Limpiar mensajes antes de abrir el modal
    this.successMessage = null;
    this.errorMessage = null;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.eliminarProducto(id);
      }
    });
  }

  eliminarProducto(id: number): void {
    // No es necesario limpiar aquí porque se limpió en confirmarEliminar
    // this.errorMessage = null;
    // this.successMessage = null;

    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado exitosamente.';
        this.errorMessage = null; // Asegurar que no hay mensaje de error
        this.cargarProductos(); // Esto recargará la lista
         // Opcional: Ocultar mensaje después de 3 segundos
         // setTimeout(() => { this.successMessage = null; }, 3000);
      },
      error: (err: HttpErrorResponse) => { // Mejorar manejo de error
        // Intentar obtener un mensaje más específico del backend
        let detail = err.error || 'Error desconocido del servidor.';
        // Si el backend envía el mensaje "No se puede eliminar..." que configuramos
        if (typeof detail === 'string' && detail.includes('pedidos')) {
           this.errorMessage = detail; // Mostrar mensaje específico de restricción
        } else if (typeof detail === 'string') {
           this.errorMessage = detail; // Mostrar otro mensaje de error del backend
        }
         else {
           this.errorMessage = 'Error al eliminar el producto.'; // Mensaje genérico
        }
        this.successMessage = null;
        console.error('Error en eliminarProducto:', err); // Loguear el error completo en consola del navegador
      }
    });
  }
}