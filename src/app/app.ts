import { Component, HostListener, OnInit, OnDestroy } from '@angular/core'; // Añadimos OnInit, OnDestroy
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, Event as RouterEvent } from '@angular/router'; // Importamos Router, NavigationEnd, Event
import { Subscription } from 'rxjs'; // Importamos Subscription
import { filter } from 'rxjs/operators'; // Importamos filter

import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Navbar,
    Footer,
    NgClass
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit, OnDestroy { // Implementamos interfaces
  title = 'Plataforma Confianza';
  
  isNavbarHidden = false;
  lastScrollY = 0;
  
  // --- NUEVA LÓGICA ---
  isAdminRoute = false; // Variable para saber si estamos en /admin
  private routerSubscription!: Subscription; // Para limpiar la suscripción
  // --- FIN NUEVA LÓGICA ---

  constructor(
    private router: Router // Inyectamos Router
  ) {}

  // --- NUEVA LÓGICA ---
  ngOnInit(): void {
    // Escuchamos los cambios de ruta
    this.routerSubscription = this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Verificamos si la URL actual empieza con /admin
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });
  }

  ngOnDestroy(): void {
    // Limpiamos la suscripción al destruir el componente
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  // --- FIN NUEVA LÓGICA ---

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      this.isNavbarHidden = true;
    } else {
      this.isNavbarHidden = false;
    }
    this.lastScrollY = currentScrollY;
  }
}