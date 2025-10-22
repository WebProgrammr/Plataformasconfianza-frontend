import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../../services/producto';
import { Producto } from '../../../core/models/producto.model';
import { HttpErrorResponse } from '@angular/common/http';
// import { RouterLink } from '@angular/router'; // Removido

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, CurrencyPipe], // RouterLink Removido
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.scss']
})
export class Servicios implements OnInit, AfterViewInit, OnDestroy {

  productos: Producto[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private observer!: IntersectionObserver;

  constructor(
    private productoService: ProductoService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.isLoading = false;
        setTimeout(() => this.initializeObserver(), 0);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching productos', err);
        this.errorMessage = 'No se pudieron cargar los servicios.';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // La inicialización ahora está en cargarProductos
  }

  initializeObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    const options = { threshold: 0.1 };
    this.observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'animate-on-scroll');
        } else {
           this.renderer.removeClass(entry.target, 'animate-on-scroll');
        }
      });
    }, options);

    const itemsToAnimate = this.el.nativeElement.querySelectorAll('.service-card');
    itemsToAnimate.forEach((item: Element) => {
      this.observer.observe(item);
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}