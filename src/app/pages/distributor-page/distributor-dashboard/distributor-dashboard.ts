import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-distributor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './distributor-dashboard.html',
  styleUrls: ['../../../pages/admin-page/admin-dashboard/admin-dashboard.scss'] // Reutilizamos los estilos del admin
})
export class DistributorDashboard {
  // Componente de Layout para el panel de Distribuidor
}