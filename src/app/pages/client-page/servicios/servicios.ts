import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../../services/producto';
import { Producto } from '../../../core/models/producto.model';
import { HttpErrorResponse } from '@angular/common/http';
// **** NUEVOS IMPORTS ****
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importar MatDialog y MatDialogModule
import { PedidoDialog } from '../../../shared/dialogs/pedido-dialog/pedido-dialog'; // Importar el componente del diálogo
import { PedidoService } from '../../../services/pedido'; // Importar el servicio de Pedido
import { PedidoPayload } from '../../../core/models/api.models'; // Importar el DTO para crear pedido
// **** FIN NUEVOS IMPORTS ****

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatDialogModule // <--- Añadir MatDialogModule aquí
  ],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.scss']
})
export class Servicios implements OnInit, AfterViewInit, OnDestroy {

  productos: Producto[] = [];
  isLoading = true;
  errorMessage: string | null = null; // Mensaje de error al cargar productos
  // **** NUEVAS VARIABLES PARA MENSAJES DE PEDIDO ****
  pedidoSuccessMessage: string | null = null;
  pedidoErrorMessage: string | null = null;
  // **** FIN NUEVAS VARIABLES ****

  private observer!: IntersectionObserver;

  constructor(
    private productoService: ProductoService,
    private el: ElementRef,
    private renderer: Renderer2,
    // **** INYECTAR SERVICIOS ****
    private dialog: MatDialog,
    private pedidoService: PedidoService
    // **** FIN INYECCIÓN ****
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.errorMessage = null; // Limpiar error de carga
    this.pedidoSuccessMessage = null; // Limpiar mensajes de pedido al recargar
    this.pedidoErrorMessage = null;
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.isLoading = false;
        // Esperar un ciclo para asegurar que los elementos estén en el DOM
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
    // La inicialización ahora está en cargarProductos para asegurar que se haga después de obtener los datos
  }

  initializeObserver(): void {
    // Desconectar observer anterior si existe
    if (this.observer) {
      this.observer.disconnect();
    }

    const options = { threshold: 0.1 };
    this.observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'animate-on-scroll');
        } else {
           // Opcional: remover clase si quieres que re-anime al salir y volver
           this.renderer.removeClass(entry.target, 'animate-on-scroll');
        }
      });
    }, options);

    // Seleccionar las tarjetas DESPUÉS de que los productos se hayan cargado
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

  // **** NUEVA FUNCIÓN PARA ABRIR DIÁLOGO Y CREAR PEDIDO ****
  abrirDialogoPedido(producto: Producto): void {
    // Limpiar mensajes previos
    this.pedidoSuccessMessage = null;
    this.pedidoErrorMessage = null;

    const dialogRef = this.dialog.open(PedidoDialog, {
      width: '450px', // Ajusta el ancho si es necesario
      disableClose: true, // Evita que se cierre haciendo clic fuera
      data: { // Pasamos los datos necesarios al diálogo
        productoId: producto.id,
        productoNombre: producto.nombre
      }
      // panelClass: 'futuristic-dialog-container' // Si tienes estilos globales para diálogos
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' contendrá los datos del formulario si el usuario hizo clic en "Enviar Pedido"
      // o será 'undefined' si hizo clic en "Cancelar" o cerró el diálogo
      if (result) {
        console.log('Datos recibidos del diálogo:', result);
        this.crearPedido(result); // Llama a la función para enviar al backend
      } else {
        console.log('Diálogo de pedido cerrado sin datos.');
      }
    });
  }

  crearPedido(pedidoData: PedidoPayload): void {
    this.isLoading = true; // Podrías usar un loader específico para el pedido
    this.pedidoService.crearPedido(pedidoData).subscribe({
      next: (pedidoCreado) => {
        console.log('Pedido creado:', pedidoCreado);
        // Usar find para obtener el nombre del producto de forma segura
        const nombreProducto = this.productos.find(p => p.id === pedidoData.idProducto)?.nombre || 'este servicio';
        this.pedidoSuccessMessage = `¡Pedido para "${nombreProducto}" enviado! Nos pondremos en contacto contigo pronto.`;
        this.isLoading = false;
        // Opcional: Limpiar mensaje después de unos segundos
        setTimeout(() => this.pedidoSuccessMessage = null, 5000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al crear pedido:', err);
        // Intentar obtener el mensaje de error del cuerpo de la respuesta del backend
        const errorMsgBackend = typeof err.error === 'string' ? err.error : err.message;
        this.pedidoErrorMessage = `Error al enviar el pedido. ${errorMsgBackend || 'Intenta más tarde.'}`;
        this.isLoading = false;
        // Opcional: Limpiar mensaje después de unos segundos
        setTimeout(() => this.pedidoErrorMessage = null, 5000);
      }
    });
  }
  // **** FIN NUEVA FUNCIÓN ****
}