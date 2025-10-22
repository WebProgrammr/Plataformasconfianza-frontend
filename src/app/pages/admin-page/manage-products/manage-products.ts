// src/app/pages/admin-page/manage-products/manage-products.ts
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
    this.errorMessage = null;
    this.successMessage = null;
    this.productoService.getProductosAdmin().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'No se pudieron cargar los productos.';
        this.isLoading = false;
      }
    });
  }

  abrirModalProducto(producto?: Producto): void {
    const dialogRef = this.dialog.open(ProductoDialog, {
      width: '500px',
      disableClose: true,
      data: producto ? { ...producto } : null
      // SIN panelClass
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
          this.cargarProductos();
        },
        error: () => {
          this.errorMessage = `${errorMsg} el producto.`;
        }
      });
  }

  confirmarEliminar(id: number, nombre: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`
      }
      // SIN panelClass
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.eliminarProducto(id);
      }
    });
  }

  eliminarProducto(id: number): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado exitosamente.';
        this.cargarProductos();
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el producto.';
      }
    });
  }
}