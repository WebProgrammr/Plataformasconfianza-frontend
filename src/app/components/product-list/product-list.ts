import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../core/models/producto.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {
  
  productos: Producto[] = [];
  errorMessage: string | null = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching productos', err);
        this.errorMessage = 'No se pudieron cargar los productos.';
      }
    });
  }
}