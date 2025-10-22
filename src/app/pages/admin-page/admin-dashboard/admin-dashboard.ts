import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// ¡ASEGÚRATE DE QUE ESTOS ESTÉN IMPORTADOS!
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, // Necesario para mostrar los componentes hijos
    RouterLink,   // Necesario para los enlaces del sidebar
    RouterLinkActive // Necesario para marcar el enlace activo
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard {
  // Este componente actúa como layout
}