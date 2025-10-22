import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, OnDestroy } from '@angular/core'; // Añadimos AfterViewInit, ElementRef, Renderer2, OnDestroy
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../../components/product-list/product-list';
import { ResenaListComponent } from '../../../components/resena-list/resena-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductListComponent,
    ResenaListComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, AfterViewInit, OnDestroy { // Implementamos interfaces

  heroTitle = 'Tu Centro de Activaciones Digitales';
  heroSubtitle = 'Plataformas de streaming, software y más, activado al instante.';

  private observer!: IntersectionObserver; // Variable para el observer

  constructor(
    private el: ElementRef, // Inyectamos ElementRef para acceder al DOM
    private renderer: Renderer2 // Inyectamos Renderer2 para manipular el DOM
  ) {}

  ngOnInit(): void {
    // La lógica del ngOnInit se mantiene si la hubiera
  }

  // --- NUEVA LÓGICA PARA ANIMACIÓN DE SCROLL ---
  ngAfterViewInit(): void {
    const options = {
      root: null, // Observa la ventana completa
      rootMargin: '0px',
      threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    };

    this.observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Añadimos la clase de animación cuando entra
          this.renderer.addClass(entry.target, 'animate-on-scroll');
          // (Opcional) Dejamos de observar una vez animado
          // obs.unobserve(entry.target);
        } else {
          // (Opcional) Quitamos la clase si queremos que re-anime al salir y volver a entrar
           this.renderer.removeClass(entry.target, 'animate-on-scroll');
        }
      });
    }, options);

    // Seleccionamos los elementos que queremos observar/animar
    const sectionsToAnimate = this.el.nativeElement.querySelectorAll('.section-to-animate');
    sectionsToAnimate.forEach((section: Element) => {
      this.observer.observe(section);
    });
  }

  ngOnDestroy(): void {
    // Limpiamos el observer al destruir el componente
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  // --- FIN LÓGICA DE ANIMACIÓN ---
}