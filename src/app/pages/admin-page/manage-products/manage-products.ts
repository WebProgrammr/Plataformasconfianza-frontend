import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/producto';
import { Producto, SaveProducto } from '../../../core/models/producto.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './manage-products.html',
  styleUrls: ['./manage-products.scss']
})
export class ManageProducts implements OnInit {

  productos: Producto[] = [];
  productForm!: FormGroup;
  
  isLoading = true;
  isModalOpen = false;
  isEditMode = false;
  selectedProductId: number | null = null;
  
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      imagenUrl: ['', [Validators.maxLength(255)]]
    });
  }

  cargarProductos(): void {
    this.isLoading = true;
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

  abrirModal(producto?: Producto): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.isModalOpen = true;

    if (producto) {
      this.isEditMode = true;
      this.selectedProductId = producto.id;
      this.productForm.patchValue(producto);
    } else {
      this.isEditMode = false;
      this.selectedProductId = null;
      this.productForm.reset({ precio: 0 });
    }
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.productForm.reset({ precio: 0 });
  }

  guardarProducto(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;
    const payload: SaveProducto = this.productForm.value;

    if (this.isEditMode && this.selectedProductId) {
      this.productoService.actualizarProducto(this.selectedProductId, payload).subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado exitosamente.';
          this.cerrarModal();
          this.cargarProductos();
        },
        error: () => {
          this.errorMessage = 'Error al actualizar el producto.';
        }
      });
    } else {
      this.productoService.crearProducto(payload).subscribe({
        next: () => {
          this.successMessage = 'Producto creado exitosamente.';
          this.cerrarModal();
          this.cargarProductos();
        },
        error: () => {
          this.errorMessage = 'Error al crear el producto.';
        }
      });
    }
  }

  eliminarProducto(id: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

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